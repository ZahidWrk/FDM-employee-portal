import React, { useState, useContext, useEffect } from 'react';
import Header from '../header/header';
import './LeaveRequest.css';
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';


const LeaveRequest = () => {
  document.title = 'Request Leave';
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [title, setTitle] = useState('');
    const [description, setDesc] = useState('');
    const [type, setType] = useState('');
    const [selectedOption, setSelectedOption] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
      
      // Function to handle option change
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
        setType(event.target.value);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        const updatedUser = {
          title: title,
          description: description,
          type: type,
          startDate: startDate,
          endDate: endDate,
        };

        fetch('/api/ticket', {
            method: 'POST', 
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json"
            },
            body: JSON.stringify(updatedUser)
          })
          .then(response => {
            if (response.ok) {
              console.log(response)
              console.log('Ticket sent successfully');
              navigate('/Home');
            } else {
              throw new Error('Failed to send ticket');
            }
          })
          .catch(error => {
            console.log('Error updating user information:', error);
            // Handle error (e.g., show error message to the user)
          });
        }
        useEffect(() => {
            if (!user) {
              navigate('/Loginform');
            }
          }, [user, navigate]);



    return (

        <>
          <div>
            <Header />
          </div>
    
          <div className='request-container'>
            <div className='request-header'>
              <h1>Request</h1>
            </div>
    
            <div className='request-info'>
            <form onSubmit={handleFormSubmit}>
              <div className='personal-info'>
                <div className='request-input'>
                <h1 className='title'>Title</h1>
                    <input 
                    className="RequestInputTitle" 
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    />
                </div>
              <div className='request-input'>
               <h1 className='title'>Description</h1>
              
                     <textarea 
                        className="RequestInputNotes" 
                        rows="5" 
                        type="text"
                        placeholder="Description"
                        value={description}
                        onChange={(e) => setDesc(e.target.value)}
                        required
                    />
                </div>

                <h1 className='title'>Select Request Type</h1>
                {/* Dropdown menu for selecting request type */}
                <div>
                <select className="select" value={selectedOption} onChange={handleOptionChange} required>
                    <option value="">Select...</option>
                    <option value="leave-request"> Leave Request</option>
                    <option value="general-ticket">General Ticket</option>
                </select>
                </div>

                {selectedOption === 'leave-request' && (
                    <>
                        <h1 className='title'>Start Date</h1>
                        <div className='startDate'>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                        </div>
                        
                        <h1 className='title'>End Date</h1>
                        <div className='endDate'>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                    </>
                )}


               
                <div>
                  
                    <button>Submit Request</button>
                  
                </div>
                
              </div>
              </form>
            </div>
          </div>
        </>
      );
}

export default LeaveRequest;
