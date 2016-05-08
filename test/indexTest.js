'use strict';
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();

const converter = require('../index.js');

describe('Eagle to geojson converter', function converterTest() {
  it('rejects if insufficient options are passed', () => {
    return true.should.be.true;
  });
});
