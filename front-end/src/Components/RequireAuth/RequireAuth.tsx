import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";



const RequireAuth = () => {

  const { auth }: any = useAuth();


    return (auth == 2 ? <Outlet></Outlet> : <Navigate to="/login" />);
}

export default RequireAuth;
