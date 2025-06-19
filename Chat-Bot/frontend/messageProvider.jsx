import { createContext, useContext, useState } from "react";

const MessageContext = createContext();

const MessageProvider = ({ children }) => {
  const [allMessages, setAllMessages] = useState([
    { role: "system", message: "Hello! What can I help you with?" },
  ]);

  return (
    <MessageContext.Provider value={{ allMessages, setAllMessages }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessageState = () => {
  return useContext(MessageContext);
};

export default MessageProvider;
