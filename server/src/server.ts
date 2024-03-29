import Fastify from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'

import {prisma} from './lib/prisma'
import { poolRoutes } from './routes/pool'
import { authRoutes } from './routes/auth'
import { gameRoutes } from './routes/game'
import { guessRoutes } from './routes/guess'
import { userRoutes } from './routes/user'

async function bootstrap() {
    const fastify = Fastify({
        logger:true,
    })

    await fastify.register(cors, {
        //origin: 'www.etc.com.be',
        origin: true,
    })

    //Em producao esse secret precisa ser uma variavel ambiente
    await fastify.register(jwt, {
        secret: 'nlwcopa',
    })

    await fastify.register(poolRoutes)
    await fastify.register(authRoutes)
    await fastify.register(gameRoutes)
    await fastify.register(guessRoutes)
    await fastify.register(userRoutes)

    //usar essa linha de baixo se der problema no acesso, principalemnete via android 
    await fastify.listen({port: 3333,host: '0.0.0.0'})
    // await fastify.listen({port: 3333})
    // await fastify.listen({port: 3333,host: '127.0.0.1'})
}

bootstrap()