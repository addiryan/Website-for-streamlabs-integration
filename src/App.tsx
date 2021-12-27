import React, { useState, useEffect}from "react";
import {BrowserRouter as Router,Route,Routes,Link} from "react-router-dom";
import Home from "./Home";
import StreamerPage from "./StreamerPage";
import type { GiphyFetch } from "@giphy/js-fetch-api";

function App() {
  let initRegisteredStreamers:string[] = []
  const [registeredStreamers, setRegisteredStreamers] = useState(initRegisteredStreamers)
  // const [giphyFetcher, setGiphyFetcher] = useState({})

  useEffect(() =>{
    fetch('/api/registered_streamers')
      .then((response:any) => {
        return response.json()})
      .then((data:any) => setRegisteredStreamers(data["registeredStreamers"]))
      .catch((err:any) => {
        console.error("Could not fetch data....", err)
      });
    // fetch('/api/giphy_fetch')
    // .then((giphy_fetch=>{return giphy_fetch.json()}))
    // .then((giphy:GiphyFetch)=>{setGiphyFetcher(giphy)})
  },[])

  return (
    <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home registeredStreamers={registeredStreamers}/>}></Route>
        <Route path=":streamername" element={<StreamerPage registeredStreamers={registeredStreamers}/>}></Route>        
        <Route path="*"
        element={
          <main style={{ padding: "1rem" }}>
            <p>There's nothing here!</p>
          </main>
        }
        />
        </Routes>
      </Router>
    </React.StrictMode>
  )
}


export default App;
