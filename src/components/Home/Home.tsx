import { FormEvent, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { MessageType } from '../../domain/messages/messages';
import loginService from '../../services/login/loginService';
import messageService from '../../services/messages/messageService';

const Home = function () {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MessageType[]>([]);

  const handleSubmitMessage = async (e: FormEvent) => {
    e.preventDefault();

    try {
      messageService().sendMessage(message);
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

  useEffect(() => {
    const getMessages = async () => {
      const receivedMessages = await messageService().getMessages();
      setMessages(receivedMessages);
    };

    getMessages();
  }, []);

  return (
    <div className="home">
      <div className="home-content">
        <button type="button" onClick={handleLogout} className="logout-button">
          logout
        </button>
        <div className="messages-wrap" />
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
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Home;
