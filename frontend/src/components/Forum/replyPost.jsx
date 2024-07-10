import React, { useState, useEffect, useContext } from 'react';
import styles from './replyPost.module.css';
import Header from '../header/header';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

const ReplyPost = () => {
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [replies, setReplies] = useState([]);
  const [replyText, setReplyText] = useState('');
  const { user } = useContext(UserContext);
  const { blogId } = useParams(); // Make sure useParams() is imported and used correctly

  console.log('blogId:', blogId); // Check if blogId is received correctly

  useEffect(() => {
    if (blogId) { // Make sure blogId exists before fetching data
      fetchSelectedBlog();
      fetchReplies();
    }
  }, [blogId]); // Include blogId in the dependency array

  const fetchSelectedBlog = async () => {
    try {
      const response = await axios.get(`/api/posts/${blogId}`);
      setSelectedBlog(response.data);
    } catch (error) {
      console.error('Error fetching selected blog:', error);
    }
  };
  
  const fetchReplies = async () => {
    try {
      const response = await axios.get(`/api/posts/replies/${blogId}`);
      setReplies(response.data);
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };

  const handleSubmitReply = async (event) => {
    event.preventDefault();
    try {
      if (!user || !user.id) {
        console.error('User ID is not available.');
        return;
      }
  
      if (!selectedBlog || !selectedBlog.id) {
        console.error('Selected blog ID is not available.');
        return;
      }
  
      const replyData = {
        postid: selectedBlog.id, // Update key to 'postid'
        body: replyText,
        author: user.id,
      };
  
      const response = await axios.post(`/api/posts/reply`, replyData);
  
      console.log('Reply submitted:', response.data);
  
      fetchReplies();
  
      setReplyText('');
    } catch (error) {
      if (error.response && error.response.data) {
        console.error('Error submitting reply:', error.response.data);
      } else {
        console.error('Error submitting reply:', error.message);
      }
    }
  };
  

  const renderReplies = () => {
    return replies.map(reply => (
      <div key={reply.id} className={styles.reply}>
        <div className={styles.replyText}>
          <p>{reply.body}</p>
          <hr className={styles.separator} />
          <p>Author: {reply.firstname} {reply.lastname} </p>
        </div>
      </div>
    ));
  };

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.content}>
        <h1>Reply to Blog</h1>
        <hr className={styles.separator} />
        {selectedBlog && (
          <div className={styles.selectedBlog}>
            <h2>{selectedBlog.title}</h2>
            <p>Author: {selectedBlog.firstname} {selectedBlog.lastname} </p>
            <p>Date: {new Date(selectedBlog.date).toLocaleDateString()}</p>
            <hr className={styles.separator} />
            <p>{selectedBlog.body}</p>
          </div>
        )}
        <hr className={styles.separator} />
        <h2>Replies:</h2>
        {replies.length > 0 ? (
          <div className={styles.repliesList}>
            {renderReplies()}
          </div>
        ) : (
          <p>This post has no replies.</p>
        )}

        <form onSubmit={handleSubmitReply} className={styles.replyForm}>
          <div className={styles.inputBox}>
            <textarea
              placeholder='Enter your reply...'
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              required
            />
          </div>
          <button type='submit' className={styles.submitButton}>Submit Reply</button>
          <div className={styles.buttonContainer}>
            <Link to="/Forum" className={styles.backLink}>
              Back to Forum
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyPost;
