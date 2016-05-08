'use strict';
const fs = require('fs');
const parseString = require('xml2js').parseString;
const FeatureBuilder = require('./lib/featureBuilder');
const featureBuilder = new FeatureBuilder;

const argv = require('yargs')
    .usage('Usage: index.js --board [Eagle 7 board] --schema [Eagle 7 schema file] --output [output json file]')
    .demand(['brd','sch', 'output'])
    .alias('brd', 'board')
    .alias('sch', 'schema')
    .alias('o', 'output')
    .argv;


const boardXML = fs.readFileSync(argv.board, 'utf-8');
const schemaXML = fs.readFileSync(argv.schema, 'utf-8');


parseString(boardXML, (err, boardJS) => {
  if (err) throw (err);
  const boardGeoJSON = {
    type: 'FeatureCollection',
    features: []
  };

  boardJS.eagle.drawing[0].board[0].elements[0].element.forEach(
    element => boardGeoJSON.features.push(featureBuilder.element2feature(element))
  );

  boardJS.eagle.drawing[0].board[0].signals[0].signal.forEach(
      signal => boardGeoJSON.features.push(featureBuilder.signal2feature(signal))
  );
  
  fs.writeFileSync(argv.output, JSON.stringify(boardGeoJSON, null, 2));
});
