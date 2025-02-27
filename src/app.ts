import fastify from "fastify";
import { mealsRoutes } from "./routes/meals";
import { userRoutes } from "./routes/user";
import fastifyJwt from "fastify-jwt";
import { env } from "./env";

export const app = fastify();

app.register(fastifyJwt, {
    secret: env.SECRET_KEY
})

// Use the register method to register a plugin which contains all routes with the same path
app.register(userRoutes, {
    prefix: '/user',
})
app.register(mealsRoutes, {
    prefix: '/meals',
})