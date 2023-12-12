import { useLocation, Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";


const RequireAuth = (props:any) => {
    console.log("require"); 

    // const { auth } = useAuth();

    const location = useLocation();
    useEffect(() => {
        console.log("_______________");
        console.log(props.auth);
        console.log("_______________");
      }, []);

    return (props.auth ? <Outlet></Outlet> : <Navigate to="/login" state={{ from: location }} replace />);
}

export default RequireAuth;
