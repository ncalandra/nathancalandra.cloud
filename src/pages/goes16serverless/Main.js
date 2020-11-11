import React, {Component} from 'react';
import './Main.css';

// Axois Import
import axios from 'axios';

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


const API_URL = 'https://4emlmvx17b.execute-api.us-east-1.amazonaws.com/demo';


const styleMap = {
  'ABI-L2-CMIPF-M6C01': 'aerosols',
  'ABI-L2-CMIPF-M6C09': 'cloud_moisture',
  'ABI-L2-CMIPC-M6C09': 'cloud_moisture'
};

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
      overlays: new LayerGroup({}),
      products: [],
      selectedProduct: null
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
        center: fromLonLat([-90, 38]),
        zoom: 5
      })
    });

    this.setState({
      map: map
    });

    // Get list of layers
    axios({
      method: 'get',
      url: API_URL + '/layers',
      headers: {},
    })
      .then(response => {
        let products = [...this.state.products];
        let layers = response.data
          .sort((layer_1, layer_2) => {
            return layer_1 < layer_2;
          })
          .map(layer => {
            const product = layer.split('/').slice(-1)[0].split('_')[1];
            if (!products.includes(product)) {
              products.push(product);
            }

            return new LayerTile({
              source: new SourceTileWMS({
                url: API_URL + '/wms',
                params: {
                  'LAYERS': layer,
                  'STYLES': styleMap[product]
                }
              }),
              opacity: 0.9,
              name: layer,
              product: product,
              visible: false
            });
          });
        layers[0].setVisible(true);

        const newLayers = this.state.overlays.getLayers().extend(layers);
        this.state.overlays.setLayers(newLayers);
        this.setState({
          ...this.state,
          products: products,
          selectedProduct: products[0]
        });
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

  updateProduct = (event) => {
    // Turn on most recent layer for this product
    let visible = true;
    this.state.overlays.getLayers().forEach(layer => {
      if (layer.get('product') === event.target.value && visible) {
        layer.setVisible(true);
        visible = false;
      } else {
        layer.setVisible(false);
      }
    });

    this.setState({
      selectedProduct: event.target.value
    });
  }

  updateOverlay = (layername) => {
    this.state.overlays.getLayers().forEach(layer => {
      if (layer.get('name') === layername) {
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

    const overlays = this.state.overlays.getLayers().getArray()
      .filter(layer => {
        return layer.get('product') === this.state.selectedProduct;
      })
      .map(layer => {
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
          products={this.state.products}
          layers={overlays}
          updateProduct={this.updateProduct}
          updateOverlay={this.updateOverlay}
        />
      </div>
    );
  }
}

export default Map;
