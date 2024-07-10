import React, {useState, useEffect} from 'react';
import Header from '../header/header';
import './Documents.css';

const Document = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await fetch('/api/document/getList', {
        method: 'GET',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
      });
      let data = await response.json();
      // Remove any null values from the list
      data = data.filter((document) => document !== null);

      setDocuments(data);

    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <>
      <Header />
      <div className='wrapper class-documents'>
        <div className='Documents-header'>
          <h1>Your Documents</h1>
        </div>
        <div className='info'>
          <table>
            {documents && Array.isArray(documents) && documents.length > 0 && (
                <thead>
                <tr className="document-item">
                  <th className="left">Title</th>
                  <th className="middle">Upload Date</th>
                  <th className="right">Download</th>
                </tr>
                </thead>
            )}
            <tbody>
            {documents && Array.isArray(documents) && documents.length > 0 ?
                (documents.map((document, index) => (
                        <tr key={index} className="document-item">
                          <td className="left">
                            {document && document.title ? (document.title).split("_")[0] + " " : 'Untitled'}
                            ({document && document.type ? document.type : 'Unknown'})
                          </td>
                          <td className="middle">
                            {document && document.uploaddate ? formatDate(document.uploaddate) : 'Unknown'}
                          </td>
                          <td className="right">
                            <a href={document && document.url ? document.url : "#"} download>
                              Download
                            </a>
                          </td>
                        </tr>
                    ))
                ) : (
                    <p id="no-documents">No documents uploaded.</p>
                )
            }
            </tbody>
          </table>
        </div>
      </div>
    </>
  );


};

export default Document;
