import React, { useContext, useState } from 'react';
import './Programs.css';
import FDMLogo from '../../assets/FDMLogo.png'
import { Link, useNavigate } from 'react-router-dom';
import Header from '../header/header';
import { UserContext } from '../../context/userContext';
import { useEffect } from 'react';

import './Programs.css';

export const Programs = () => {
  document.title = 'Programs';

  const navigate = useNavigate();

  const { user, updateUser } = useContext(UserContext);

  const [personalPrograms, setPersonalPrograms] = useState([]);
  const [allPrograms, setAllPrograms] = useState([]);


  // useEffect(() => {
  //   if (!user) {
  //     navigate('/Loginform');
  //   }
  // }, [user])

  useEffect(() => {
    const fetchPrograms = async () => {
      fetch('/api/programs/yourPrograms', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id
        })
      }).then( response => {
        if (response.status === 401) {
          console.error('Error Gettings programs')
          navigate('/Home')
        }

        if(response.ok) {
          return response.json()
        }
      }).then(data => {
        if (data) {
          console.log(data)
          setPersonalPrograms(data);
        }
        return;
      }).catch(err => {
        console.error('Error Getting programs', err)
      });
    };

    const fetchAllPrograms = async () => {
      fetch('/api/programs', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then( response => {
        if (response.status === 401) {
          console.error('Error Gettings programs')
          navigate('/Home')
        }

        if(response.ok) {
          return response.json()
        }
      }).then(data => {
        if (data) {
          setAllPrograms(data);
        }
        return;
      }).catch(err => {
        console.error('Error Getting programs', err)
      });
    }

    fetchPrograms();
    fetchAllPrograms();
  }, [user])


  const enrol = async (program) => {
    fetch('/api/programs/enrol', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.id,
        programId: program.id
      })
    }).then( response => {
      if (response.status === 401) {
        console.error('Error Enrolling in program')
        navigate('/Home')
      }

      if(response.ok) {
        setPersonalPrograms([...personalPrograms, program]);
        return response.json()
      }
    }).catch(err => {
      console.error('Error Enrolling in program', err)
    });
  }

  const unenrol = async (programId) => {
    fetch('/api/programs/unenrol', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.id,
        programId: programId
      })
    }).then( response => {
      if (response.status === 401) {
        console.error('Error Unenrolling in program')
        navigate('/Home')
      }

      if(response.ok) {
        setPersonalPrograms(personalPrograms.filter(program => program.id !== programId));
        return response.json()
      }
    }).catch(err => {
      console.error('Error Unenrolling in program', err)
    });
  }


  return (
    <>
        <Header />
        <div className="programs-page">
          <div className="all-programs">
            <h1 className='bigtitle'> All Programs </h1>
            { allPrograms && 
            <div className='programs-grid'>
              {allPrograms.map(program => (
                <div key={program.id} className='program'>
                  <h2 className='title'>{program.name}</h2>
                  <p className=''>{program.description}</p>
                  <div className='btn-group'>
                    {/* <Link to={`/${program.link}`}>View Program</Link> */}
                    <button className='btn' onClick={() => enrol(program)}> Enrol </button>
                  </div>
                </div>
              ))}
            </div>
            }
          </div>
          <div className='yourprograms'>
              <h1 className='bigtitle'>Your Progams</h1>
              { personalPrograms && 
              <div>
                  {personalPrograms.map(program => (
                      <div key={program.id} className='program'>
                          <h2 className='title'>{program.name}</h2>
                          {/* <p className=''>{program.description}</p> */}
                          <div className='btn-group'>
                            {/* <Link to={`/${program.link}`}>View Program</Link> */}
                            <button className='btn' onClick={() => unenrol(program.id)}> Unenrol </button>
                          </div>
                      </div>
                  ))}
              </div> 
              }
          </div>
        </div>
    </>
  );
};

export default Programs;