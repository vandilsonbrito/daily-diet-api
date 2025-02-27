import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meals', (table) => {
        table.uuid('id').primary();
        table.string('name').notNullable();
        table.string('description');
        table.date('date').notNullable();
        table.time('meal_time').notNullable();
        table.boolean('is_in_diet').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.timestamp('updated_at').defaultTo(knex.fn.now());

        // O campo user_id é um UUID que representa o usuário que criou a refeição.
        // O .notNullable exige que toda refeição seja asociada a um usuário
        // O references('id').inTable('users') define que user_id é uma foreign key que se refere ao campo
        // 'id' na tabela 'users'
        table.uuid('user_id').notNullable().references('id').inTable('users');
        // OonDelete('CASCADE') define que quando um usuário é deletado, todas as refeições criadas por ele também são deletadas.
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE');
    })
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meals');
}