import { addDoc, collection, getDocs } from 'firebase/firestore';
import { auth, database } from '../../config/firebase';
import { MessageType } from '../../domain/messages/messages';

export default () => ({
  async getMessages(): Promise<MessageType[]> {
    try {
      const messages: MessageType[] = [];
      const querySnapshot = await getDocs(collection(database, 'messages'));
      querySnapshot.forEach((message) =>
        messages.push(message.data() as MessageType),
      );
      return messages;
    } catch (err) {
      throw new Error('there was an error retrieving the messages');
    }
  },

  async sendMessage(message: string) {
    try {
      const user = auth.currentUser;
      await addDoc(collection(database, 'messages'), {
        user: {
          name: user?.displayName,
          email: user?.email,
          photo: user?.photoURL,
        },
        message,
        created: new Date().getTime(),
      });
    } catch (err) {
      throw new Error('you hear an error when sending a message');
    }
  },
});
