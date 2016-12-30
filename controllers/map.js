var User = require('../models/User');
var Map = require('../models/Map');
var MapPoint = require('../models/MapPoint');


exports.index = (req, res) => {
    var {error, next} = req.query;

    Map.findAll({
        where: {
            user_id: req.user.id
        }
    }).then((maps) => {
        res.json(maps.map((m) => m.get({plain: true})));
    }).catch((error) => {
        res.status(500).json({ error: error.message });
    });
}

exports.create = (req, res) => {
    var sw_lng = req.body.sw_lng;
    var sw_lat = req.body.sw_lat;
    var ne_lng = req.body.ne_lng;
    var ne_lat = req.body.ne_lat;
    var user_id = req.user.id;
    Map.create({user_id, sw_lng, sw_lat, ne_lng, ne_lat})
    .then((map) => {
        res.json(map.get({ plain: true }));
    })
    .catch((error) => {
        res.status(500).json({ error: error.message });
    });
    return;
}

exports.update = (req, res) => {
    var mapId = req.params.id;
    
    Map.findById(mapId)
    .then((map) => {
        ['sw_lng', 'sw_lat', 'ne_lng', 'ne_lat'].forEach((paramName) => {
            map.set(paramName, req.body[paramName]);
        });
        return map.save();
    })
    .then((map) => {
        res.json(map.get({ plain: true }));
    })
    .catch((error) => {
        res.status(500).json({ error: error.message });
    });
}

exports.delete = (req, res) => {
    var mapId = req.params.id;
    MapPoint.findAll({
        where: {
            map_id: mapId
        }
    })
    .then((mapPoints) => {
        mapPoints.forEach((mapPoint) => {
            mapPoint.destroy()
        })
        return;
    })
    .then(() => {
        return Map.findById(mapId)
    })
    .then((map) => {
        return map.destroy();
    })
    .then(() => {
        res.json(null);
    })
    .catch((error) => {
        res.status(500).json({ error: error.message });
    });

}

exports.pointIndex = (req, res) => {
    var map_id = req.params.map_id;
    MapPoint.findAll({
        where: {
            map_id: map_id
        }
    })
    .then((mapPoints) => {
        res.json(mapPoints.map((mp) => mp.get({plain: true})));
    })
    .catch((error) => {
        res.status(500).json({ error: error.message });
    })
}
exports.pointCreate = (req, res) => {
    var map_id = req.params.map_id;
    var lat = req.body.lat;
    var lng = req.body.lng;
    var name = req.body.name;
    var description = req.body.description;
    var num_residents = req.body.num_residents;
    MapPoint.create({map_id, lat, lng, name, description, num_residents})
    .then((mapPoint) => {
        res.json(mapPoint.get({ plain: true }));
    })
    .catch((error) => {
        res.status(500).json({ error: error.message });
    });
}
exports.pointUpdate = (req, res) => {
    var map_id = req.params.map_id;
    var point_id = req.params.id;
    
    MapPoint.findById(point_id)
    .then((mapPoint) => {
        if (!mapPoint) {
            throw new Error('point not found with id ' + point_id);
        }
        ['lat', 'lng', 'name', 'description', 'num_residents'].forEach((paramName) => {
            mapPoint.set(paramName, req.body[paramName]);
        });
        return mapPoint.save();
    })
    .then((mapPoint) => {
        res.json(mapPoint.get({ plain: true }));
    })
    .catch((error) => {
        res.status(500).json({ error: error.message });
    });
}
