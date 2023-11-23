import React from "react";
import '../Sidebar.css'
import {
    FaBars,
    FaList,
    FaHome 
} from "react-icons/fa"
import { AiOutlinePlus } from 'react-icons/ai';

import { NavLink } from "react-router-dom";
const SidebarAdmin = ({children})=>{
    const menuItem=[
        {
            path:'/',
            name:'HomePage',
            icon: <FaHome className="nav-logo-color" />,
            className: 'home-icon'
        },
        {
            path:'/add',
            name:'AddInstitute',
            icon: <AiOutlinePlus className="add-icon-color" />,
            className: 'add-icon'
        },

        {
            path:'/list',
            name:'ListInstitutes',
            icon: <FaList className="list-icon-color" />,
            className: 'list-icon'

        },
        {
            path:'/diploma',
            name:'ListDiploma',
            icon: <FaList className="list-icon-color" />,
            className: 'list-icon'

        },
    ];
    const style = {
        backgroundImage: `url('/images/photo.jpeg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        height: '100vh',
        paddingRight: '200px'
    };
    return(
        <div style={style}>
        <div className="container">
            <div className="sidebare">
                <div className="top_section">
                   <h1 className="logo">Admin</h1>
                   <div className="bars">
                    <FaBars/>
                   </div>
                </div>
                {
                    menuItem.map((item, index)=>(
                        <NavLink to={item.path} key={index} className="link" activeclassName="active">
                            <div className={`link_container ${item.className}`}>
                                {item.icon}
                                <div className="link_text">{item.name}</div>
                            </div>
                        </NavLink>
                    ))
                }
                
            </div>
            <main>{children}</main>
            
        </div>
        </div>
    );
};
export default SidebarAdmin;