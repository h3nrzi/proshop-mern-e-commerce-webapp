import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store";

const AdminLayout = () => {
  const userInfo = useSelector((s: RootState) => s.auth.userInfo);

  return userInfo!.isAdmin ? <Outlet /> : <Navigate to="/login?isAdmin=true" replace />;
};

export default AdminLayout;
