import React, { useState } from "react";
import { render } from "react-dom";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";
import { Gif, Grid, Carousel } from "@giphy/react-components";
import { useAsync } from "react-async-hook";
import * as textStyles from "./styles/TextStyles"
import ResizeObserver from "react-resize-observer";
var fs = require('fs');

var fetch = require('node-fetch');


//const giphyFetch = new GiphyFetch("uqrylcebhFGgaMpRxqk7t2K71skX4F8W");
const giphyFetch = new GiphyFetch("6fdEqnlWrtgJ0WYK8n2KACAjF7hzPvdU");

function GifDemo() {
  const [gif, setGif] = useState<IGif | null>(null);
  useAsync(async () => {
    const { data } = await giphyFetch.gif("fpXxIjftmkk9y");
    setGif(data);
  }, []);
  return gif && <Gif gif={gif} width={200} />;
}




function checkResponseStatus(res:any) {
    if(res.ok){
        return res
    } else {
        console.log(`The HTTP status of the reponse: ${res.status} (${res.statusText})`);
    }
}


function CarouselDemo(props:InputPropsMinimal) {
  var params = new URLSearchParams();
  params.append("access_token", "5vei5Sequ6z5uYLgUNtTHGLI3Co4QhzENMUgab8Y");
  params.append("type", "donation");
  params.append("message", "*"+props.nickname+"*");
  params.append("user_message", props.message);
  params.append("duration", "6000");
  
  const url:string = "https://streamlabs.com/api/v1.0/alerts"

  const onGifClick:any = (gif:any, e:any) => {
  params.append("image_href",gif.images.original.url);
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
  const fetchGifs = (offset: number) =>
    giphyFetch.search("dogs", { offset, limit: 10 });
  return <Carousel onGifClick={onGifClick} fetchGifs={fetchGifs} gifHeight={200} gutter={6} />;
}

/*function GridDemo({ onGifClick:any }) {
  const fetchGifs = (offset: number) =>
    giphyFetch.trending({ offset, limit: 10 });
  const [width, setWidth] = useState(window.innerWidth);
  return (
    <>
      <Grid
        onGifClick={onGifClick}
        fetchGifs={fetchGifs}
        width={width}
        columns={3}
        gutter={6}
      />
      <ResizeObserver
        onResize={({ width }) => {
          setWidth(width);
        }}
      />
    </>
  );
}

*/



function MyHeader (props:InputPropsWithUpdate) {
 
  const headerStyle: React.CSSProperties = {
    padding: "60px",
    textAlign: "center",
    background: "#1abc9c",
    color: "white",
    fontSize: "30px"
  }
    
    return (
      <>
      <div style={headerStyle}>
        <h1>DangleHank, the website</h1>
        <p>Click any gif to send it directly to my stream!</p>
        <div className="input_message" style={textStyles.inputArea}>
            <input type="text" value={props.nickname} onChange={e=> props.onChangeNickname(e.target.value)} style={textStyles.inputNickname} id="inputNickname" placeholder="Nickname"/>
            <textarea style={textStyles.inputMessage} value={props.message} onChange={e=> props.onChangeMessage(e.target.value)} id="inputMessage" placeholder="Message" maxLength={155}/>
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

interface InputPropsMinimal {
  nickname:string,
  message:string
}

function App() {
  const [nickname, setNickname] = React.useState("");
  const [message, setMessage] = React.useState("");
  function updateNickname(name:string) {
    setNickname(name);
  }

  function updateMessage(message:string) {
    setMessage(message)
  }
  
  const appStyle:React.CSSProperties = {
    background:"linear-gradient(to right,#2c5364, #203a43, #0f2027)"
  }
  
  return (
    <>
      <MyHeader nickname={nickname} message={message} onChangeNickname={updateNickname} onChangeMessage={updateMessage}/>
      {/* <div className="input_message" style={textStyles.inputArea}>
        <input type="text" style={textStyles.inputNickname} id="name" placeholder="Nickname"/>
        <textarea style={textStyles.inputMessage} id="message" placeholder="Message" maxLength={155}/>
      </div> */}
      <div style={appStyle}>
        <GifDemo/>
        <>
        </>
        <CarouselDemo nickname={nickname} message={message}/>  
      </div>  
    </>
  );
}


export default App;
