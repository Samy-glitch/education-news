import Chat from "@/components/message/Chat";
import Slider from "@/components/message/Slider";

const Message = () => {
  return (
    <div>
      <div className="message-layout">
        <Slider />
        <Chat />
      </div>
    </div>
  );
};

export default Message;
