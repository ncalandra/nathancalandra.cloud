import React, {Component} from 'react';
import './Main.css';

// OpenLayers imports
import 'ol/ol.css';
import OLMap from 'ol/Map';
import LayerGroup from 'ol/layer/Group';
import LayerTile from 'ol/layer/Tile';
import SourceOSM from 'ol/source/OSM';
import View from 'ol/View';
import {fromLonLat} from 'ol/proj';

// Local imports
import LayersControl from './LayersControl.js'

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
            source: new SourceOSM(),
            name: 'OSM'
          })
        ]
      })
    };
  }

  componentDidMount() {
    /*
     * Because OpenLayers does not work harmoniously with react this is where the Map is "constructed"
     */

    let map = new OLMap({
      target: this.refs.mapContainer,
      layers: [
        this.state.baseLayers
      ],
      view: new View({
        center: fromLonLat([37.41, 8.82]),
        zoom: 4
      })
    });

    this.setState({
      map: map
    })
  }

  updateBaseLayer = (event) => {
    this.state.baseLayers.getLayers().forEach(layer => {
      if (layer.get('name') === event.target.id) {
        layer.setVisible(event.target.checked)
      } else {
        layer.setVisible(!event.target.checked)
      }
    })
    this.setState(this.state)
  }

  render() {

    const baseLayers = this.state.baseLayers.getLayers().getArray().map(layer => {
      return {
        name: layer.get('name'),
        visible: layer.getVisible()
      }
    })

    return (
      <div>
        <div className="Map" ref="mapContainer">
          {this.state.showPopup && <div ref="popup" className="ol-popup ">
              <div className="popup-content" ref="popupContent"></div>
           </div>}
        </div>
        <LayersControl
          baselayers={baseLayers}
          updateBaseLayer={this.updateBaseLayer}
        />
      </div>
    );
  }
}

export default Map;
