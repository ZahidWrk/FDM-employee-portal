import React, {useContext, useEffect, useState} from 'react';
import './Home.css';
import FDMLogo from '../../assets/FDMLogo.png'
import { Link, useNavigate } from 'react-router-dom';
import Header from '../header/header';
import { UserContext } from '../../context/userContext';


export const Home = () => {
  document.title = 'Home';
  const { user, updateUser } = useContext(UserContext);
  const [ticket, updateTicket] = useState(null);

  const [hours, setHours] = useState(user && user.hoursworked ? user.hoursworked : 0);
  const [issues, setIssues] = useState([]);

  // navigate used to redirect users without causing a refresh
  const navigate = useNavigate();


    async function getTickets() {
        console.log('Getting tickets');
        const response = await fetch('/api/ticket/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            // body: JSON.stringify({
            //     userId: user.id
            // })
        });
        if (!response.ok) {
            updateTicket([])
        }
        const data = await response.json();
        updateTicket(data);
    }

    const getIssues = () => {
      console.log('Getting issues');
      fetch('/api/admin/supportRequests/personal', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({
              userId: user.id
          })
      }).then(response => {
          if (!response.ok) {
              setIssues([])
          }
          return response.json();
      
      }).then(data => {
          setIssues(data);
      }).catch(console.error);
      
  }

  // checks for user existence
  useEffect(() => {
    if(!user) {
      navigate('/Loginform');
    }
    getTickets().catch(console.error);
    getIssues();

  }, [navigate]);


  const logHours = (e) => {

    e.preventDefault();

    fetch('/api/loghours', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        userId: user.id,
        hours: hours
      })
    }).then(response => {
      if (response.ok) {
        console.log('Hours logged');
      }
    }).catch(console.error)
  }



  return (
    <>
        <Header />
        <div className='Home'>
            <div className='title'>
                {user && <h1>Welcome to your FDM Employee Portal, { user.firstname }</h1>}
            </div>
            <div className='dashboard'>
                <div className="navigation">
                  <h2>Navigation</h2>
                  <ul className='content'>
                    <li className='main'>Forum</li>
                    <ul>
                      <li><Link to='/Forum' className='link'>View Posts</Link></li>
                      {/* Render Create a Post link based on user's permission */}
                      {user && user.canpost ? (
                        <li><Link to='/CreatePost' className='link'>Create a Post</Link></li>
                      ) : null}
                    </ul>
                    <li className='main' id='x'><Link to='/Contact' className='link'>Contact</Link></li>
                    <li className='main'><Link to='/Documents' className='link'>Documents</Link></li>
                    <li className='main'><Link to='/Programs' className='link'>Programs</Link></li>
                    <div>
                      { user && user.account_type === 'admin' ? (
                        <li className='main'><Link to='/Admin' className='link'> Admin Dashboard </Link></li>
                      ) : (
                        <></>
                       )}
                    </div>
                    <div>
                      { user && user.account_type === 'hr' ? (
                        <li className='dropdown'>
                          <p className='main'>HR</p>
                          <ul className='y'>
                            <li><Link to='/SelectEmployeePayslip' className='link'>Send payslip</Link></li>
                            <li><Link to='/SelectEmployee' className='link'>Edit employee account</Link></li>
                          </ul>
                        </li>
                      ) : (
                        <></>
                       )}
                    </div>
                    <li className='main'>Account</li>
                    <ul>
                      <li><Link to='/Account' className='link'>Account</Link></li>
                      <li><Link to='/EditAccount' className='link'>Edit Account Info</Link></li>
                      <li><Link to='/LeaveRequest' className='link'>Request</Link></li>
                      <li><Link to='/Issue' className='link'> Issue </Link></li>
                    </ul>
                  </ul>
                </div>
                <div className='information-area'>
                  
                  <div className='announce'>
                  <h3>Company Accouncements</h3>
                    <p>Company meeting on 11/04</p> {/*placeholder*/}
                  </div>
                  <div className="ticket">
                    <h3>Ticket Status</h3>
                      <UserContext.Provider value={{ ticket, getTickets }}>
                          {
                              ticket && Array.isArray(ticket) && ticket.length > 0 ? (
                                  ticket.map((ticket) => {
                                      return (
                                          <div key={ticket.id}>
                                              <p>{ticket.title + " "}
                                                  ({ticket.status ? 'Closed' : 'Open'})
                                              </p>
                                          </div>
                                      )
                                  })
                              ) : (
                                  <p>No submitted tickets</p>
                              )
                          }
                      </UserContext.Provider>
                  </div>
                  <div className="issues">
                    <h3> Issues Status</h3>
                    {issues && issues.length > 0 ? ( 
                      <div>
                        {issues.map((issue) => {
                          return (
                            <div key={issue.id}>
                              <p className='issue-status'>{issue.title + " "}
                                ({issue.status ? 'Closed' : 'Open'})
                              </p>
                            </div>
                          )
                        })}
                      </div>
                   ) : (
                    <div> No issues reported</div>
                   )}
                  </div>
                  <div className='hours'>
                    <h3>Hours Worked This Week</h3>
                      <h1>{(user) ? (hours + " hrs") : "Hours not logged."}</h1>
                      <form onSubmit={ (e) => {logHours(e)}}>
                        <h3> Log Hours </h3>
                        <label className='hours-label' htmlFor="hours"> Hours: </label>
                        <input  
                          name='hours' 
                          type="number" 
                          value={hours}
                          onChange={(e) => {setHours(e.target.value)}}
                          required
                        />
                        <button className='log-btn' type="submit"> Log </button>
                      </form>
                  </div>
                </div>
            </div>
        </div>
    </>
  );
};

export default Home;
