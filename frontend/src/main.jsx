import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { UserProvider } from './context/userContext.jsx'


import App from './App.jsx'
import './index.css'
import SignUp from './components/SignUp/SignUp.jsx'
import LoginForm from '../src/components/LoginForm/LoginForm.jsx'
import Home from './components/Home/Home.jsx'
import Forum from './components/Forum/Forum.jsx'
import Account from './components/Account/Account.jsx'
import Contact from './components/Contact/Contact.jsx'
import Documents from './components/Documents/Documents.jsx'
import FileUploadForm from './components/Documents/FileUploadForm.jsx'
import Programs from './components/Programs/Programs.jsx'
import CreatePost from './components/Forum/CreatePost.jsx' 
import ReplyPost from './components/Forum/replyPost.jsx'
import EditAccount from './components/Account/EditAccount.jsx'
import LandingPage from './components/LandingPage/LandingPage.jsx'
import Admin from './components/Admin/Admin.jsx'
import SearchResults from './components/SearchResults/SearchResults.jsx'
import LeaveRequest from './components/LeaveRequest/LeaveRequest.jsx'
import Issue from './components/Issue/Issue.jsx'
import SelectEmployee from './components/HR/SelectEmployee.jsx'
import SelectEmployeePayslip from './components/HR/SelectEmployeePayslip.jsx'
import SendPayslip from './components/HR/SendPayslip.jsx'
import EditEmployee from './components/HR/EditEmployee.jsx'
import Training from './components/Training/Training.jsx'
import HRDashboard from './components/HR/HRDashboard.jsx'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <div>404 not found</div>,
  },
  {
    path: '/SignUp',
    element: <SignUp />,
  },
  {
    path: '/LoginForm',
    element: <LoginForm />,
  },
  {
    path: '/Home',
    element: <Home />,
  },
  {
    path: '/Forum',
    element: <Forum />,
  },
  {
    path: '/Account',
    element: <Account />,
  },
  {
    path: '/Contact',
    element: <Contact />,
  },
  {
    path: '/Documents',
    element: <Documents />,
  },
  {
    path: '/FileUploadForm',
    element: <FileUploadForm />,
  },
  {
    path: '/Programs',
    element: <Programs />,
  },
  {
    path: '/CreatePost',
    element: <CreatePost />,
  },
  {
    path: '/replyPost/:blogId',
    element: <ReplyPost />,
  },
  {
    path: '/EditAccount',
    element: <EditAccount />,
  },
  {
    path: '/LandingPage',
    element: <LandingPage />,
  },
  {
    path: '/Admin',
    element: <Admin />,
  },
  {
    path: '/SearchResults',
    element: <SearchResults />,
  },
  {
    path: '/LeaveRequest',
    element: <LeaveRequest/>,
  },
  {
    path: '/Issue',
    element: <Issue />,
  },
  {
    path: '/Training',
    element: <Training />
  },
  {
    path: '/SelectEmployee',
    element: <SelectEmployee />,
  },
  {
  path: '/SelectEmployeePayslip',
  element: <SelectEmployeePayslip />,
  },
  {
    path: '/SendPayslip',
    element: <SendPayslip />,
  },
  {
    path: '/EditEmployee',
    element: <EditEmployee />,
  },
  {
    path: '/HRDashboard',
    element: <HRDashboard />,
  }
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>,
)
