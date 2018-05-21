const Cano = require('../index.js');


describe('Cano framework tests', () => {

  let cano;

  it('Should instance the framework', () => {
    cano = new Cano(__dirname);
  });

  it('Should up the framework', (done) => {
    cano.up().then(() => done()).catch(done);
  });

});
