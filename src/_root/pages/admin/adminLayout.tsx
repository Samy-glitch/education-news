import { useUserContext } from "@/context/authContext";
import { Outlet, Navigate } from "react-router-dom";

const AdminLayout = () => {
  const { user } = useUserContext();

  return <>{!user.isAadmin ? <Navigate to="/home" /> : <Outlet />}</>;
};

export default AdminLayout;
