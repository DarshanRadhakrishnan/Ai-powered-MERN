import BotDisplay from "../src/botDisplay";
import MessageProvider from "../src/messageProvider";

function App() {
  return (
    <MessageProvider>
      <BotDisplay />
    </MessageProvider>
  );
}

export default App;
