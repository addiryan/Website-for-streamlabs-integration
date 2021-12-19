import React, { useState } from "react";
import Select from 'react-select'
import { GiphyFetch } from "@giphy/js-fetch-api";
import { Grid } from "@giphy/react-components";
import * as textStyles from "./styles/TextStyles"
import * as appStyles from "./styles/AppStyle"
import { mainAppProps } from "./types";
import "./styles/homepage.css"


const giphyFetch = new GiphyFetch("6fdEqnlWrtgJ0WYK8n2KACAjF7hzPvdU");

const openStreamerPage = (selectedStreamer:any) => {
  window.location.href = `/${selectedStreamer.label}`
}

function searchBar(registeredStreamers:string[]) {
  const searchOptions = registeredStreamers.map((streamer, index) => {
    return {label:streamer, value:index}
  })
  return ( 
    <div style={{width:"40%",margin:"auto", color:"black", background:"grey", textAlign:"left"}}>
      <Select options={searchOptions} onChange={(selectedStreamer) => {openStreamerPage(selectedStreamer)}} placeholder={"Select streamer..."}/>
    </div>
  )
}

export function MainHeader() {

  return ( 
    <>
      <div style={{display:"flex", width:"100%", justifyContent:"space-between"}}>
        <button style={{fontSize:"14px", width:"6rem",border:"solid 2px white",background:"none",borderRadius:"10px", color:"white", fontWeight:600}} onClick={()=>{window.location.href="/"}}>Home</button>
        <button className="button-auth" onClick={sendAuthRequest}>Connect to Streamlabs</button>
      </div>
    </>
  )

}

function sendAuthRequest() {
  // https://streamlabs.com/api/v1.0/authorize?client_id=t2dVYGfNu7RgYGWHiuQkzutZ8w5A6S7FUYTnwmpe&redirect_uri=https://memestream.schleppe.cloud&scope=donations.create
  const url = new URL('https://streamlabs.com/api/v1.0/authorize')
  url.searchParams.append('response_type', 'code')
  url.searchParams.append('client_id', "t2dVYGfNu7RgYGWHiuQkzutZ8w5A6S7FUYTnwmpe")
  url.searchParams.append('redirect_uri', 'http://localhost:3001/auth_request')
  url.searchParams.append('scope', 'alerts.create')
  window.open(url.href.toString())
}

function Home(props:mainAppProps) {
    const [width, setWidth] = useState(window.innerWidth);
    
    const fetchGifs = (offset: number) => {
      return giphyFetch.trending({ offset, limit: 10 });
    }

    return (
      <>
        <div style={appStyles.home}>
          <MainHeader />
          <h1 style={{paddingTop:"2rem"}}>THE MEMESTREAM</h1>
          <h5>Send your favorite gifs, to your favorite stream!</h5>
          <div style={{paddingTop:"2rem"}}>
            {props.registeredStreamers.length > 0 ? searchBar(props.registeredStreamers): "Loading streamers...."}
          </div>
          <Grid 
            fetchGifs={fetchGifs}
            width={width/1.4}
            className="homepageGrid"
            columns={5}
            gutter={3}
          />
        </div>
      </>
    );
}


export default Home;
