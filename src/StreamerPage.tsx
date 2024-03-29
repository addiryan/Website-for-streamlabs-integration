import React, { useState, useEffect} from "react";
import { useParams } from "react-router-dom";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";
import { Grid, Carousel } from "@giphy/react-components";
import * as textStyles from "./styles/TextStyles"
import * as appStyles from "./styles/AppStyle"
import ResizeObserver from "react-resize-observer";
import Bottleneck from "bottleneck"
import Swal, { SweetAlertResult } from 'sweetalert2'
import {Link} from "react-router-dom";
import { mainAppProps, streamerInfo } from "./types";
import { MainHeader } from "./Home";
var fetch = require('node-fetch');


// Never more than 5 requests running at a time.
// Wait at least 20s between each request.
const limiter = new Bottleneck({
 maxConcurrent: 1,
 minTime: 20000
});



//const giphyFetch = new GiphyFetch("uqrylcebhFGgaMpRxqk7t2K71skX4F8W");
const giphyFetch = new GiphyFetch("6fdEqnlWrtgJ0WYK8n2KACAjF7hzPvdU");
const messageTemplates = ["Invading an Olaf like...","Getting killed by the support feels like...","When you die, but blame your support", "Feels bad", "Losing your lane feels like", "DEMACIA", "My mind is telling me no, BUT MY BODY..."]
const randomInputMessage = messageTemplates[Math.floor(Math.random()*messageTemplates.length)]


const sendToStreamButtons = Swal.mixin({
  customClass: {
    confirmButton: 'btn btn-success',
    cancelButton: 'btn btn-danger'
  },
  buttonsStyling: true
})


function selectionConfirmed(nickname:string, message:string, gifUrl:string):Promise<SweetAlertResult<any>> {
  return sendToStreamButtons.fire({
    title: `Nickname: ${nickname}`,
    text: `Message: ${message}`,
    showCancelButton:true,
    confirmButtonText:"Send to stream!",
    cancelButtonText:"Cancel",
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    width: 600,
    padding: '3em',
    backdrop: `
      url("${gifUrl}")
      center top
      no-repeat
    `
  }).then((result) => {
    return result
  })
}

function unknownStreamer(streamername:string) {
  return (
    <>
    <div style={appStyles.genericHeader}>
      <h1>Could not find the specified user ({streamername}), did you get the username right?</h1>
    </div>
  </>
  )
}

function postToStream(props:CarouselProps, gif:IGif, e:React.SyntheticEvent<HTMLElement, Event>) {

  let url:string = "api/post_to_stream"
  //const url:string = "https://streamlabs.com/api/v1.0/alerts"
  let gif_url:string = gif.images.original.mp4.includes("?") ? gif.images.original.mp4.split("?")[0] : gif.images.original.mp4
  let gif_url_popup:string = gif.images.original.url.includes("?") ? gif.images.original.url.split("?")[0] : gif.images.original.url
  let nickname:string = props.nickname!="" ? "*"+props.nickname+"*" : "secret admirer"
  let message:string = props.message!="" ? props.message : "love your stream"
  var params = new URLSearchParams();
  params.append("streamername", props.streamername)
  params.append("type", "donation");
  params.append("message", nickname);
  params.append("user_message", message);
  params.append("duration", "6000");
  params.append("image_href",gif_url);
  e.preventDefault();
  url += "?" + params.toString()
  selectionConfirmed(nickname, message, gif_url_popup).then(res=> {
    if(res.value===true) {
      //Checks that some time has gone since last request. Rate limiting
      
      limiter.check()
      .then((wouldRunNow) => {
        // console.log(wouldRunNow)
        if(wouldRunNow) {
          limiter.schedule(() => fetch(url))
        .then((res:any)=> {
          if(res.ok) {
            sendToStreamButtons.fire(
              'Successfully sent to stream!',
              'Expect some delay',
              'success'
            )
          } else {
            Swal.fire(
              'Aborted',
              'Something went wrong when posting to stream...')
          
          }
        }).then((err:any)=> console.log(err));//).then(checkResponseStatus);
        } else {
          Swal.fire(
            'Timeout',
            'Please wait a bit before sending a new gif')
        }
      });
    }
  })
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
    <MainHeader />
      <h1>{props.streamername ? props.streamername+"'s Meme Stream": "The Meme Stream"}!</h1>
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
  streamername:string | undefined,
  nickname:string,
  message:string,
  onChangeNickname(name:string): any,
  onChangeMessage(message:string): any
}

interface CarouselProps {
  streamername:string,
  nickname:string,
  message:string,
  query?:string
}

function StreamerPage(props:mainAppProps) {

  const [nickname, setNickname] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [query, setQuery] = React.useState("happy")
  let params = useParams();

  useEffect(() =>{
  },[])

  if(params.streamername) {
    let streamername = params.streamername as string
    if(props.registeredStreamers.length > 0 && !props.registeredStreamers.includes(params.streamername)) {
      return unknownStreamer(streamername)
    }
  } else {
    return unknownStreamer("no username found")
  }

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
      <MyHeader streamername={params.streamername} nickname={nickname} message={message} onChangeNickname={updateNickname} onChangeMessage={updateMessage}/>
      <div style={appStyles.mainArea}>
        <h2>Then click one of these cool dogs...</h2>
        <QueryCarousel streamername={params.streamername} nickname={nickname} message={message} query="dogs"/>
        <h2>or this trending content...</h2>
        <TrendingCarousel streamername={params.streamername} nickname={nickname} message={message}/>
        <h2>or scroll through your own desired search term</h2>
        <img src="https://uploads.codesandbox.io/uploads/user/ce4856ba-2d28-467b-98d7-427cebc27616/ZZBX-logo.gif" width="200" alt="Powered by GIPHY" />
        <input type="text" onChange={e=> updateQuery(e.target.value)} style={textStyles.inputNickname} id="inputQuery" placeholder="happy"/>
        <QueryGrid streamername={params.streamername} nickname={nickname} message={message} query={query}/>
      </div>
    </>
  );
}

export default StreamerPage;