import { toast } from 'react-toastify';
import loginService from '../../services/login/loginService';

const Login = function () {
  const handleLogin = async () => {
    try {
      await loginService().loginWithGoogle();
    } catch (err) {
      const error: Error = err as Error;
      toast.error(error.message);
    }
  };

  return (
    <div className="login">
      <div className="login-content">
        <h1 className="title">Login required to proceed</h1>
        <button
          type="button"
          onClick={() => handleLogin()}
          className="login-button"
        >
          Click here to login
        </button>
      </div>
    </div>
  );
};

export default Login;
