const express = require('express')

const bodyParser = require('body-parser')
const util = require("util") 
const axios = require("axios");
const fetch = require('node-fetch');
// var cors = require("cors");

const {initializeDatabase,insertEntry} = require("./database")

const app = express()
app.use(bodyParser.json())

app.get('/auth_request', function(req, res) {
  let code = req.url.split("code=")[1]
  const url = new URL('https://streamlabs.com/api/v1.0/token')
  url.searchParams.append('grant_type', 'authorization_code')
  url.searchParams.append('client_id', "t2dVYGfNu7RgYGWHiuQkzutZ8w5A6S7FUYTnwmpe")
  url.searchParams.append('client_secret', 'pbsLOtP2k4FjCX87dKSKcO12juFwwOHnWN21AmaN')
  url.searchParams.append('redirect_uri', 'http://localhost:3001/auth_request')
  url.searchParams.append('code', code)

  axios({
    method: "POST",
    url: `${url.origin}${url.pathname}`,
    headers: {
      Accept: "application/json",      
    },
    data: url.searchParams
  }).then((authResponse) => {
    access_token = authResponse.data.access_token
    refresh_token = authResponse.data.refresh_token
    console.error("access_token: ", access_token)
    //Fetch user information with the recently aquired access token: 
    userUrl = `https://streamlabs.com/api/v1.0/user?access_token=${access_token}`
    fetch(userUrl, {method:"GET", headers:{Accept:"application/json"}})
      .then(res=> {
        //successful fetch of user data from streamlabs, insert entry with proper username: 
        return res.json()
      }).then(user=> {
        console.log("user object: ", user)
        userName = user["streamlabs"]["username"]
        displayName = user["twitch"] !== undefined ? user["twitch"]["display_name"]: user["streamlabs"]["display_name"]
        insertEntry(userName, displayName, access_token)
        
      }).catch(err=> {
        console.error("Error when fetching streamlabs user data: ", err)
      })
  }).catch(err=> {
    console.error(`got error: ${err} `)
  });
});

const startServer = async () => {
  await initializeDatabase(app)
  const port = process.env.SERVER_PORT || 3001
  await util.promisify(app.listen).bind(app)(port)
  console.log(`Listening on port ${port}`)
}

startServer()