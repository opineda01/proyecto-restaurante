'use strict'

const path = require('path')
const AutoLoad = require('@fastify/autoload')
const fastifyStatic = require('@fastify/static')
const fastifySwagger = require('@fastify/swagger')

const options = {};

module.exports = async function (fastify, opts) {
  // Place here your custom code!

  // Register the fastify-static plugin to serve static content
  fastify.register(fastifyStatic, {
    root: path.join(__dirname, 'public'),
    prefix: '/public' // Set the prefix for the static content URL
  })
  fastify.register(require('@fastify/swagger'))
  // Do not touch the following lines

  // This loads all plugins defined in plugins
  // those should be support plugins that are reused
  // through your application
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  // define your routes in one of these
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
  // Log the URL and method of each registered route
  fastify.addHook('onRoute', (routeOptions) => {
    console.log(`Route registered: ${routeOptions.method} ${routeOptions.url}`);
  });
}

module.exports.options = options