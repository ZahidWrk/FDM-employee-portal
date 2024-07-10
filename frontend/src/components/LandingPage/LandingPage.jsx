import React, { useContext } from 'react';
import './LandingPage.css';
import FDMLogo from '../../assets/FDMLogo.png'
import { Link } from 'react-router-dom';
import Header from '../header/header';
import { UserContext } from '../../context/userContext';

export const LandingPage = () => {
  const { user, updateUser } = useContext(UserContext);

  document.title = 'Landing Page';

  const handleLogout = () => {
    fetch('/api/logout', {
      method: 'POST'
    })
    .then( (res) => {
      if (res.status === 200) {
        updateUser(null);
        localStorage.removeItem('user');
        navigate('/Loginform');
      } else {
        throw new Error('Unknown status code returned from the server.');
      }
    })
  }

  return (
    <>
      <Header />
      <div className='Landing'>
        <div className='shadow'></div>
        <form>
          <div className="Logo">
            <img src={FDMLogo} alt="fdm logo"/>
          </div>
          <h1>Welcome to FDM employee portal</h1>
          {user ? ( 
            <>
            <div className="register-login" id='logout'>
              <button onClick={ handleLogout }> Logout </button>
            </div>
            </>
          ) : (
          <>
          <div className="register-login">
            <Link to='/SignUp'><button>Sign Up</button></Link>
          </div>
          <div className="register-login">
            <Link to='/LoginForm'><button>Login</button></Link>
          </div>
          </>
          ) }
          <p>An essential hub to access everything you’ll need during your time at FDM</p>
        </form>
      </div>
    </>
  );
};

export default LandingPage;
