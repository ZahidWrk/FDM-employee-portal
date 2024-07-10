import { useContext, useEffect, useState } from "react";
import Header from "../header/header";

import './admin.css';
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const Admin = () => {
    document.title = 'Admin Dashboard';

    const [issues, setIssues] = useState([]);
    const [solved, setSolved] = useState([]);

    const { user, updateUser } = useContext(UserContext);

    const navigate = useNavigate();

    // restricts to admin only
    useEffect(() => {
        if(!user) {
            navigate('/Loginform');
        } else if (user.account_type !== 'admin') {
            navigate('/Home');
        }
    })

    useEffect(() => {
        const getIssues = async () => {
            try {
                const response = await fetch('/api/admin/supportRequests', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    }
                });
                const data = await response.json();
                console.log(data);

                const solvedIssues = data.filter(issue => issue.solved === true);
                setSolved(solvedIssues);



                setIssues(data);

            } catch (error) {
                console.log('Error:', error);
            }

        }

        getIssues();
    }, [])


    // marks issue solved from the issue card
    const markSolved = async (issue) => {
        console.log("Marking solved.")

        try {
            await fetch('/api/admin/markIssueSolved', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    solved: true,
                    id: issue.id
                })
            });
        } catch (error) {
            console.log('Error:', error);
        }

        // move issue from 1 array to the other
        // removing from issues
        setIssues( issues => {
            return issues.filter( i => i.id !== issue.id)
        })


        // placing into solved
        setSolved( [
            ...solved,
            issue
        ])


    }

    const markUnSolved = async (issue) => {
        console.log("Marking solved.")

        try {
            await fetch('/api/admin/markIssueSolved', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: JSON.stringify({
                    solved: false,
                    id: issue.id
                })
            });
        } catch (error) {
            console.log('Error:', error);
        }
        
        // move issue from 1 array to the other
        // removing from issues
        setSolved( solved => {
            return solved.filter( s => s.id !== issue.id)
        })


        // placing into solved
        setIssues( [
            ...issues,
            issue
        ])

    }


    const submitPermissionChanges = (e) => {
        e.preventDefault();
        console.log('submitting');

        fetch('/api/admin/permissions',  {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                // fill out with state
                canPost: e.target.post_option.value,
                account_type: e.target.account_type.value,
                firstname: e.target.firstname.value,
                lastname: e.target.lastname.value
            })
        }).then( response => {
            if(response.ok) {
                console.log('Success');
            } else {
                console.log('Failed');
            }
        })
    }



    return ( 
        <>
        <Header />
        {user && <h1 className="page-title"> Welcome to the Admin Dashboard, {user.firstname }</h1>}
        <div className="admin-page">
            
            <div className="issue-section">
                {issues && 
                <div className="dashboard">
                    {issues.map(issue => (
                        <div className="issue" key={issue.id}>
                            <h1> {issue.title} </h1>
                            <div className="issue-information">
                                <p className="description"> {issue.description} </p>
                                <div className="issue-info">
                                    <p> submitted by {issue.firstname} {issue.lastname} </p>
                                    {/* needs date formating  */}
                                    <p>on {new Date(issue.date).toLocaleDateString()} </p>
                                </div>
                            </div>
                            <button className="solved-btn" onClick={ () => { markSolved(issue) }}>Mark as Solved</button>
                        </div>
                    ))}
                </div>}
            </div>
            
            <div className="permissions-area">
                <h1 className="permissions-title"> Change Permissions </h1>
                <form className="permissions-form" onSubmit={ (e) => { submitPermissionChanges(e) } } >
                    <div className="label-group" required={true}>
                        <label htmlFor="post_option"> Can post: </label>
                        <select name="post_option" id="">
                            <option value="true">true</option>
                            <option value="false">false</option>
                        </select>
                    </div>
                    <div className="label-group">
                        <label htmlFor="account_type"> Account Type: </label>
                        <select name="account_type" id="" required={true}>
                            <option value="none"> none </option>
                            <option value="admin"> admin </option>
                            <option value="hr"> hr </option>
                            <option value="ex-forces"> ex-forces </option>
                            <option value="returner"> returner </option>
                            <option value="graduate"> graduate </option>
                        </select>
                    </div>
                    <div className="label-group">
                        <label htmlFor="firstname"> Firstname: </label>
                        <input 
                            name="firstname"
                            type="text"
                            required={true}
                        />
                    </div>
                    <div className="label-group">
                        <label htmlFor="lastname"> Lastname: </label>
                        <input 
                            name="lastname"
                            type="text"
                            required={true}
                        />
                    </div>
                    <button type="submit" className="submit-btn"> Submit </button>
                </form>
            </div>

        </div>
        </>
     );
}
 
export default Admin;