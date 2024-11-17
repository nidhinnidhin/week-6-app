import React from "react";
import {Routes, Route} from 'react-router-dom';
import SignUp from "./pages/signUp";
import Home from "./pages/home";
import Login from "./pages/login";
import UserList from "./admin/userList";
import AdminLogin from "./admin/adminLogin";

function App() {
  return (
    <Routes>
      <Route path="/" element = {<SignUp/>}/>
      <Route path="/home" element = {<Home/>}/>
      <Route path="/login" element = {<Login/>}/>
      <Route path="/userslist" element = {<UserList/>}/>
      <Route path="/adminlogin" element = {<AdminLogin/>}/>
    </Routes>
  );
}

export default App;
