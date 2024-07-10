import React, { useContext, useState } from 'react';
// import './Programs.css';
import FDMLogo from '../../assets/FDMLogo.png'
import { Link, useNavigate } from 'react-router-dom';
import Header from '../header/header';
import { UserContext } from '../../context/userContext';
import { useEffect } from 'react';

import '../Programs/Programs.css';

export const Training = () => {
  document.title = 'Trainings';

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
      fetch('/api/training/yourTrainings', {
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
        console.error('Error Getting trainings', err)
      });
    };

    const fetchAllPrograms = async () => {
      fetch('/api/training', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      }).then( response => {
        if (response.status === 401) {
          console.error('Error Gettings trainings')
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
        console.error('Error Getting trainings', err)
      });
    }

    fetchPrograms();
    fetchAllPrograms();
  }, [user])


  const enrol = async (training) => {
    fetch('/api/training/enrol', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.id,
        trainingId: training.id
      })
    }).then( response => {
      if (response.status === 401) {
        console.error('Error Enrolling in training')
        navigate('/Home')
      }

      if(response.ok) {
        setPersonalPrograms([...personalPrograms, training]);
        return response.json()
      }
    }).catch(err => {
      console.error('Error Enrolling in training', err)
    });
  }

  const unenrol = async (trainingId) => {
    fetch('/api/training/unenrol', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: user.id,
        trainingId: trainingId
      })
    }).then( response => {
      if (response.status === 401) {
        console.error('Error Unenrolling in training')
        navigate('/Home')
      }

      if(response.ok) {
        setPersonalPrograms(personalPrograms.filter(program => program.id !== trainingId));
        return response.json()
      }
    }).catch(err => {
      console.error('Error Unenrolling in training', err)
    });
  }


  return (
    <>
        <Header />
        <div className="programs-page">
          <div className="all-programs">
            <h1 className='bigtitle'> All Training Available </h1>
            { allPrograms && 
            <div className='programs-grid'>
              {allPrograms.map(program => (
                <div key={program.id} className='program'>
                  <h2 className='title'>{program.name}</h2>
                  <p className=''>{program.description}</p>
                  <div className='btn-group'>
                    {/* <Link to={`/${program.link}`}>View Training </Link> */}
                    <button className='btn' onClick={() => enrol(program)}> Enrol </button>
                  </div>
                </div>
              ))}
            </div>
            }
          </div>
          <div className='yourprograms'>
              <h1 className='bigtitle'>Your Enrolled Training </h1>
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

export default Training;