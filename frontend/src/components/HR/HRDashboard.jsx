import { useContext, useEffect, useState } from "react";
import Header from "../header/header";
import './HRDashboard.css';
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const HRDashboard = () => {
    document.title = 'HR Dashboard';

    const [ticket, setTicket] = useState([]);

    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchLeaveRequests = async () => {
            try {
                const response = await fetch('/api/ticket/getList', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    }
                });
                const data = await response.json();
                console.log(data);
                setTicket(data);

            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchLeaveRequests();
    }, []);

    const updateRequestStatus = async (requestId, status) => {
        try {
            fetch(`/api/ticket/updateStatus/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({ status })
            });

            // Update the list of leave requests to reflect the change
            setTicket(prevRequests =>
                prevRequests.filter(req => req.id !== requestId)
            );

        } catch (error) {
            console.error('Error:', error);
        }
    };

    // Accept/Reject leave requests
    const updateLeaveRequestStatus = async (requestId, status) => {
        try {
            fetch(`/api/ticket/updateLeaveRequest`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({ requestId, status })
            });

            // Remove from the list of leave requests
            setTicket(prevRequests =>
                prevRequests.filter(req => req.id !== requestId)
            );

        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <>
            <Header />
            {user && <h1 className="page-title">Welcome to the HR Dashboard, {user.firstname}</h1>}
            <div className="class-hrdashboard">
                <div className="leave-requests-section">
                    {
                        ticket && ticket.length > 0 ? ticket.map(request => (
                            <div className="request-card" key={request.id}>
                                <p className="request-card-title">{request.title}</p>
                                <div>
                                    <p className="request-card-description">
                                        Description: &quot;{request.description}&quot;
                                    </p>
                                    <div className="request-info">
                                        <p>
                                            Submitted by {
                                            request.submittedby ?
                                                request.submittedby + " " : 'Unknown '
                                        }
                                            on {new Date(request.date).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                {/* Show different buttons based on the type of request
                                    - Leave requests can be approved or rejected
                                    - General tickets can only be resolved*/}
                                {
                                    request && request.ticket_type === 'general-ticket' ? (
                                        <button
                                            className="action-btn resolve-btn"
                                            onClick={() => updateRequestStatus(request.id, true)}>
                                            Resolve
                                        </button>
                                    ) : ( // Leave request
                                        <div>
                                            <button
                                                className="action-btn approve-btn"
                                                onClick={() => updateLeaveRequestStatus(request.id, true)}>
                                                Approve
                                            </button>
                                            <button
                                                className="action-btn reject-btn"
                                                onClick={() => updateLeaveRequestStatus(request.id, false)}>
                                                Reject
                                            </button>
                                        </div>
                                    )
                                }
                            </div>
                )) : <p>No leave requests to show</p>
                }
            </div>
        </div>
</>
)
    ;
};

export default HRDashboard;