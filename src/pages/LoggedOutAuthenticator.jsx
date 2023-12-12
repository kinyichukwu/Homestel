import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";

const LoggedOutAuthenticator = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const path = useLocation();

  useEffect(() => {
    if (!currentUser && path.pathname !== "/") {
      navigate("/auth/login");
    } else if (currentUser && path.pathname == "/") {
      navigate("/user/hostels");
    }
  }, [currentUser, navigate]);

  return (
    <div className="">
      <Outlet />
    </div>
  );
};

export default LoggedOutAuthenticator;
