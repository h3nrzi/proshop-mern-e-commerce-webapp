import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../store";

const PrivateLayout = () => {
  const userInfo = useSelector((s: RootState) => s.auth.userInfo);

  return userInfo ? <Outlet /> : <Navigate to="/login?isprivate=true" replace />;
};

export default PrivateLayout;
