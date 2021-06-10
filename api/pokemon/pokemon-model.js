const db = require('../../data/dbConfig');

const getAllPoke = () => {
  return db('pokemon')
}

const getPokemon = (id) => {
  return db('pokemon').where({id}).first();
}


const create = async (pokemon) => {
  const [id] = await db('pokemon').insert(pokemon)

  return getPokemon(id)
}

const remove = () => {
  return null
}

module.exports = {
  getAllPoke,
  getPokemon,
  create,
  remove
}