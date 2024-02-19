'use strict'

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = async function (fastify, opts) {
  // Obtener todos los envíos
  fastify.get('/envios', async function (request, reply) {
    const envios = await prisma.envio.findMany()
    return envios
  })

  // Obtener un envío por ID
  fastify.get('/envios/:id', async function (request, reply) {
    const { id } = request.params
    const envio = await prisma.envio.findUnique({
      where: { id: parseInt(id) }
    })

    if (envio) {
      return envio
    } else {
      reply.code(404)
      return { error: 'Envío no encontrado' }
    }
  })

  // Crear un nuevo envío
  fastify.post('/envios', async function (request, reply) {
    const { destinatario, direccion } = request.body

    const envio = await prisma.envio.create({
      data: {
        destinatario,
        direccion
      }
    })

    return envio
  })

  // Actualizar un envío
  fastify.put('/envios/:id', async function (request, reply) {
    const { id } = request.params
    const { destinatario, direccion } = request.body

    const envio = await prisma.envio.update({
      where: { id: parseInt(id) },
      data: {
        destinatario,
        direccion
      }
    })

    return envio
  })

  // Eliminar un envío
  fastify.delete('/envios/:id', async function (request, reply) {
    const { id } = request.params

    await prisma.envio.delete({
      where: { id: parseInt(id) }
    })

    return { message: 'Envío eliminado correctamente' }
  })
}