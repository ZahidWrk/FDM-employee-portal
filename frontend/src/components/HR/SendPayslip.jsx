import React, { useState, useContext, useEffect } from 'react';
import './SendPayslip.css';
import Header from '../header/header';
import { UserContext } from '../../context/userContext';
import { useLocation, useNavigate } from 'react-router-dom';

export const SendPayslip = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [file, setFile] = useState(null);
    const employee = location.state?.employee;

    // restricts to hr and admin only
    useEffect(() => {
        if(!user) {
            navigate('/Loginform');
        } else if (user.account_type !== 'hr' && user.account_type !== 'admin') {
            navigate('/Home');
        }
    })

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !employee) {
            alert("No file selected or employee specified.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("employeeId", employee.id);

        try {
            const response = await fetch('/api/document/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                alert("Payslip sent successfully!");
                navigate('/SelectEmployeePayslip'); 
            } else {
                alert("Failed to send payslip.");
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            alert("Error sending payslip.");
        }
    };

    return (
        <>
            <Header />
            <div className='send-payslip-header'>
              <h1>Send Payslip to {employee?.firstname} {employee?.lastname}</h1>
            </div>
            <div className="send-payslip-container">
                <form onSubmit={handleSubmit}>
                    <h2 className="selectFile">Select file</h2>
                    <input type="file" onChange={handleFileChange} />
                    <button type="submit">Send Payslip</button>
                </form>
            </div>
        </>
    );
};

export default SendPayslip;
