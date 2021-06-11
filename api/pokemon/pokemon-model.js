const db = require('../../data/dbConfig');

// ===================== NEXT TIME ME GET A BETTER SCHEME NAMING FOR MODEL STUFF =====================

// getting all our pokemon
const getAllPoke = () => {
  return db('pokemon')
}

//needed to make this so we could create out pokemon and return it after its made
const getPokemon = (id) => {
  return db('pokemon').where({id}).first();
}

// creating our pokemon and returning it
const create = async (pokemon) => {
  const [id] = await db('pokemon').insert(pokemon)

  return getPokemon(id)
}

// deleting our pokemon by id
const remove = async (id) => {
  return db('pokemon').where({id}).del()
}

module.exports = {
  getAllPoke,
  getPokemon,
  create,
  remove
}