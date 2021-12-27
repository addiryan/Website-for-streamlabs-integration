 const express = require('express')

const bodyParser = require('body-parser')
const util = require("util")
const axios = require("axios");
const fetch = require('node-fetch');
const {GiphyFetch} = require("@giphy/js-fetch-api")

const {initializeDatabase,insertEntry,getRegisteredUsers, getAuthKeyForStreamer} = require("./database");

const app = express()
app.use(bodyParser.json())

//Authorize my app for new streamer..
app.get('/api/auth_request', (req, auth_res) => {
  let code = req.url.split("code=")[1]
  const url = new URL('https://streamlabs.com/api/v1.0/token')
  url.searchParams.append('grant_type', 'authorization_code')
  url.searchParams.append('client_id', "t2dVYGfNu7RgYGWHiuQkzutZ8w5A6S7FUYTnwmpe")
  url.searchParams.append('client_secret', 'pbsLOtP2k4FjCX87dKSKcO12juFwwOHnWN21AmaN')
  url.searchParams.append('redirect_uri', 'https://memestream.schleppe.cloud/api/auth_request')
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
    //Fetch user information with the recently aquired access token:
    userUrl = `https://streamlabs.com/api/v1.0/user?access_token=${access_token}`
    fetch(userUrl, {method:"GET", headers:{Accept:"application/json"}})
      .then(res=> {
        //successful fetch of user data from streamlabs, insert entry with proper username:
        return res.json()
      }).then(user=> {
        userName = user["streamlabs"]["username"]
        displayName = user["twitch"] !== undefined ? user["twitch"]["display_name"]: user["streamlabs"]["display_name"]
        insertEntry(userName, displayName, access_token)
        //Redirects to
        auth_res.status(200)
        auth_res.redirect(`https://memestream.schleppe.cloud/${displayName}`)
        auth_res.end()
        //redirect(200,"/")
      }).catch(err=> {
        console.error("Error when fetching streamlabs user data: ", err)
      })
  }).catch(err=> {
    console.error(`got error: ${err} `)
  });
});

//Get a list of all registered streamers
app.get('/api/registered_streamers', (req, res) => {
  getRegisteredUsers().then(streamers => {
    // res.set('Access-Control-Allow-Origin', '*');
    res.status(200).write(JSON.stringify({registeredStreamers:streamers}))
    res.end()
  }).catch(err=> {
    res.status(500).end("Could not fetch registered streamers from db: ", err)
  })
})

//Get streamer info for frontend, online status, auth key etc..
app.get('/api/streamer_info', (req, res) => {
  getAuthKeyForStreamer(req.query.streamername).then(streamer=> {
    // res.set('Access-Control-Allow-Origin', '*');
    res.status(200).write(JSON.stringify({auth_token:streamer.auth_token}))
    res.end()
  }).catch(err=> {
    console.error("Something went wrong while fetching streamer info..", err)
    res.status(500).end()
  })
})

app.get('/api/giphy_fetch', (req, giphy_res) => {
  const giphyFetch = new GiphyFetch(process.env.GIPHY_FETCH_TOKEN); 
  giphy_res.status(200)
  giphy_res.end(JSON.stringify(giphyFetch))
})

app.get('/api/post_to_stream', (req, post_res) =>{
  const url = "https://streamlabs.com/api/v1.0/alerts"
  let params = JSON.parse(JSON.stringify(req.query))
  getAuthKeyForStreamer(req.query.streamername).then(streamer=> {
    let searchParams = new URLSearchParams(req.query)
    searchParams.delete("streamername")
    searchParams.append("access_token", streamer.auth_token)
    fetch(url, {method:"POST", body:searchParams, headers:{'Content-Type': 'application/x-www-form-urlencoded'}})
    .then(resp=> {
        if(resp.status != 200) {
            post_res.ok=false
            post_res.status(500)
            post_res.end()
        }
        else if(resp.ok) {
            post_res.ok=true
            post_res.status(200)
            post_res.end()
        } else {
            post_res.ok=false
            post_res.status(500)
            post_res.end()
        }
    })
  }).catch(err=> {
    console.error("Something went wrong while fetching auth key for user: ", err )
    post_res.ok=false
    post_res.status(500)
    post_res.end()
  })
})

const startServer = async () => {
  await initializeDatabase(app)
  const port = process.env.SERVER_PORT || 3001
  await util.promisify(app.listen).bind(app)(port)

  console.log(`Listening on port ${port}`)
}

startServer()