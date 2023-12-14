import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";


const RequireAuth = () => {

  const { auth } = useAuth();
  console.log("require"); 

    const location = useLocation();
    useEffect(() => {
        console.log("_______________");
        console.log(auth);
        console.log("_______________");
      }, []);

    return (auth == 2 ? <Outlet></Outlet> : <Navigate to="/login" state={{ from: location }} replace />);
}

export default RequireAuth;
