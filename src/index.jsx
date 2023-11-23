import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter, Route,Routes } from 'react-router-dom';
import { EthProvider } from "./contexts/EthContext";




const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
   
      <EthProvider>
       <Routes>
         <Route path='/*' element={<App/>}  />
       </Routes>
      </EthProvider>
   
    </BrowserRouter>
    
  </React.StrictMode>,
 
);
