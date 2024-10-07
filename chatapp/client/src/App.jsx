import { useState } from 'react';
import Register from './pages/register/register';
import './App.css';
import Axios from "axios";
import { Context } from './pages/usercontext';

 

function App() { 
  Axios.defaults.baseURL='http://localhost:3000';
  Axios.defaults.withCredentials=true; 


  return (
     <Context>
       <Register/>

    </Context >
   
      
   
  )
}

export default App
