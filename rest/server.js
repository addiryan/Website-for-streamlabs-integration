const express = require('express')

const bodyParser = require('body-parser')
const util = require("util") 
const axios = require("axios");
// var cors = require("cors");

const initializeDatabase = require("./database")

const app = express()
app.use(bodyParser.json())

app.get('/auth_request', function(req, res) {
  console.log("this is request: ", req.url)
  let code = req.url.split("code=")[1]
  console.log("code: ", code)
  const url = new URL('https://streamlabs.com/api/v1.0/token')
  url.searchParams.append('grant_type', 'authorization_code')
  url.searchParams.append('client_id', "t2dVYGfNu7RgYGWHiuQkzutZ8w5A6S7FUYTnwmpe")
  url.searchParams.append('client_secret', 'pbsLOtP2k4FjCX87dKSKcO12juFwwOHnWN21AmaN')
  url.searchParams.append('redirect_uri', 'http://localhost:3001/auth_request')
  url.searchParams.append('code', code)
  console.log("this is url: ", url.href.toString())
  axios({
    method: "POST",
    url: `${url.href.toString()}`,
    headers: {
      Accept: "application/json",
    },
  }).then((response) => {
    console.log("got a response: ", response)
    // res.redirect(
    //   `http://localhost:3000?access_token=${response.data.access_token}`
    // );
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