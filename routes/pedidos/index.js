'use strict'

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = async function (fastify, opts) {
  // Obtener todos los pedidos
  fastify.get('/', async function (request, reply) {
    const pedidos = await prisma.pedido.findMany({
      include: {
        productos: true,
        envios: true,
      }
    })
    return pedidos
  })

  // Obtener un pedido por ID
  fastify.get('/pedidos/:id', async function (request, reply) {
    const { id } = request.params
    const pedido = await prisma.pedido.findUnique({
      where: { id: parseInt(id) },
      include: {
        productos: true,
        envios: true
      }
    })

    if (pedido) {
      return pedido
    } else {
      reply.code(404)
      return { error: 'Pedido no encontrado' }
    }
  })

  // Crear un nuevo pedido
  fastify.post('/', async function (request, reply) {
    const { estado, productos, envios } = request.body
    
    const pedido = await prisma.pedido.create({
      data: {
        estado,
        productos: {
          connect: productos.map((producto) => ({ id: parseInt(producto) })),
        }
      },
      include: {
        productos: true,
        envios: true,
      },
    });

    return pedido
  })

  // Actualizar un pedido
  fastify.put('/:id', async function (request, reply) {
    const { id } = request.params
    const { estado, productos, envios } = request.body

    const pedido = await prisma.pedido.update({
      where: { id: parseInt(id) },
      data: {
        estado,
        productos: {
          connect: productos.map((producto) => ({ id: parseInt(producto) })),
        }
      },
      include: {
        productos: true,
        envios: true
      }
    })

    return pedido
  })

  // Eliminar un pedido
  fastify.delete('/:id', async function (request, reply) {
    const { id } = request.params

    await prisma.pedido.delete({
      where: { id: parseInt(id) }
    })

    return { message: 'Pedido eliminado correctamente' }
  })
}