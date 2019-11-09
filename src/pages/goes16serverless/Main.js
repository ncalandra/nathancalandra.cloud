import React, {Component} from 'react';
import './Main.css';

// Requset Import
import request from 'request-promise-native';

// OpenLayers imports
import 'ol/ol.css';
import OLMap from 'ol/Map';
import LayerGroup from 'ol/layer/Group';
import LayerTile from 'ol/layer/Tile';
import SourceXYZ from 'ol/source/XYZ';
import SourceTileWMS from 'ol/source/TileWMS';
import View from 'ol/View';
import {fromLonLat} from 'ol/proj';

// Local imports
import BaseLayersControl from './BaseLayersControl.js';
import OverlaySelector from './OverlaySelector.js';

class Map extends Component {

  constructor(props) {
    super(props);

    // Initialize state
    this.state = {
      map: null,
      // Base layer group
      baseLayers: new LayerGroup({
        layers: [
          new LayerTile({
            source: new SourceXYZ({
              url: 'https://c.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png'
            }),
            name: 'CartoDB Dark',
            visible: true
          }),
          new LayerTile({
            source: new SourceXYZ({
              url: 'https://c.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png'
            }),
            name: 'CartoDB Light',
            visible: false
          })
        ]
      }),
      // Empty overlay group
      overlays: new LayerGroup({})
    };
  }

  componentDidMount() {
    /*
     * Because OpenLayers does not work harmoniously with react this is where the Map is "constructed"
     */

    let map = new OLMap({
      target: this.refs.mapContainer,
      layers: [
        this.state.baseLayers,
        this.state.overlays
      ],
      view: new View({
        center: fromLonLat([-75, 30]),
        zoom: 4
      })
    });

    this.setState({
      map: map
    });

    // Get list of layers
    request({
      uri: 'https://kxw11f6zn4.execute-api.us-east-1.amazonaws.com/demo/layers',
      headers: {},
      json: true
    })
      .then(response => {
        let layers = response
          .sort((layer_1, layer_2) => {
            return layer_1 < layer_2;
          })
          .map(layer => {
            return new LayerTile({
              source: new SourceTileWMS({
                url: 'https://kxw11f6zn4.execute-api.us-east-1.amazonaws.com/demo/wms',
                params: {
                  'LAYERS': layer,
                  'STYLES': 'asdf'
                }
              }),
              opacity: 0.5,
              name: layer,
              visible: false
            });
          });
        layers[0].setVisible(true);

        const newLayers = this.state.overlays.getLayers().extend(layers);
        this.state.overlays.setLayers(newLayers);
        this.setState(this.state);
      });
  }

  updateBaseLayer = (event) => {
    this.state.baseLayers.getLayers().forEach(layer => {
      if (layer.get('name') === event.target.id) {
        layer.setVisible(event.target.checked);
      } else {
        layer.setVisible(!event.target.checked);
      }
    });
    this.setState(this.state);
  }

  updateOverlay = (event) => {
    this.state.overlays.getLayers().forEach(layer => {
      if (layer.get('name') === event.target.value) {
        layer.setVisible(true);
      } else {
        layer.setVisible(false);
      }
    });
    this.setState(this.state);
  }

  render() {

    const baseLayers = this.state.baseLayers.getLayers().getArray().map(layer => {
      return {
        name: layer.get('name'),
        visible: layer.getVisible()
      };
    });

    const overlays = this.state.overlays.getLayers().getArray().map(layer => {
      return {
        name: layer.get('name'),
        visible: layer.getVisible()
      };
    });

    return (
      <div>
        <div className="Map" ref="mapContainer" />
        <BaseLayersControl
          baseLayers={baseLayers}
          updateBaseLayer={this.updateBaseLayer}
        />
        <OverlaySelector
          layers={overlays}
          updateOverlay={this.updateOverlay}
        />
      </div>
    );
  }
}

export default Map;
