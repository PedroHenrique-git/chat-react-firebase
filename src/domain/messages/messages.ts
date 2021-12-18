export type MessageType = {
  message: string;
  created: number;
  user: {
    email: string;
    name: string;
    photo: string;
  };
};
