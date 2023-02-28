const {
  generateModelTypes,
  generateApolloServer
} = require('graphql-sequelize-generator')
const { WebSocketServer } = require('ws')
const { PubSub } = require('graphql-subscriptions')

const models = require('../models')

const types = generateModelTypes(models)

let graphqlSchemaDeclaration = {}

graphqlSchemaDeclaration.task = {
  model: models.task,
  actions: ['list', 'create', 'update', 'delete', 'count'],
  subscriptions: ['create', 'update', 'delete']
}

const pubSubInstance = new PubSub()

module.exports = (globalPreCallback = () => null, httpServer) => {
  // Creating the WebSocket server
  const wsServer = new WebSocketServer({
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/graphql'
  })

  return {
    server: generateApolloServer({
      graphqlSchemaDeclaration,
      types,
      models,
      globalPreCallback,
      wsServer,
      apolloServerOptions: {
        // Required for the tests.
        csrfPrevention: false,
        playground: true
      },
      callWebhook: data => {
        return data
      },
      pubSubInstance
    })
  }
}
