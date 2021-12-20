import { FormEvent, useEffect, useState } from 'react';
import { MdSend } from 'react-icons/md';
import { toast } from 'react-toastify';
import { auth } from '../../config/firebase';
import { MessageType } from '../../domain/messages/messages';
import loginService from '../../services/login/loginService';
import messageService from '../../services/messages/messageService';

const Chat = function () {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

  const handleSubmitMessage = async (e: FormEvent) => {
    e.preventDefault();

    if (message === '') {
      toast.warn('the message cannot be empty');
      return;
    }

    try {
      messageService().sendMessage(message);
      setMessage('');
    } catch (err) {
      const error: Error = err as Error;
      toast.error(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await loginService().logout();
    } catch (err) {
      const error: Error = err as Error;
      toast.error(error.message);
    }
  };

  const handleDeleteMessage = async (id: string) => {
    try {
      await messageService().deleteMessage(id);
    } catch (err) {
      const error: Error = err as Error;
      toast.error(error.message);
    }
  };

  useEffect(() => {
    const unsubscribe = messageService().observerMessages((snapshot) => {
      const data = snapshot.docs.map((msgs) => msgs.data()) as MessageType[];
      setMessages([...messages, ...data]);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().getTime());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="home">
      <div className="home-content">
        <button type="button" onClick={handleLogout} className="logout-button">
          logout
        </button>
        <div className="messages-wrap">
          {messages.map((msg) => (
            <div
              className={`message ${
                msg.user.uid === auth.currentUser?.uid
                  ? 'currentUser'
                  : 'newUser'
              }`}
              key={msg.messageId}
            >
              <p>{msg.message}</p>
              <img src={msg.user.photo} alt={msg.user.name} />
              {msg.user.uid === auth.currentUser?.uid &&
                new Date(Number(msg.created)).getTime() + 300000 >=
                  currentTime && (
                  <button
                    type="button"
                    onClick={() => handleDeleteMessage(msg.messageId)}
                    className="delete-message-btn"
                  >
                    x
                  </button>
                )}
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => handleSubmitMessage(e)}
          className="form-insert-message"
        >
          <input
            type="text"
            name="message"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Insert your message here"
            autoComplete="off"
          />
          <button type="submit">
            <MdSend size={32} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
