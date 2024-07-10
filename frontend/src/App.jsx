// App.jsx
import { useContext, useEffect } from 'react';
import './App.css';
import LandingPage from './components/LandingPage/LandingPage.jsx';
import { UserContext } from './context/userContext.jsx';

function App() {
  return (
    <>
      <div>
        <LandingPage />
      </div>
    </>
  );
}

export default App;
