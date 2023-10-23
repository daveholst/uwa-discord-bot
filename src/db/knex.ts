import * as path from 'path';

import Knex from 'knex';
import { Model } from 'objection';

export const knex = Knex({
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname, '../../config/database.sqlite'),
    },
    migrations: {
        directory: path.resolve(__dirname, './migrations'),
    },
    useNullAsDefault: true, // This is needed for SQLite3
});

Model.knex(knex);

export async function createSchema() {
    if (await knex.schema.hasTable('users')) {
        return;
    }
    await knex.schema.createTable('users', (table) => {
        table.string('user_id').primary();
        table.string('username').notNullable();
        table.string('postcode').notNullable();
    });
}
