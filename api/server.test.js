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
  describe('[GET] /api', () => {
    it('returns our api response', () => {
      return request(server)
        .get('/api')
        .expect('Content-type', /application\/json/)
        .expect(200, { api: 'api is up' })
    });
  });

  describe('[GET] /api/pokemon', () => {
    // inserting entries into our empty db
    beforeEach(async ()=>{
      await Pokemon.create({name: 'Pikachu'})
      await Pokemon.create({name: 'Charizard'})
    });

  // since the db is empty, I'm expecting an array with the items in the beforeEach above
    it('returns an array of Pokemon from our db', () => {
      return request(server)
        .get('/api/pokemon')
        .expect(200, [{ id: 1, name: 'Pikachu' }, { id: 2, name: 'Charizard' }])
    });
  });

  describe('[GET] /api/pokemon/:id', () =>{
    // setting up global variable 
    let pokemon;
    beforeEach(async ()=> {
      // assigning global variable to be our table insert
      pokemon = await Pokemon.create({name: 'Pikachu'})
      console.log('pokemon global variable: ', pokemon)
    });

    it('can return a pokemon based on its id', async () => {
      // putting our response to be our id params
      const res = await request(server).get(`/api/pokemon/${pokemon.id}`)
      expect(res.body).toMatchObject({name: 'Pikachu'})
    });

    it(`gives us a 404 response for pokemon that don't exist`, async () => {
      // have to put a HTTP code expectation on the async get 
      const res = await request(server).get(`/api/pokemon/1245`).expect(404)
      expect(res.body).toMatchObject({message: 'Pokemon not found'})
    });
  });

  describe('[POST] /api/pokemon', ()=>{
    it('can create a Pokemon entry and return it', async () => {
      const res = await request(server).post('/api/pokemon').send({name: 'Magikarp'})

      // Verify our response that we sent to our db 
      expect(res.body).toMatchObject({ name: 'Magikarp' })
      // making sure our entry is the ONLY entry in the db
      expect(await Pokemon.getAllPoke()).toHaveLength(1) 
    })
  });

  describe('[DELETE] /api/pokemon/:id', () => {
    let pokemon;

    beforeEach(async () => {
      pokemon = await Pokemon.create({ name: 'Pikachu' });
    });

    it('deletes the pokemon when it exists', async () => {
      const res = await request(server).delete(`/api/pokemon/${pokemon.id}`).expect(200);

      // matching our success message to make sure we actually deleted the entry (using the model's message)
      expect(res.body).toMatchObject({ message: 'Successfully removed Pokemon' }); 
      // Making sure our entry actually got deleted
      expect(await Pokemon.getPokemon(pokemon.id)).toBeUndefined(); 
    });

    it(`returns a 404 when pokemon with specific id doesn't exist`, async () => {
      const res = await request(server).delete('/api/pokemon/112315');

      // matchoing our 404 error to make sure it correctly denies the entry to not exist
      expect(res.body).toMatchObject({ message: 'Pokemon not found' }) 
      // making sure that the entry that failed to be removed actually does not exist
      expect(await Pokemon.getPokemon(pokemon.id)).not.toBeUndefined() 
    })
  });

});