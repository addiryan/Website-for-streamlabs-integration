import React, { useState} from "react";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";
import { Grid, Carousel } from "@giphy/react-components";
import * as textStyles from "./styles/TextStyles"
import * as appStyles from "./styles/AppStyle"
import ResizeObserver from "react-resize-observer";
var fs = require('fs');

var fetch = require('node-fetch');


//const giphyFetch = new GiphyFetch("uqrylcebhFGgaMpRxqk7t2K71skX4F8W");
const giphyFetch = new GiphyFetch("6fdEqnlWrtgJ0WYK8n2KACAjF7hzPvdU");
const messageTemplates = ["Invading an Olaf like...","Getting killed by the support feels like...","When you die, but blame your support", "Feels bad", "Losing your lane feels like", "DEMACIA", "My mind is telling me no, BUT MY BODY..."]
const randomInputMessage = messageTemplates[Math.floor(Math.random()*messageTemplates.length)]




function checkResponseStatus(res:any) {
    if(res.ok){
        return res
    } else {
        console.log(`The HTTP status of the reponse: ${res.status} (${res.statusText})`);
    }
}


function postToStream(props:CarouselProps, gif:IGif, e:React.SyntheticEvent<HTMLElement, Event>) {
  const url:string = "https://streamlabs.com/api/v1.0/alerts"
    var params = new URLSearchParams();
    params.append("access_token", "5vei5Sequ6z5uYLgUNtTHGLI3Co4QhzENMUgab8Y");
    params.append("type", "donation");
    params.append("message", props.nickname!="" ? "*"+props.nickname+"*" : "secret admirer");
    params.append("user_message", props.message!="" ? props.message : "love your stream");
    params.append("duration", "6000");
    params.append("image_href",gif.images.original.mp4);
    e.preventDefault();
    fetch(url, {
        method: 'POST',
        body: params,
        headers: {  'Content-Type': 'application/x-www-form-urlencoded'}
      }
    )
    .then(checkResponseStatus)
    .then((err:any)=> console.log(err));//).then(checkResponseStatus);
}

function QueryCarousel(props:CarouselProps) {
  
  const onGifClick:any = (gif:IGif, e:React.SyntheticEvent<HTMLElement, Event>) => {
    postToStream(props, gif, e)

  }
  const fetchGifs = (offset: number) =>
    giphyFetch.search(props.query? props.query: "dogs", { offset, limit: 10 });
  return <Carousel onGifClick={onGifClick} fetchGifs={fetchGifs} gifHeight={200} gutter={6} />;
}

function TrendingCarousel(props:CarouselProps) {
  
  const onGifClick:any = (gif:IGif, e:React.SyntheticEvent<HTMLElement, Event>) => {
    postToStream(props, gif, e)

  }
  const fetchGifs = (offset: number) =>
    giphyFetch.trending({ offset, limit: 10 });
  return <Carousel onGifClick={onGifClick} fetchGifs={fetchGifs} gifHeight={200} gutter={6} />;
}


function QueryGrid(props:CarouselProps) {

  const fetchGifs = (offset: number) =>
    giphyFetch.search(props.query? props.query: "happy", { offset, limit: 9 });

  const [width, setWidth] = useState(window.innerWidth);

  const onGifClick:any = (gif:IGif, e:React.SyntheticEvent<HTMLElement, Event>) => {
    postToStream(props, gif, e)

  }
  return (
    <>
      <div style={appStyles.queryGrid}>
        <Grid
          onGifClick={onGifClick}
          key={props.query}
          fetchGifs={fetchGifs}
          width={width/2}
          columns={4}
          gutter={6}
         />
      </div>
        <ResizeObserver
          onResize={({ width }) => {
            setWidth(width);
          }}
        />
      
    </>
  );
}





function MyHeader (props:InputPropsWithUpdate) {
        
    return (
      <>
      <div style={appStyles.genericHeader}>
        <h1>The Meme Stream</h1>
        {/* <p>Click any gif to send it directly to my stream!</p> */}
        <p style={textStyles.formLabel} >Just insert your nickname</p>
        <div className="input_nickname" style={textStyles.inputArea}>  
            <input type="text" value={props.nickname} onChange={e=> props.onChangeNickname(e.target.value)} style={textStyles.inputNickname} id="inputNickname" placeholder="Nickname"/>
        </div>
        <p style={textStyles.formLabel} >And write a funny caption</p>
        <div className="input_message" style={textStyles.inputArea}>  
          <textarea style={textStyles.inputMessage} value={props.message} onChange={e=> props.onChangeMessage(e.target.value)} id="inputMessage" placeholder={randomInputMessage} maxLength={155}/>  
        </div>
      </div>
    </>
    )
  }


interface InputPropsWithUpdate {
  nickname:string,
  message:string,
  onChangeNickname(name:string): any,
  onChangeMessage(message:string): any
}

interface CarouselProps {
  nickname:string,
  message:string,
  query?:string
}

function App() {
  const [nickname, setNickname] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [query, setQuery] = React.useState("happy")

  function updateNickname(name:string) {
    setNickname(name);
  }

  function updateMessage(message:string) {
    setMessage(message)
  }

  function updateQuery(query:string) {
    setQuery(query)
  }
  
  return (
    <>
      <MyHeader nickname={nickname} message={message} onChangeNickname={updateNickname} onChangeMessage={updateMessage}/>
      <div style={appStyles.mainArea}>
        <h2>Then click one of these cool dogs...</h2>
        <QueryCarousel nickname={nickname} message={message} query="dogs"/>
        <h2>or this trending content...</h2>
        <TrendingCarousel nickname={nickname} message={message}/>
        <h2>or scroll through your own desired search term</h2>
        <img src="https://uploads.codesandbox.io/uploads/user/ce4856ba-2d28-467b-98d7-427cebc27616/ZZBX-logo.gif" width="200" alt="Powered by GIPHY" /> 
        <input type="text" onChange={e=> updateQuery(e.target.value)} style={textStyles.inputNickname} id="inputQuery" placeholder="happy"/>
        <QueryGrid nickname={nickname} message={message} query={query}/>
      </div>  
    </>
  );
}


export default App;
