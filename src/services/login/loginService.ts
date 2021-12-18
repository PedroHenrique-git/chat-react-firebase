import {
  GoogleAuthProvider,
  NextOrObserver,
  signInWithPopup,
  signOut,
  // eslint-disable-next-line prettier/prettier
  User
} from 'firebase/auth';
import { auth } from '../../config/firebase';

type LoginError = { code: number; email: string; message: string };

export default () => ({
  isLogged() {
    const { currentUser } = auth;
    return !!currentUser;
  },

  ObserveUser(callback: NextOrObserver<User | null>) {
    auth.onAuthStateChanged(callback);
  },

  async logout() {
    try {
      await signOut(auth);
    } catch (e) {
      throw new Error('error when logging out');
    }
  },

  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential?.accessToken;
      const user = result?.user;

      return {
        token,
        user,
      };
    } catch (err) {
      const error: LoginError = err as LoginError;
      throw new Error(
        `Error, message: ${error.message}, email: ${error.email}, code: ${error.code}`,
      );
    }
  },
});
