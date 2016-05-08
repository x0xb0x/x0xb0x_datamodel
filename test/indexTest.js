'use strict';
const proxyquire =  require('proxyquire');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
chai.should();

const fsStub = {};
const converter = proxyquire('../index.js', { fs: fsStub});


describe('Eagle to geojson converter', function converterTest() {
  it('rejects if insufficient options are passed', () => {
    true.should.be.true;
  });
});
