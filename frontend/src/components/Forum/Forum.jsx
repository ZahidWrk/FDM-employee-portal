import React, { useState, useEffect, useContext } from 'react';
import styles from './Forum.module.css';
import Header from '../header/header';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../../context/userContext';

const Forum = () => {
  const [blogs, setBlogs] = useState([]);
  const [sortBy, setSortBy] = useState('author');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get('/api/posts/');
      const blogsData = response.data;

      // Fetch replies for each blog post
      const blogsWithReplies = await Promise.all(
        blogsData.map(async (blog) => {
          const repliesResponse = await axios.get(`/api/posts/replies/${blog.id}`);
          const numReplies = repliesResponse.data.length;
          return { ...blog, numReplies };
        })
      );

      setBlogs(blogsWithReplies);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const sortedBlogs = () => {
    switch (sortBy) {
      case 'author':
        return blogs.slice().sort((a, b) => {
          const authorA = String(a.author).toLowerCase();
          const authorB = String(b.author).toLowerCase();
          return authorA.localeCompare(authorB);
        });
      case 'date':
        return blogs.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
      case 'alphabetical':
        return blogs.slice().sort((a, b) => {
          const titleA = String(a.title).toLowerCase();
          const titleB = String(b.title).toLowerCase();
          return titleA.localeCompare(titleB);
        });
      default:
        return blogs;
    }
  };

  const renderBlogs = () => {
    return sortedBlogs().map((blog, index) => (
      <div key={blog.id} className={styles.blog}>
        <div className={styles.blogHeader}>
          <h2>{blog.title}</h2>
          <div className={styles.blogInfo}>
            <p>
              <span className={styles.small}>Author:</span> {blog.firstname} {blog.lastname}
            </p>
            <p>
              <span className={styles.small}>Date:</span> {new Date(blog.date).toLocaleDateString()}
            </p>
            <p>
              <span className={styles.small}>Replies:</span> {blog.numReplies}
            </p>
          </div>
        </div>
        <p>{blog.body}</p>
        <hr className={styles.blogDivider} />
        {/* Update Link to point to ReplyPost with blog id */}
        <Link to={`/replyPost/${blog.id}`} className={styles.replyButton}>
          View Replies
        </Link>
      </div>
    ));
  };

  // Render New Post link based on user permissions
  const renderNewPostLink = () => {
    if (user && user.canpost) {
      return (
        <div className={styles.topButtons}>
          <Link to="/createPost" className={styles.newPostLink}>
            New Post
          </Link>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={styles.page}>
      <Header />
      <div className={styles.wrapper}>
        {renderNewPostLink()}
        <div className={styles.container}>
          <div className={styles.welcomeMessage}>
            Welcome to the Forum!
          </div>
          <div className={styles.filterDropdown}>
            <select id='sortSelect' value={sortBy} onChange={handleSortByChange} className={styles.select}>
              <option value='author'>Author</option>
              <option value='date'>Latest</option>
              <option value='alphabetical'>Alphabetical</option>
            </select>
          </div>
          {renderBlogs()}
        </div>
      </div>
    </div>
  );
};

export default Forum;
