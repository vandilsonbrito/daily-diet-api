import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { knex } from "../database";
import { authenticate } from "../middlewares/check-jwt";
import { UserReqType } from "../interfaces/user-req";

export async function mealsRoutes(app: FastifyInstance) {

    app.get('/list', 
        {
            preHandler: [authenticate],
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            const userId = (req.user as UserReqType).id;

            const mealsList = await knex('meals').where('user_id', userId).select('*').orderBy('date', 'desc');

            if(!mealsList) {
                return reply.status(404).send('No meals found')
            }
            
            return reply.status(200).send(mealsList);
        }
    )

    app.get('/details/:id', 
        {
            preHandler: [authenticate],
        },
        async (req: FastifyRequest, replay: FastifyReply) => {
            const userId = (req.user as UserReqType).id;
            const getMealDetailsParamsSchema = z.object({
                id: z.string(),
            })

            const mealId = getMealDetailsParamsSchema.parse(req.params).id;

            const mealDetails = await knex('meals')
                .where({
                    user_id: userId,
                    id: mealId,
                }).first();
                    
            if(!mealDetails) {
                return replay.status(404).send('Meal not found')
            }    

            return replay.status(200).send(mealDetails);
        }
    )   

    app.post('/create',
        {
            preHandler: [authenticate],
        },
        async (req, reply) => {
        
            const createMealsBodySchema = z.object({
                name: z.string(),
                description: z.string(),
                date: z.string(),
                meal_time: z.string(),
                is_in_diet: z.boolean(),
                user_id: z.string(),
            })

            const { name, description, date, meal_time, is_in_diet, user_id } = createMealsBodySchema.parse(req.body);

            await knex('meals').insert({
                id: randomUUID(),
                name,
                description,
                date,
                meal_time,
                is_in_diet,
                user_id,
            })

            return reply.status(201).send('Meal successfully created')
    })
}