// login.jsx
import { useState, useContext, useEffect } from 'react';
import './LoginForm.css';
import { FaUser } from "react-icons/fa";
import { FaLock } from "react-icons/fa";
import FDMLogo from '../../assets/FDMLogo.png'
import { Link, useNavigate } from 'react-router-dom';
import Header from '../header/header';

import { UserContext } from '../../context/userContext';

export const LoginForm = () => {
  document.title = 'Login Form';

  // declare the navigate function using hook
  const navigate = useNavigate();

  // state for the email and password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  // temporary user state rather than context
  const {user, updateUser} = useContext(UserContext);

  // handle the call to the backend for logging in
  const handleLogin = (e) => {
    e.preventDefault();

    // Validate the email using regex
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email.match(emailRegex)) {
      document.getElementById('invalid-credentials').innerText = 'Invalid Email. Please try again.';
      document.querySelector('input[type="email"]').style.border = '1px solid red';
      return;
    }

    // call from proxy
    // fetch('/api/login/', {
    //   method: 'POST',
    //   headers: {
    //     "Content-Type": "application/json",
    //     Accept: "application/json"
    //   },
    //   body: JSON.stringify(
    //     {
    //       "email": email,
    //       "password": password
    //     }
    //   )
    // }).then( (res) => {
    //   if (res.status === 200) { // successful login
    //     console.log('Logged In Successfully');
    //     // window.location.href = '/Home';
    //   } else if (res.status === 401){ // invalid credentials
    //     document.getElementById('invalid-credentials').innerText = 'Invalid Credentials. Please try again.';
    //     document.querySelector('input[type="email"]').style.border = '1px solid red';
    //     document.querySelector('input[type="password"]').style.border = '1px solid red';
    //   } else {
    //     throw new Error('Unknown status code returned from the server.');
    //   }
    // }).catch( (e) => {
    //   console.log('Error Logging In:', e);
    // })

    // call from proxy
    fetch('/api/login/', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        "email": email,
        "password": password
      })
    })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else if (res.status === 401) { // invalid credentials
        document.getElementById('invalid-credentials').innerText = 'Invalid Credentials. Please try again.';
        document.querySelector('input[type="email"]').style.border = '1px solid red';
        document.querySelector('input[type="password"]').style.border = '1px solid red';
        throw new Error('Invalid Credentials. Please try again.');
      } else {
        throw new Error('Unknown status code returned from the server.');
      }
    })
    .then(data => {
      if (data && data.user) { // successful login
        console.log('Logged In Successfully');
        // window.location.href = '/Home';
        updateUser(data.user);
        console.log(data.user);
      } else {
        throw new Error('User data not found in API response.');
      }
    }).then( () => {
      // use navigate instead of window.location.href because reload messes up the context
      navigate('/Home');
    })
    .catch(error => {
      console.log('Error Logging In:', error);
    });
    

  }

  // redirection for if user is already logged in
  useEffect( () => {
    if (user) {
      navigate('/Home');
    }
  
  })


  return (
    <>
    <Header />
      {/* <button onClick={ () => { console.log(user)}}> LOL </button> */}
      <div className='Login'>
        <div className='shadow'></div>
        <form onSubmit={handleLogin}>
          <div className="Logo">
            <img src={FDMLogo} alt="fdm logo"/>
          </div>
          <h1>Login</h1>
          <p>Sign in to your account</p>
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
          <div className='input-box'>
            <input
                type="password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <FaLock className='icon'/>
          </div>

          <button type="submit" className='loginButton'>Login</button>

          <div className="forgot-password">
            <a href="#"> Forgot password?</a>
          </div>

          <div className="register-link">
            <Link to='/SignUp'>Sign Up</Link>
          </div>
        </form>
        <p id="invalid-credentials"></p>
      </div>
    </>
  );
};

export default LoginForm;