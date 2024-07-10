import './Account.css';
import Header from '../header/header';
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../context/userContext';
import { Link, useNavigate } from 'react-router-dom';

export const Account = () => {
  document.title = 'Your Account';

  const { user, updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Function to fetch updated user data
const fetchUserData = async () => {
  try {
    const response = await fetch('/api/userProfile'); // Ensure this endpoint correctly identifies the user (e.g., via session or token)
    if (response.ok) {
      const userData = await response.json();
      updateUser(userData); // Assumes updateUser updates the context with the fetched data
    } else {
      throw new Error('Failed to fetch user data');
    }
  } catch (error) {
    console.error('Error fetching user data:', error);
    // Consider handling errors, e.g., by showing a message to the user or redirecting to a login page
  }
};

  // Fetch user data on component mount
  useEffect(() => {
    if (!user) {
      navigate('/Loginform');
    } else {
      fetchUserData();
    }
  }, [user, navigate, updateUser]);

  return (
    <>
      <div>
        <Header />
      </div>

      <div className='account-container'>
        <div className='personal-header'>
          <h1>Personal information</h1>
        </div>

        <div className='info'>
          <div className='personal-info'>
            <h1 className='title'>First name</h1>
            <div className='fname'>{user && <p>{user.firstname}</p>}</div>
            <h1 className='title'>Last name</h1>
            <div className='lname'>{user && <p>{user.lastname}</p>}</div>
            <h1 className='title'>Number</h1>
            <div className='number'>{user && <p>{user.phone}</p>}</div>
            <h1 className='title'>Email</h1>
            <div className='email'>{user && <p>{user.email}</p>}</div>
            <div className='edit-button'>
              <Link to='/EditAccount'>
                <button className='account-button'>Edit Personal Info</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Account;
