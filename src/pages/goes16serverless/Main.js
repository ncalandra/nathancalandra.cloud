import React, {Component} from 'react';
import './Main.css';

// Axois Import
import axios from 'axios';

// OpenLayers imports
import 'ol/ol.css';
import OLMap from 'ol/Map';
import LayerGroup from 'ol/layer/Group';
import LayerTile from 'ol/layer/Tile';
import LayerVector from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import SourceXYZ from 'ol/source/XYZ';
import SourceTileWMS from 'ol/source/TileWMS';
import View from 'ol/View';
import {fromLonLat} from 'ol/proj';
import Draw, {createBox} from 'ol/interaction/Draw.js';

// Local imports
import BaseLayersControl from './BaseLayersControl.js';
import DownloadModal from './DownloadModal.js';
import OverlaySelector from './OverlaySelector.js';
import gifConverter from './gifConverter.js';

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
      // Empty draw layer
      drawLayer: new LayerVector({
        source: new VectorSource({
          features: []
        }),
      }),
      // coverage drawn
      download: false,
      showModal: false,
      loading: false,
      products: [],
      selectedProduct: null,
      selectedLayer: null,
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
        this.state.overlays,
        this.state.drawLayer
      ],
      view: new View({
        center: fromLonLat([-90, 38]),
        zoom: 5
      })
    });

    this.setState({
      map: map,
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

        // Set initial layer
        const selectedLayer = newLayers.getArray()
          .filter(layer => {
            return layer.get('product') === products[0];
          })
          .map(layer => {
            return layer.get('name');
          })[0];

        this.setState({
          ...this.state,
          products: products,
          selectedProduct: products[0],
          selectedLayer: selectedLayer,
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
    this.setState({
      selectedLayer: layername
    });
  }

  drawCoverage = () => {
    // Clear old layers
    this.state.drawLayer.setSource(new VectorSource({features: []}));

    // Add draw interactions & handle draw end events
    let drawCoverageInteraction = new Draw({
      source: this.state.drawLayer.getSource(),
      type: 'Circle',
      geometryFunction: createBox(),
    });
    drawCoverageInteraction.on('drawend', (event) => {
      this.state.map.removeInteraction(drawCoverageInteraction);
      this.setState({download: true});
    });

    this.state.map.addInteraction(drawCoverageInteraction);
  }

  openDownloadModal = () => {
    this.setState({showModal: true});
  }

  downloadAnimation = (layers) => {
    const feature =  this.state.drawLayer.getSource().getFeatures()[0];
    const bounds = feature.getGeometry().getExtent();

    const xdiff = Math.abs(bounds[0] - bounds[2]);
    const ydiff = Math.abs(bounds[1] - bounds[3]);

    const height = 512;
    const width = Math.round(xdiff / ydiff * height);

    this.setState({loading: true});
    let urls = layers.map(layer => {
      return API_URL + '/wms?' +
        'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=false&' +
        'LAYERS=' + layer + '&' +
        'STYLES=cloud_moisture&' +
        'WIDTH=' + width + '&HEIGHT=' + height + '&' +
        'CRS=EPSG:3857&' +
        'BBOX=' + bounds.join(',');
    });

    gifConverter(urls, width, height)
      .then(gif => {
        const url = window.URL.createObjectURL(new Blob([gif.out.getData()]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'animation.gif');
        document.body.appendChild(link);
        link.click();
      })
      .then(() => this.setState({loading: false}));
  }

  downloadImage = () => {
    const feature =  this.state.drawLayer.getSource().getFeatures()[0];
    const bounds = feature.getGeometry().getExtent();

    const xdiff = Math.abs(bounds[0] - bounds[2]);
    const ydiff = Math.abs(bounds[1] - bounds[3]);

    const height = 512;
    const width = Math.round(xdiff / ydiff * height);

    this.setState({loading: true});
    this.fetchWMSImage(this.state.selectedLayer, bounds, width, height)
      .then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'layer.png');
        document.body.appendChild(link);
        link.click();
      })
      .then(() => this.setState({loading: false}));

    // this.setState({download: false});
    // this.state.drawLayer.setSource(new VectorSource({features: []}));
  }

  fetchWMSImage = (layer, bbox, width, height) => {
    return axios({
      method: 'get',
      url: API_URL + '/wms?' +
        'SERVICE=WMS&VERSION=1.3.0&REQUEST=GetMap&FORMAT=image/png&TRANSPARENT=false&' +
        'LAYERS=' + layer + '&' +
        'STYLES=cloud_moisture&' +
        'WIDTH=' + width + '&HEIGHT=' + height + '&' +
        'CRS=EPSG:3857&' +
        'BBOX=' + bbox.join(','),
      headers: {
        'Accept': 'image/webp,*/*'
      },
      responseType: 'arraybuffer',
    });
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
      <div style={{overflow: 'hidden'}}>
        <div className="Map" ref="mapContainer" />
        <BaseLayersControl
          baseLayers={baseLayers}
          updateBaseLayer={this.updateBaseLayer}
        />
        <OverlaySelector
          products={this.state.products}
          download={this.state.download}
          layers={overlays}
          updateProduct={this.updateProduct}
          updateOverlay={this.updateOverlay}
          drawCoverage={this.drawCoverage}
          openDownloadModal={this.openDownloadModal}
        />
        {this.state.selectedLayer && <DownloadModal
          show={this.state.showModal}
          onHide={() => {
            // Clear selected area
            this.state.drawLayer.setSource(new VectorSource({features: []}));
            this.setState({showModal: false, download: false});
          }}
          selectedProduct={this.state.selectedProduct}
          selectedLayer={this.state.selectedLayer}
          downloadImage={this.downloadImage}
          downloadAnimation={this.downloadAnimation}
          layers={overlays}
          loading={this.state.loading}
        />}
      </div>
    );
  }
}

export default Map;
