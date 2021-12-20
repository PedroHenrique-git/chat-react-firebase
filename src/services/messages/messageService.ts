import {
  addDoc,
  collection,
  deleteDoc,
  DocumentData,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  QuerySnapshot,
  // eslint-disable-next-line prettier/prettier
  where
} from 'firebase/firestore';
import { v4 } from 'uuid';
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

  observerMessages(callback: (snapshot: QuerySnapshot<DocumentData>) => void) {
    const myQuery = query(
      collection(database, 'messages'),
      orderBy('created', 'asc'),
      limit(25),
    );
    const unsubscribe = onSnapshot(myQuery, callback);
    return unsubscribe;
  },

  async deleteMessage(id: string) {
    try {
      const myQuery = query(
        collection(database, 'messages'),
        where('messageId', '==', id),
      );

      const querySnapshot = await getDocs(myQuery);
      const doc = querySnapshot.docs[0].ref;

      if (!querySnapshot.empty) {
        await deleteDoc(doc);
      }
    } catch (err) {
      throw new Error('could not delete a message');
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
          uid: user?.uid,
        },
        messageId: v4(),
        message,
        created: new Date().getTime(),
      });
    } catch (err) {
      throw new Error('you hear an error when sending a message');
    }
  },
});
