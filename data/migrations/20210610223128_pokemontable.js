exports.up = function(knex) {
  return knex.schema.createTable('pokemon', tbl => {
    tbl.increments();
    tbl.string('name').notNullable().unique()
  })
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('pokemon')
};
