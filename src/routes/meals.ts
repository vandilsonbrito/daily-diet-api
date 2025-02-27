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
                date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/),
                meal_time: z.string(),
                is_in_diet: z.boolean(),
                user_id: z.string(),
            })

            const { name, description, date, meal_time, is_in_diet, user_id } = createMealsBodySchema.parse(req.body);

            await knex('meals').insert({
                id: randomUUID(),
                name,
                description,
                date: date + ' ' + meal_time,
                meal_time,
                is_in_diet,
                user_id,
            })

            return reply.status(201).send('Meal successfully created')
    })

    app.delete('/delete/:id', 
        {
            preHandler: [authenticate],
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            const userId = (req.user as UserReqType).id;

            const deleteMealParamsSchema = z.object({
                id: z.string()
            })

            const mealId = deleteMealParamsSchema.parse(req.params).id;
            const existingMeal = await knex('meals').where({
                user_id: userId,
                id: mealId,
            }).first();

            if(!existingMeal) {
                return reply.status(404).send('Meal not found')
            }

            await knex('meals').where({
                user_id: userId,
                id: mealId,
            }).first().delete();

            return reply.status(204).send('Meal successfully deleted')
        }
    )

    app.put('/update/:id', 
        {
            preHandler: [authenticate],
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            const userId = (req.user as UserReqType).id;

            const updateMealBodySchema = z.object({
                name: z.string().optional(),
                description: z.string().optional(),
                date: z.string().regex(/^\d{2}\/\d{2}\/\d{4}$/).optional(),
                meal_time: z.string().optional(),
                is_in_diet: z.boolean().optional()
            })
            const updateMealParamsSchema = z.object({
                id: z.string()
            });

            const { id } = updateMealParamsSchema.parse(req.params);
            const { name, description, date, meal_time, is_in_diet } = updateMealBodySchema.parse(req.body);
         
            const existingMeal = await knex('meals').where({
                user_id: userId,
                id,
            }).first();

            if(!existingMeal) {
                return reply.status(404).send('Meal not found')
            }

            await knex('meals').where({
                user_id: userId,
                id,
            }).update({
                name,
                description,
                date,
                meal_time,
                is_in_diet,
                updated_at: knex.fn.now(), 
            })

            return reply.status(204).send('Meal successfully updated')
        }
    )

    app.get('/metrics', 
        {
            preHandler: [authenticate]
        },
        async (req: FastifyRequest, reply: FastifyReply) => {
            const userId = (req.user as UserReqType).id;

            const mealsAmount = await knex('meals').where({ user_id: userId }).count('*').first();
            if(!mealsAmount) {
                return reply.status(404).send('Meals not found')
            }
            const mealsInDiet = await knex('meals').where({ user_id: userId, is_in_diet: true }).count('*').first();
            const mealsOutDiet = await knex('meals').where({ user_id: userId, is_in_diet: false }).count('*').first();
            const ordainedMeals = await knex('meals')
                .where({ user_id: userId })
                .orderBy('date', 'desc')
            
            const getBestSequenceInDiet = () => {
                let bestSequenceInDiet = 0;
                let acc = 0;
                ordainedMeals.forEach((meal) => {
                    acc = meal.is_in_diet ? acc + 1 : 0;

                    bestSequenceInDiet = Math.max(bestSequenceInDiet, acc)
                })
                return bestSequenceInDiet;
            }

            return reply.status(200).send({
                user_id: userId,
                mealsAmount: mealsAmount?.['count(*)'] || 0,
                mealsInDiet: mealsInDiet?.['count(*)']  || 0,
                mealsOutDiet: mealsOutDiet?.['count(*)']  || 0,
                bestSequenceInDiet: getBestSequenceInDiet(),
            })
        }
    )
}

