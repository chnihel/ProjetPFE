import '../src/styles.css';
import '../src/Sidebar.css'
import React from 'react';
import {  Route, Routes } from 'react-router-dom';
import Header from "./components/Header";
import AddInstitute from './pages/AddInstitute';
import { Sidebar } from 'semantic-ui-react';
import InstituteList from './pages/InstituteList';
import DiplomaList from './pages/DiplomaList'
import AddDiploma from './pagesInst/AddDiploma';
import ListDiploma from './pagesInst/ListDiploma';
import SidebarAdmin from './components/Sidebar';
import SidebarInstitute from './components/SidebarInst';
import FilterDiploma from './pagesInst/FilterDiploma';
import VerifyDiploma from './components/VerifyDiploma';
function App() {
  return (
    
    <main className="header">

    
      
    <Routes>
      <Route path='/' element={<Header/>}></Route>
       
       <Route path='/admin' element={<SidebarAdmin/>}/>
       <Route path='/add' element={<><Sidebar/><AddInstitute/></>}/>
       <Route path='/list' element={<><Sidebar/><InstituteList/></>}/>
       <Route path='/diploma' element={<><Sidebar/><DiplomaList/></>}/>
       <Route path='/institute' element={<SidebarInstitute/>}/>
       <Route path='/addDiploma' element={<><Sidebar/><AddDiploma/></>}/>
       <Route path='/listDiploma' element={<><Sidebar/><ListDiploma/></>}/>
       <Route path='/filterDiploma' element={<><Sidebar/><FilterDiploma/></>}/>
       <Route path="/verifier/:id" element={<VerifyDiploma />} />
    </Routes>
  </main>
);
}


export default App;
