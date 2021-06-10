const express = require('express');

const Pokemon = require('./pokemon/pokemon-model');

const server = express();

server.use(express.json());

server.get('/api', (req, res) => {
  res.status(200).json({api: 'api is up'})
})

server.get('/api/pokemon', (req,res) => {
  Pokemon.getAllPoke()
    .then(poke => {
      res.status(200).json(poke)
    })
    .catch(err => {
      res.status(500).json(err)
    })
})

// server.post('/api/pokemon', (req, res) => {
//   Pokemon.create()
// })


module.exports = server;