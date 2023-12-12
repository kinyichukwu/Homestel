import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Hostels from "./pages/user/Hostels";
import Setting from "./pages/user/Setting";
import NavBar from "./components/NavBar";
import BottomNavBar from "./components/BottomNavBar";
import LoggedInAuthenticator from "./pages/LoggedInAuthenticator";
import Booked from "./pages/user/Booked";
import Apartment from "./pages/user/Apartment";
import Messages from "./pages/user/Messages";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import SellProperty from "./pages/user/SellProperty";
import AddNewProperty from "./components/appartment-components/AddNewProperty";
import Description from "./pages/user/Description";
import HostelDescription from "./pages/user/HostelDescription";
import LoggedOutAuthenticator from "./pages/LoggedOutAuthenticator";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoggedOutAuthenticator />}>
          <Route index element={<Apartment />} />
          <Route path="auth" element={<Navigate to={"/auth/login"} />} />
          <Route path="auth/login" element={<Login />} />
          <Route path="auth/register" element={<Register />} />
        </Route>

        <Route path="user" element={<LoggedInAuthenticator />}>
          <Route index path="hostels" element={<Hostels />} />
          <Route path="book" element={<Booked />} />
          <Route path="apartment" element={<Apartment />} />
          <Route path="messages/*" element={<Messages />} />
          <Route path="sell/*" element={<SellProperty />} />
          <Route path="apartment/description/*" element={<Description />} />
          <Route path="hostels/description/*" element={<HostelDescription />} />
          <Route path="settings/*" element={<Setting />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
