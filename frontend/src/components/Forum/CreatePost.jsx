import React, { useState, useContext } from 'react';
import styles from './CreatePost.module.css'; // Import CSS module
import Header from '../header/header';
import axios from 'axios'; // Import axios
import { UserContext } from '../../context/userContext';
import { useNavigate } from 'react-router-dom';

const backendURL = "http://localhost:4000"; // Backend URL

const BlogPost = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const { user } = useContext(UserContext); // Assuming user object has an employeeId
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const postData = {
        title: title,
        body: body,
        date: new Date(),
        author: user.id // Assuming user object has an employeeId
      };
  
      // Send a POST request to create a new blog post
      const response = await axios.post(`${backendURL}/api/posts/newblog`, postData);
  
      console.log('Blog post created:', response);
      navigate(`../Forum`);
  
      // Check if response has data property
      if (response && response.data) {
        console.log('Response data:', response.data);
      } else {
        console.log('Response does not contain data.');
      }
  
      setTitle('');
      setBody('');
    } catch (error) {
      if (error.response && error.response.data) {
        console.error("Error creating post:", error.response.data);
      } else {
        console.error("Error creating post:", error.message);
      }
      // Handle error - show a message to the user, etc.
    }
  };
  

  // Function to clear the title and body fields
  const handleClear = () => {
    setTitle('');
    setBody('');
  };
  
  return (
    <div className={styles.wrapper}>
      <Header />
      <div className={styles.shadow}></div>
      <form onSubmit={handleSubmit}>
        <h1 className={styles.title}>Create Post</h1>
        <div className={styles.inputBox}>
          <input
            type="text"
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className={styles.inputBox}>
          <textarea
            placeholder='Blog Text'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
          />
        </div>

        <button type="submit" className={styles.submitButton}>Submit</button>
        <button type="button" onClick={handleClear} className={styles.clearButton}>
          Clear
        </button>

        <div className={styles.loginLink}>
          {/* You can add a link to redirect to another page if needed */}
        </div>
      </form>
    </div>
  );
};

export default BlogPost;