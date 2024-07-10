import './Issue.css'
import Header from '../header/header'
import { UserContext } from '../../context/userContext'
import { useContext } from 'react'
import { useNavigate } from 'react-router-dom'

const Issue = () => {
    document.title = 'Submit an Issue';

    const {user, updateUser} = useContext(UserContext)

    const navigate = useNavigate();

    const sendSupportRequest = async (e) => {
        e.preventDefault();

        const title = e.target[0].value;
        const description = e.target[1].value;
        const date = e.target[2].value;
        const author = user.id;


        fetch('/api/admin/makeSupportRequest', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json"
            },
            body: JSON.stringify(
                {
                    "title": title,
                    "description": description,
                    "date": date,
                    "author": author
                }
            )
        }).then( (res) => {
            if (res.status === 200) {
                console.log('Support Request Sent');
                alert('Support Request Sent');
                navigate('/Home');
            } else {
                throw new Error('Unknown status code returned from the server.');
            }
        }).catch( (e) => {
            console.log(e);
        })
    }


    return ( 
        <>
            <div>
            <Header />
            </div>
        
            <div className="issue-container">
            <div className='issue-header'>
                 <h1>Report Issue</h1>
            </div>

            
                <div className="issue-info">
                <form onSubmit={ sendSupportRequest }>
                    
                <h1 className='head-title'>Submit a Support request to the admin</h1>
                <div className="issue-input">
                <h1 className='title'>Title</h1>
                        <input type="text" 
                        className="inputTitle"
                        placeholder="Title" 
                        required />
                </div>
                <div className="issue-input">
                <h1 className='title'>Description</h1>
                        <textarea 
                        className="inputIssue"
                        rows="5" 
                        placeholder="Description" 
                        required>
                        </textarea>
                </div>

                    <div>
                        <input className='input-date' type="date" />
                    </div>
                    <div>
                    <button className="issue-button" type="submit">Submit</button>
                    </div>
                   
                </form>
                 </div>
            </div>
        </>
     );
}
 
export default Issue;