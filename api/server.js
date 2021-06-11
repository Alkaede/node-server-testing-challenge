const express = require('express');

const Pokemon = require('./pokemon/pokemon-model');

const server = express();

server.use(express.json());

server.get('/api', (req, res) => {
  res.status(200).json({api: 'api is up'})
})

// getting all the pokemon
server.get('/api/pokemon', (req,res) => {
  Pokemon.getAllPoke()
    .then(poke => {
      res.status(200).json(poke)
    })
    .catch(err => {
      res.status(500).json(err)
    })
});

// api call to get a specific pokemon by id
server.get('/api/pokemon/:id', (req,res) => {
  const {id} = req.params
  Pokemon.getPokemon(id)
    .then(poke => {
      if(!poke){
        res.status(404).json({message: 'Pokemon not found'})
      }else{
        res.status(200).json(poke)
      }
    })
    .catch(err => {
      res.status(500).json(err)
    })
});

// adding pokemon
server.post('/api/pokemon', (req, res) => {
  const poke = req.body
  Pokemon.create(poke)
    .then(pokemon => {
      res.status(201).json(pokemon)
    })
    .catch(err => {
      res.status(500).json(err)
    })
});

//deleting a certain pokemon by id
server.delete('/api/pokemon/:id', (req, res) => {
  const {id} = req.params
  Pokemon.remove(id)
  .then(obj => {
    if (obj) {
      res.json({ message: 'Successfully removed Pokemon' });
    } else {
      res.status(404).send({ message: 'Pokemon not found' });
    }
  })
  .catch(err => {
    res.status(500).json(err);
  })
})


module.exports = server;