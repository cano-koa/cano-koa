const Koa = require('koa');
const _ = require('lodash');
let path = require('path');

module.exports = class Core extends Koa {
  /**
   * @constructs
   * @author Ernesto Rojas <ernesto20145@gmail.com>
   */
  constructor(path) {
    super();
    this.app = _.assign({}, buildPaths(path));
    this.app.config = buildConfig(this.app.paths.config);
    this.log = this.app.config.log;
  }
  /**
   * @method up
   * @description This method allows the koa server to get up after the cubes load correctly.
   * @returns {Promise} This promise when resolved will return the server object.
   * @author Ernesto Rojas <ernesto20145@gmail.com>
   */
  up() {
    const cubes = instantCubes(this, this.app.config.cubes);
    const self = this;
    return new Promise((resolve, reject) => {
      global.cano = self;
      initCubesLifeCycle(cubes)
      .then(() => {
        const port = self.app.config.web.port;
        self.log('Ready for listen events on port', port, ' :)');
        resolve(self.listen(port));
      }).catch(reject);
    });
  }
  
}

/**
 * @method buildPaths
 * @param {string} String with the root path of the application.
 * @description This method builds an object with the necessary paths for cano.
 * @returns {object} Object that contains the paths for configuration, API and root of the application.
 * @author Ernesto Rojas <ernesto20145@gmail.com>
 */
function buildPaths(root) {
  return {
    paths: {
      config: path.join(root, '/config'),
      api: path.join(root, '/api'),
      root,
    },
  }
}

/**
 * @method buildConfig
 * @param {string} String with the path to the configuration files.
 * @description This method allows configuration files to be required in the same object.
 * @returns {object} Object with the required configuration files.
 * @author Ernesto Rojas <ernesto20145@gmail.com>
 */
function buildConfig(path) {
  return _.merge({}, configDafault, require('require-all')(path));
}

/**
 * @method instantCubes
 * @param {object} Object cano.
 * @param {array} Array with cubes class.
 * @description This method instantiates all cubes referenced in the configuration object.
 * @returns {array} Array with the instantiates cubes.
 * @author Ernesto Rojas <ernesto20145@gmail.com>
 */
function instantCubes(cano, cubes = []) {
  return cubes.map(Cube => new Cube(cano));
}

/**
 * @method initCubesLifeCycle
 * @param {array} Array with all the cubes that will be added to Cano
 * @description This method start the life cycle execution (validate -> prepare -> up)
 * of all cubes added to cano
 * @returns {Promise} Promise that will be fullfiled when all the cubes are loaded and started
 * otherwise it will be rejected
 * @author Antonio Mejias
 */
function initCubesLifeCycle(cubes) {
  return new Promise((resolve, reject) => {
    const promises = _.map(cubes, cube => promisifyCubeLifeCycle(cube))
    Promise
        .all(promises)
        .then(resolve)
        .catch(reject)
  })
}

/**
 * @method promisifyCubeLifeCycle
 * @param {object} Cube object
 * @description This method will promify the cube life cycle process
 * @returns {Promise} Promise wrapping all the cube life cycle
 * @author Antonio Mejias
 */
function promisifyCubeLifeCycle(cube) {
  return new Promise((resolve, reject) => {
      cube.validate()
          .then(() => cube.prepare())
          .then(() => cube.up())
          .then(resolve)
          .catch(reject)
  })
}

// Object with configuration default.
const configDafault = {
  web: {
    port: process.env.PORT || 20145,
    env: process.env.NODE_ENV || 'development',
  },
  log: console.log,
};