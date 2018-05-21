const Cube = require('cano-cube');

class CubeTest extends Cube {
  constructor(cano) {
    super(cano);
  }

  validate() {
    return Promise.resolve();
  }

  prepare() {
    return Promise.resolve();
  }

  up() {
    return Promise.resolve();
  }

}

module.exports = [CubeTest];
