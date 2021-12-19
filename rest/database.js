const Sequelize = require('sequelize')
const finale = require('finale-rest')

const database = new Sequelize({
  dialect: 'sqlite',
  storage: './test.sqlite'
})

const auth_endpoint_database = database.define('auth', {
  username: Sequelize.STRING,
  nickname: Sequelize.STRING,
  auth_token: Sequelize.STRING
  //timestamp?
})


const initializeDatabase = async (app) => {
  
  finale.initialize({ app, sequelize: database })

  finale.resource({
    model: auth_endpoint_database,
    endpoints: ['/auth', '/auth/:username']
  })

  await database.sync()
}

const getRegisteredUsers = async () => {
  return await auth_endpoint_database.findAll({
    attributes: ['nickname']
  }).then(rows => {
    // [{datavalues:{nickname:"...."}}]
    return rows.map(row => {
      return row.dataValues.nickname
    })
  }).catch(err => {return []});
}

const getAuthKeyForStreamer = async (streamername) => {
  return await auth_endpoint_database.findOne({ where: { nickname: streamername } });
}

const insertEntry = async (username, nickname, access_token) => {
  const [account, created] = await auth_endpoint_database.findOrCreate({
    where: {username:username},
    defaults:{nickname:nickname, auth_token:access_token}
  })
  if(created===false) {
    //Already exists, add new token...
    auth_endpoint_database.update(
      {nickname:nickname,auth_token:access_token},
      {
        where:{
          username:username
        }
      }).then(()=> {
      console.log("updated entry for: ", nickname)
    }).catch(err=> {
      console.error("something went wrong when updating record: ", err)
    })
  } else {
    console.log(`Inserted new entry for ${username}`)
  }
}


module.exports = {
  initializeDatabase: initializeDatabase,
  insertEntry: insertEntry,
  getRegisteredUsers, getRegisteredUsers,
  getAuthKeyForStreamer, getAuthKeyForStreamer
};