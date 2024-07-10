import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../header/header';
import './Contact.css'; 


const Contact = () => {
  document.title = 'Contact Page';

  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    fetch('/api/faq')
      .then(response => {
        if (response.ok) {
          return response.json();
        }
        throw new Error('Failed to fetch FAQ data');
      })
      .then(data => {
        setFaqData(data);
      })
      .catch(error => {
        console.error('Error fetching FAQ data:', error);
      });
  }, []);

  const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleAnswer = () => {
      setIsOpen(!isOpen);
    };

    return (
      <div className='faq-item'>
        <button className='question' onClick={toggleAnswer}>
          {question} 
        </button>
        {isOpen && <div className='answer'>{answer}</div>}
      </div>
    );
  };

  return (
    <>
      <div>
        <Header />
      </div>

      <div className='container'>
         <div className='Contact-header'>
          <h1> FAQs </h1>
        </div>

        <div className='contact-info'>
          <div className="contact-wrapper">
          
            {faqData.map(item => (
              <FAQItem
                key={item.id} // each FAQ item has an "id" property
                question={item.question}
                answer={item.answer}
              />
            ))}
          </div>
          
          <div className='additional-support'>
            <h3> For other Issues submit a support request to Admin </h3>
            <Link to='/Issue'> Submit an Issue </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Contact;
