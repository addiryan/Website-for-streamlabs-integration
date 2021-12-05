const Sequelize = require('sequelize')
const finale = require('finale-rest')

const database = new Sequelize({
  dialect: 'sqlite',
  storage: './test.sqlite'
})

const auth = database.define('auth', {
  accountName: Sequelize.STRING,
  authToken: Sequelize.STRING
  //timestamp?
})


const initializeDatabase = async (app) => {
  
  finale.initialize({ app, sequelize: database })

  finale.resource({
    model: auth,
    endpoints: ['/auth', '/auth/:accountName']
  })

  await database.sync()
}

module.exports = initializeDatabase