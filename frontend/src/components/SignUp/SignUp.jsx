// SignUp.jsx
import './SignUp.css';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import FDMLogo from '../../assets/FDMLogo.png'
import { Link, useNavigate } from 'react-router-dom';
import React, {  useContext, useEffect, useState } from 'react'
import Header from '../header/header';
import { UserContext } from '../../context/userContext';
//import Finder from '../../API/Finder';



export const SignUp = () => {
  document.title = 'Sign Up';

  const [firstname, setFName] = useState("");
  const [lastname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { user, updateUser } = useContext(UserContext); 

  // used to redirect users without causing a refresh
  const navigate = useNavigate();

  // redirect user if logged in
  useEffect(() => {
    if(user){
      navigate('/Home')
      return
    }
  })

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the email using regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email.match(emailRegex)) {
      document.getElementById('invalid-credentials').innerText = 'Invalid Email. Please try again.';
      document.querySelector('input[type="email"]').style.border = '1px solid red';
      return;
    }
    // Finder.post("/api/register", {
    //   firstname: firstname,
    //   lastname: lastname,
    //   email: email,
    //   password: password,
    // })
    fetch('/api/register', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        firstname: firstname,
        lastname: lastname,
        email: email,
        password: password,
      })
    }).then(response => {
      console.log(response);
      console.log('Signed up Successfully');
      navigate('/LoginForm');
    })
    .catch((err) => {
      console.log('Error signing up In:', err);
    });
    
    
  }

  return (
    <>
    <Header />
    <div className='SignUp'>
      <div className='shadow'> </div>
      <form action="">
      <div className="Logo">
            <img src={FDMLogo} alt="fdm logo" />
        </div>
        <h1>Sign Up</h1>
        <p>Make a new account</p>
        <div className='input-box'>
        <input
                type="email"
                placeholder='Email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
            <FaUser className='icon'/>
        </div>
        <div className='Name'>
            <div className='input-name'>
            <input
                type="text"
                placeholder='First name'
                value={firstname}
                onChange={(e) => setFName(e.target.value)}
                required
            />

            </div>
            <div className='input-name'>
            <input
                type="text"
                placeholder='Last name'
                value={lastname}
                onChange={(e) => setLName(e.target.value)}
                required
            />
            </div>
        </div>
        <div className='input-box'>
        <input
                type="password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <FaLock className='icon' />
        </div>

        <button onClick={handleSubmit} type ="submit" className='signupButton'>Sign Up</button>

        <div className="have-account">
            <Link to='/LoginForm'>Already have an account?</Link>
        </div>

        <div className="login-link">
        <Link to='/LoginForm'>Login</Link>
        </div>

    
      </form>
    </div>
    </>
  );
};

export default SignUp;