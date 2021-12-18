import { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './components/Home/Home';
import Login from './components/Login';
import loginService from './services/login/loginService';

const App = function () {
  const [isLogged, setIsLogged] = useState(loginService().isLogged());

  loginService().ObserveUser((user) => setIsLogged(!!user));

  return (
    <>
      {isLogged ? <Home /> : <Login />}
      <ToastContainer />
    </>
  );
};

export default App;
