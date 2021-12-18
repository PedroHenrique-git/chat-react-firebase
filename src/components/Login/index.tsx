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
    <div>
      <h1>Login</h1>
      <button type="button" onClick={() => handleLogin()}>
        click here
      </button>
    </div>
  );
};

export default Login;
