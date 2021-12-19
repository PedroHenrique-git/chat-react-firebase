export type MessageType = {
  message: string;
  created: number;
  messageId: string;
  user: {
    email: string;
    name: string;
    photo: string;
    uid: string;
  };
};
