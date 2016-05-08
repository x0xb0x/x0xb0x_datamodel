'use strict';
const argv = require('yargs')
    .usage('Usage: index.js --board [Eagle 7 board] --schema [Eagle 7 schema file] --output [output json file]')
    .demand(['brd','sch', 'output'])
    .alias('brd', 'board')
    .alias('sch', 'schema')
    .alias('o', 'output')
    .argv;

const fs = require('fs');
const parseString = require('xml2js').parseString;

const boardXML = fs.readFileSync(argv.board, 'utf-8');
const schemaXML = fs.readFileSync(argv.schema, 'utf-8');

const startsWithMap = {
  C: 'http://dbpedia.org/resource/Capacitor',
  D: 'http://dbpedia.org/resource/Diode',
  DIN: 'http://dbpedia.org/resource/DIN_connector',
  IC: 'http://dbpedia.org/resource/Integrated_circuit',
  J: 'http://dbpedia.org/resource/Jumper_wire',
  Q: 'http://dbpedia.org/resource/Transistor',
  R: 'http://dbpedia.org/resource/Resistor',
  S: 'http://dbpedia.org/resource/Switch',
  SW: 'http://dbpedia.org/resource/Toggle_switch',
  TM: 'http://dbpedia.org/resource/Trim_pot',
  VR: 'http://dbpedia.org/resource/Variable_resistor'
};

parseString(boardXML, (err, boardJS) => {
  if (err) throw (err);
  const boardGeoJSON = {
    type: 'FeatureCollection',
    features: []
  };

  boardJS.eagle.drawing[0].board[0].elements[0].element.forEach(element => {
    const feature = {
      type: 'Feature',
      properties: element.$,
      geometry: {
        type: 'Point',
        coordinates: [ parseFloat(element.$.x), parseFloat(element.$.y) ]
      }
    };

    const componentCode = element.$.name.replace(/(\D*)(\d*)/, '$1');

    if (componentCode) {
      feature.properties.type = startsWithMap[componentCode];
    }

    delete feature.properties.x;
    delete feature.properties.y;

    boardGeoJSON.features.push(feature);
  });

  boardJS.eagle.drawing[0].board[0].signals[0].signal.forEach(signal => {
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

    boardGeoJSON.features.push(feature);
  });
  fs.writeFileSync(argv.output, JSON.stringify(boardGeoJSON, null, 2));
});
