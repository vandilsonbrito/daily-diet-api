import { FastifyInstance } from "fastify";
import {knex} from "../database";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export async function userRoutes(app: FastifyInstance) {
    app.post('/register', async (req, reply) => {

        const createUserBodySchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(5),
        })
        
        const { name, email, password } = createUserBodySchema.parse(req.body);

        await knex('users').insert({
            id: randomUUID(),
            name,
            email,
            password
        })

        return reply.status(201).send('User successfully created')
    })
}