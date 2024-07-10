import React, { useContext, useEffect, useState } from 'react';
import './SearchResults.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Header from '../header/header';
import { UserContext } from '../../context/userContext';
import { useLocation } from 'react-router-dom';


export const SearchResults = () => {
  document.title = 'Search Results';

  const { user, updateUser } = useContext(UserContext);

  const [searchResults, setSearchResults] = useState([]);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get('query');
  console.log({query});

  useEffect(() => {

    const getSearchResults = async () => {
      fetch('/api/search', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(
          {
            "searchParam": query
          }
        )
      }).then( res => {
        if(res.ok) {
          return res.json();
        } else {
          throw new Error('Unknown status code returned from the server.');
        }
      }).then( data => {
        console.log(data.searchResults);
        setSearchResults(data.searchResults);
      }).catch( (e) => {
        console.log(e);
      });
    }

    getSearchResults();
    
  }, [query])

  const title = !query ? "All employees:" : `Accounts with '${query}' in first name`;

  return (
    <>
        <Header />
        <div className='SearchResults'>
            <h1 className='title'>{title}</h1>
            <div className='headings'>
              <h2>Name</h2>
              <h2>Email</h2>
              <h2>Role</h2>
            </div>
            {searchResults && <div className='results'>
              {searchResults.map( (result) => {
                return (
                  <div className='result'>
                    <p>{result.firstname} {result.lastname}</p>
                    <p>{result.email}</p>
                    <p>{result.account_type}</p>
                  </div>
                )
              })}
            </div>}
        </div>
    </>
  );
};

export default SearchResults;