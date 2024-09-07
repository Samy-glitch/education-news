import BottomBar from "@/components/shared/BottomBar";
import LeftSideBar from "@/components/shared/LeftSideBar";
import TopBar from "@/components/shared/TopBar";
import { useIsPWAInstalled } from "@/lib/utils";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="flex min-h-screen w-full flex-col">
      <TopBar />

      <div className="flex-1 p-2 md:p-6 custom-scrollbar" id="scrollDiv">
        <LeftSideBar />

        <main
          className={`md:ml-60 flex-1 md:p-6 mb-14 md:mb-0 ${
            !useIsPWAInstalled() && "mb-[112px]"
          }`}
        >
          <Outlet />
        </main>
      </div>
      <BottomBar />
    </div>
  );
};

export default RootLayout;
