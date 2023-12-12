import { useContext, useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { UserContext } from "../context/user.context";
import AIBot from "../components/AIBot";
import NavBar from "../components/NavBar";
import BottomNavBar from "../components/BottomNavBar";

const LoggedInAuthenticator = () => {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const path = useLocation();
  useEffect(() => {
    if (!currentUser) {
      navigate("/auth/login");
    } else if (currentUser && path.pathname == "/user") {
      navigate("/user/hostels");
    }
  }, [currentUser, navigate]);

  return (
    <div className="">
      <NavBar />
      <Outlet />
      <AIBot />
      <BottomNavBar />
    </div>
  );
};

export default LoggedInAuthenticator;
