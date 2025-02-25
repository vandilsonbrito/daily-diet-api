import { FastifyInstance } from "fastify";
import {knex} from "../database";
import { randomUUID } from "node:crypto";
import { z } from "zod";

export async function userRoutes(app: FastifyInstance) {
    app.post('/login', async (req, reply) => {

        const getUserBodySchema = z.object({
            email: z.string().email(),
            password: z.string().min(5),
        })

        const { email, password } = getUserBodySchema.parse(req.body); 

        const user = await knex('users').where({ email }).first();
        if(!user) {
            return reply.status(404).send('User not found')
        }
        else if (user.password !== password) {
            return reply.status(401).send('Invalid credentials')
        }

        return reply.status(200).send('User successfully logged in')
    })

    app.post('/register', async (req, reply) => {

        const createUserBodySchema = z.object({
            name: z.string(),
            email: z.string().email(),
            password: z.string().min(5),
        })
        
        const { name, email, password } = createUserBodySchema.parse(req.body);

        const existingUser = await knex('users').where({ email: email }).first();
        if(existingUser) {
            return reply.status(409).send('Email already in use')
        }

        await knex('users').insert({
            id: randomUUID(),
            name,
            email,
            password
        })

        return reply.status(201).send('User successfully created')
    })
}