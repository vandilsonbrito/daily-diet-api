import { FastifyReply, FastifyRequest } from "fastify";

export async function authenticate(req: FastifyRequest, reply: FastifyReply) {
    try {
        await req.jwtVerify();
    } catch (error) {
        reply.status(401).send({ error: "Unauthorized - " + error });
    }
}