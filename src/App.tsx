import React, { useState } from "react";
import { render } from "react-dom";
import { GiphyFetch } from "@giphy/js-fetch-api";
import { IGif } from "@giphy/js-types";
import { Gif, Grid, Carousel } from "@giphy/react-components";
import { useAsync } from "react-async-hook";
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


function CarouselDemo() {
  var params = new URLSearchParams();
  params.append("access_token", "5vei5Sequ6z5uYLgUNtTHGLI3Co4QhzENMUgab8Y");
  params.append("type", "donation");

  params.append("message", "this stream is really cool");
  params.append("duration", "6000");
  
  const url:string = "https://streamlabs.com/api/v1.0/alerts"

  const body:string= 'access_token=5vei5Sequ6z5uYLgUNtTHGLI3Co4QhzENMUgab8Y&type=donation&image_href=https://media.giphy.com/media/gd09Y2Ptu7gsiPVUrv/giphy-downsized.gif&message=I love fishsticks&duration=6000' 
  const onGifClick:any = (gif:any, e:any) => {
  params.append("image_href",gif.images.downsized.url);

	console.log("gif",gif);
	e.preventDefault();
	fetch(url, {
          method: 'POST',
    	  //mode: "no-cors",
   	  body: params,
   	  headers: {  'Content-Type': 'application/x-www-form-urlencoded'}
	});//).then(checkResponseStatus);

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



class MyHeader extends React.Component {
   render() {
      const headerStyle: React.CSSProperties = {
        padding: "60px",
  	textAlign: "center",
  	background: "#1abc9c",
  	color: "white",
  	fontSize: "30px",
      }
     return (
       <div style={headerStyle}>
         <h1>DangleHank, the website</h1>
	 <p>Click any gif to send it directly to my stream!</p>
       </div>
     )
   }
}



function App() {
  const [modalGif, setModalGif] = useState();
  return (
    <>
      <MyHeader />
      <h4>Gif</h4>
      <GifDemo/>
      <h4>Carousel</h4>
      <CarouselDemo />
      
    </>
  );
}


export default App;
