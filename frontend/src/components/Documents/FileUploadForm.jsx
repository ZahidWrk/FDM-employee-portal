import { useState } from 'react';
import axios from 'axios';
import Header from '../header/header';
import './FileUploadForm.css'; // Import the CSS file for styling

const FileUploadForm = () => {
  const [file, setFile] = useState(null);
  const [type, setType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleTypeChange = (event) => {
    setType(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file || !type) {
      setErrorMessage('Please select a file and specify its type.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      await axios.post('/api/document/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      setFile(null);
      setType('');
      setErrorMessage('');
      alert('File uploaded successfully!');
    } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
      setErrorMessage('Error uploading file. Please try again.');
    }
  };

  return (
    <div>
      <Header/>
      <div className='wrapper'>
        <div className='upload-header'>
          <h1>Upload Document</h1>
        </div>
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        <form onSubmit={handleSubmit}>
        <div className='info'>
          <div>
            <label>Select File:</label>
            <input type="file" accept=".png, .jpeg, .pdf, .docx, .doc" onChange={handleFileChange} />
          </div>
          <div>
            <label>Select Type:</label>
            <select value={type} onChange={handleTypeChange}>
            <option value="">Select Type</option>
            <option value="progress_report">Progress Report</option>
            <option value="other">Other</option>
          </select>
          </div>
          <button type="submit">Upload</button>
        </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploadForm;
