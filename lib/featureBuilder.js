'use strict';
const startsWithMap = require('../mappings/part_codes.json');

class FeatureBuilder {
  element2feature(element) {
    const feature = {
      type: 'Feature',
      properties: element.$,
      geometry: {
        type: 'Point',
        coordinates: [ parseFloat(element.$.x), parseFloat(element.$.y) ]
      }
    };

    const componentCode = element.$.name.replace(/(\D*)(\d*)/, '$1');
    if (!componentCode) throw new Error('Unable to read component type definition from mapping in ./mappings/part_codes.json');

    if (componentCode) {
      feature.properties.type = startsWithMap[componentCode];
    }

    delete feature.properties.x;
    delete feature.properties.y;

    return feature;
  }

  signal2feature(signal) {
    const feature = {
      type: 'Feature',
      properties: signal.$,
      geometry: {
        type: 'MultiLineString',
        coordinates: []
      }
    };

    feature.properties.from = signal.contactref[0].$;
    feature.properties.to = signal.contactref[1].$;

    signal.wire.forEach(wire => feature.geometry.coordinates
        .push([ [ parseFloat(wire.$.x1), parseFloat(wire.$.y1) ], [parseFloat(wire.$.x2), parseFloat(wire.$.y2) ]]));

    return feature;

  }
}

module.exports = FeatureBuilder;