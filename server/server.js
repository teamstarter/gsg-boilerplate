const express = require('express')
const http = require('http')
const {
  generateModelTypes,
  generateApolloServer,
} = require('graphql-sequelize-generator')
const { PubSub } = require('graphql-subscriptions')

const models = require('../models')

const types = generateModelTypes(models)

let graphqlSchemaDeclaration = {}

graphqlSchemaDeclaration.task = {
  model: models.task,
  actions: ['list', 'create', 'update', 'delete', 'count'],
  subscriptions: ['create', 'update', 'delete'],
}

const pubSubInstance = new PubSub()

const server = generateApolloServer({
  graphqlSchemaDeclaration,
  types,
  models,
  pubSubInstance,
})

const app = express()
server.applyMiddleware({
  app,
  path: '/graphql',
})

const port = process.env.PORT || 8080

const serverHttp = http.createServer({}, app).listen(port, async () => {
  console.log(
    `🚀 http/https/h2 server runs on  http://localhost:${port}/graphql .`
  )
})

server.installSubscriptionHandlers(serverHttp)
