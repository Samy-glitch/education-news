import { DotsVerticalIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

const Chat = () => {
  return (
    <div className="flex-col flex-[3] relative hidden md:flex">
      <div className="p-4 border-b bg-primary-foreground/80 flex items-center justify-between max-h-[61px] relative">
        <span className="text-lg font-bold transition-transform">
          Chat room
        </span>
        <Button variant="ghost">
          <DotsVerticalIcon />
        </Button>
      </div>
      <div className="w-full h-full flex items-center justify-center">
        <p className="text-muted-foreground text-sm">
          Select a user to start messaging.
        </p>
      </div>
    </div>
  );
};

export default Chat;
