import React, { useEffect } from "react";
import {useNavigate, useRoutes} from 'react-router-dom'

// Pages List
import Dashboard from "./components/dashboard/Dashboard";
import Profile from "./components/user/Profile";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import App from "./App";

// Auth Context
import { useAuth } from "./authContext";
import Home from "./components/home/Home";
import About from "./components/about/About";
import RepoPage from "./components/dashboard/RepoPage";

const ProjectRoutes = ()=>{
    const {currentUser, setCurrentUser} = useAuth();
    const navigate = useNavigate();

    useEffect(()=>{
        const userIdFromStorage = localStorage.getItem("userId");

        if(userIdFromStorage && !currentUser){
            setCurrentUser(userIdFromStorage);
        }

        if(!userIdFromStorage && !["/auth", "/signup"].includes(window.location.pathname))
        {
            navigate("/home");
        }

        if(userIdFromStorage && window.location.pathname=='/auth'){
            navigate("/");
        }
    }, [currentUser, navigate, setCurrentUser]);

    let element = useRoutes([
       
        {
            path:"/",
            element:<Dashboard/>
        },
        {
            path:"/home",
            element:<Home/>
        }
        ,
        {
            path:"/auth",
            element:<Login/>
        },
        {
            path:"/signup",
            element:<Signup/>
        },
        {
            path:"/profile",
            element:<Profile/>
        },
        {
           path:"/about",
           element:<About/>

        },{

            path:"/repo/id/:repoId",
            element:<RepoPage/>
        }
    ]);

    return element;
}

export default ProjectRoutes;