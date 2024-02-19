'use strict'

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

module.exports = async function (fastify, opts) {
  // Obtener todos los productos
  fastify.get('/', async function (request, reply) {
    const productos = await prisma.producto.findMany()
    return productos
  })

  // Obtener un producto por ID
  fastify.get('/:id', async function (request, reply) {
    const { id } = request.params
    const producto = await prisma.producto.findUnique({
      where: { id: parseInt(id) }
    })

    if (producto) {
      return producto
    } else {
      reply.code(404)
      return { error: 'Producto no encontrado' }
    }
  })

  // Crear un nuevo producto
  fastify.post('/', async function (request, reply) {
    let { nombre, precio,stock } = request.body
    stock=parseInt(stock);
    precio=parseFloat(precio);
    const producto = await prisma.producto.create({
      data: {
        nombre,
        precio,
        stock
      }
    })

    return producto
  })

  // Actualizar un producto
  fastify.put('/:id', async function (request, reply) {
    const { id } = request.params
    let { nombre, precio,stock } = request.body
    stock=parseInt(stock);
    precio=parseFloat(precio);

    const producto = await prisma.producto.update({
      where: { id: parseInt(id) },
      data: {
        nombre,
        precio
      }
    })

    return producto
  })

  // Eliminar un producto
  fastify.delete('/productos/:id', async function (request, reply) {
    const { id } = request.params

    await prisma.producto.delete({
      where: { id: parseInt(id) }
    })

    return { message: 'Producto eliminado correctamente' }
  })
}