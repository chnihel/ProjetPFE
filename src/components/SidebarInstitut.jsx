/*import React from "react";
import '../Sidebar.css';
import {
    FaBars
} from "react-icons/fa";
import { NavLink } from "react-router-dom";
const Sidebar = ({children})=>{
const menuItem=[
    {
        path:'/institute',
        name:'AddDiploma'
    },
    {
        path:'/list',
        name:'ListDiploma'
    },
];
return(
    <div className="container">
        <div className="sidebare">
            <div className="top_section">
               <h1 className="logo">Institute</h1>
               <div className="bars">
                <FaBars/>
               </div>
            </div>
            {
                menuItem.map((item, index)=>(
                    <NavLink to={item.path} key={index} className="link" activeclassName="active">
                        <div className="icon">{item.icon}</div>
                        <div className="link_text">{item.name}</div>
                    </NavLink>
                ))
            }
        </div>
        <main>{children}</main>
        
    </div>
);
};
export default Sidebar;*/