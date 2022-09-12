import knex from 'knex'
import config from '../src/config.js'

//------------------------------------------
// productos en MariaDb

try {
    const mariaDbClient = knex(config.mariaDb)
    
   await mariaDbClient.schema.dropTableIfExists('productos')
   await  mariaDbClient.schema.createTable('productos', table => {
        table.increments('id').primary();
        table.string('title', 15).notNullable;
        table.float('price').notNullable;
        table.string('thumbnail', 50);
    })
    //Implementar creación de tabla

    console.log('tabla productos en mariaDb creada con éxito')


} catch (error) {
    console.log('error al crear tabla productos en mariaDb')
    console.log(error)
}

//------------------------------------------
// mensajes en SQLite3
try {
    const sqliteClient = knex(config.sqlite3)

    await sqliteClient.schema.dropTableIfExists('mensajes');
    await sqliteClient.schema.createTable('mensajes', table => {
        table.increments('id').primary();
        table.string('autor', 15).notNullable();
        table.time('fyh');
        table.string('texto', 50).notNullable();

    })
    //Implementar creación de tabla

    console.log('tabla mensajes en sqlite3 creada con éxito')
} catch (error) {
    console.log('error al crear tabla mensajes en sqlite3')
}