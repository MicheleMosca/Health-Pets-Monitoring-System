/* import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
 */

import React, { useState, useEffect } from 'react';
const VecchioApp = () => {
const [title, setTitle] = useState('');
const [body, setBody] = useState('');
const [data, setData] = useState([]);
// ...

const getData=()=>{
   fetch('http://127.0.0.1:9000/api/users/michele/stations', {
      method: 'GET'
      }).then((response) => response.json())
      .then((data) => { 
         //const dataParsed=JSON.parse(data);
         console.log("Risposta data" + JSON.stringify(data));
         console.log("Dentro i campi " + JSON.stringify(data["latitude"]));
         setData(data)
      }).catch((err) => {
         console.log(err.message);
      });
      console.log("finito richiesta");

 }
 useEffect(()=>{
   getData()
 },[])

/* const addPosts = async (title, body) => {
  console.log("Sto facendo la richiesta");
   await fetch('http://127.0.0.1:9000/api/users/michele/stations', {
      method: 'GET'
      }).then((response) => response.json())
      .then((data) => { 
         //const dataParsed=JSON.parse(data);
         console.log("Risposta data" + JSON.stringify(data));
         console.log("Dentro i campi " + JSON.stringify(data["latitude"]));
         setData(data)
      }).catch((err) => {
         console.log(err.message);
      });
      console.log("finito richiesta");

      /* fetch('/api/users/michele/stations')
      .then(response => response.json())
      .then(data =>  console.log("Risposta ottenuta "+ JSON.stringify(data))); 
};

const handleSubmit = (e) => {
   e.preventDefault();
   addPosts(title, body);
};    */ 

return (
   <div className="app">
 {/*      <div className="add-post-container">
         <form onSubmit={handleSubmit}>
             <input type="text" className="form-control" value={title}
               onChange={(e) => setTitle(e.target.value)}
            />
            <textarea name="" className="form-control" id="" cols="10" rows="8" 
               value={body} onChange={(e) => setBody(e.target.value)} 
            ></textarea> 
            <button type="submit">Add Post</button>
         
        
        
         </form> <br></br> 
       
       
         
      </div> */}
      {/* ... */}  
        <div id={data.id} >
         ECCO I DATI
             {
              data && data.length>0 && data.map((item)=>
              <p>
               {item.id} <br></br>
               {item.latitude}<br></br>
               {item.longitude}<br></br>
              </p>
              )
            }

         
            {data.id} 
            {data.latitude}
            {data.longitude}
        </div>
   </div>
);
};

export default VecchioApp;