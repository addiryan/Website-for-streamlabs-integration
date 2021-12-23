import React, { useState, useEffect}from "react";
import {BrowserRouter as Router,Route,Routes,Link} from "react-router-dom";
import Home from "./Home";
import StreamerPage from "./StreamerPage";


function App() {
  let initRegisteredStreamers:string[] = []
  const [registeredStreamers, setRegisteredStreamers] = useState(initRegisteredStreamers)

  useEffect(() =>{
    fetch('/api/registered_streamers')
      .then((response:any) => {
        return response.json()})
      .then((data:any) => setRegisteredStreamers(data["registeredStreamers"]))
      .catch((err:any) => {
        console.error("Could not fetch data....", err)
      });
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
