import { Model } from 'objection';

export class User extends Model {
    user_id!: string;
    username!: string;
    postcode!: string;

    static get tableName() {
        return 'users';
    }

    static get idColumn() {
        return 'user_id';
    }

    static get jsonSchema() {
        return {
            type: 'object',
            required: ['user_id', 'username'],

            properties: {
                user_id: { type: 'string' },
                username: { type: 'string' },
                postcode: { type: 'string' },
            },
        };
    }
}
