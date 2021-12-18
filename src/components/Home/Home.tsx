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
    <>
      <button type="button" onClick={handleLogout}>
        logout
      </button>
      <form onSubmit={(e) => handleSubmitMessage(e)}>
        <label htmlFor="message">
          Digite sua mensagem:
          <input
            type="text"
            name="message"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>
        <button type="submit">Enviar</button>
      </form>
      <ul>
        {messages.map((msg) => (
          <li>{msg.message}</li>
        ))}
      </ul>
    </>
  );
};

export default Home;
