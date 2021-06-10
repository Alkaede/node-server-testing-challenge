const request = require('supertest')
const server = require('./server');
const db = require('../data/dbConfig');
const Pokemon = require('./pokemon/pokemon-model');

describe('server.js', () => {
  // we run these commands once for our database to rollback then migrate
  beforeAll(async () => {
    await db.migrate.rollback();
    await db.migrate.latest();
  });

  // we want to truncate the entire database everytime so we can run tests with a fresh table+
  beforeEach(async () => {
    await db('pokemon').truncate();
  })

  // essentially deleting the entire db, helps with dataleaks 
  afterAll(async () => {
    await db.destroy();
  })

  //testing to see if we are able to connect to api with supertest
  describe('[GET]', () => {
    it('returns our api response', () => {
      return request(server)
        .get('/api')
        .expect(200, { api: 'api is up' })
    });
  });
});