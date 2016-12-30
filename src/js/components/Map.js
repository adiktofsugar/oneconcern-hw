/* global $, mapboxgl */
import React, {PropTypes, Component} from 'react';

const defaultBounds = mapboxgl.LngLatBounds.convert([
    mapboxgl.LngLat.convert([ // SW
        -122.5375628,
        37.6619587
    ]),
    mapboxgl.LngLat.convert([ // NE
        -122.3418924,
        37.834388
    ])
]);

class Map extends Component {
    constructor(props) {
        super(props);
    }
    componentWillReceiveProps(nextProps) {
        this.refreshMapData(nextProps);
    }
    createMap() {
        this.map = new mapboxgl.Map({
            container: this.refs.map,
            style: 'mapbox://styles/mapbox/streets-v9',
            maxBounds: this.props.bounds,
            zoom: 5
        });

        this._mapLoaded = false;
        this.map.on('load', () => {
            this._mapLoaded = true;

            this.map.addSource("points", {
                type: "geojson",
                data: this.getMapData(this.props)
            });
            this.map.addLayer({
                id: "points",
                type: "symbol",
                source: "points",
                layout: {
                    "icon-image": "{icon}-15",
                    "icon-allow-overlap": true
                }
            });
        });

        this.popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });
        

        this.map.on('mousemove', (event) => {
            if (!this._mapLoaded) {
                return;
            }
            var features = this.map.queryRenderedFeatures(event.point, { layers: ['points'] });
            
            // Change the cursor style as a UI indicator.
            this.map.getCanvas().style.cursor = (features && features.length) ? 'pointer' : '';

            if (!features.length) {
                this.popup.remove();
                return;
            }

            var feature = features[0];

            // Populate the popup and set its coordinates
            // based on the feature found.
            var {point_id, name, description, num_residents} = feature.properties;
            var $form = $('<form>');
            $form.append(
                $('<input name="name" type="text" placeholder="Name" />')
                .val(name)
            )
            $form.append(
                $('<input name="description" type="text" placeholder="Description" />')
                .val(description)
            )
            $form.append(
                $('<input name="num_residents" type="numnber" placeholder="No. Residents" />')
                .val(num_residents)
            )
            $form.append(
                $('<button type="submit" class="btn-flat">Save</button>')
                .on('click', (e) => {
                    e.preventDefault();
                    var name = $form[0].name.value;
                    var description = $form[0].description.value;
                    var num_residents = $form[0].num_residents.value;
                    this.props.onPointEdit(point_id, {name, description, num_residents});
                })
            )

            this.popup.setLngLat(feature.geometry.coordinates)
                .setDOMContent($form[0])
                .addTo(this.map);
        });

        this.map.on('click', (event) => {
            var lngLat = event.lngLat;
            this.props.onPointEdit(null, {
                lng: lngLat.lng,
                lat: lngLat.lat
            });
        });
    }
    destroyMap() {
        if (!this.map) return;
        this.map.remove();
    }
    refreshMapData(props) {
        if (!this._mapLoaded) return;
        props = props || this.props;
        this.map.getSource('points').setData(this.getMapData(props));
    }
    getMapData(props) {
        return {
            type: "FeatureCollection",
            features: props.points.map((point) => {
                return {
                    "type": "Feature",
                    "properties": {
                        "point_id": point.id,
                        "name": point.name,
                        "description": point.description,
                        "num_residents": point.num_residents,
                        "icon": "theatre"
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [point.lng, point.lat]
                    }
                }
            })
        }
    }
    componentDidMount() {
        this.createMap();
    }
    componentWillUnmount() {
        this.destroyMap();
    }
    render() {
        return (
            <div ref="map" className="map"></div>
        );
    }
}
Map.defaultProps = {
    bounds: defaultBounds,
    points: [],
    onPointEdit() {}
}

export default Map;
