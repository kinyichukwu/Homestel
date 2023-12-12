import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { UserProvider } from "./context/user.context.jsx";
import { BrowserRouter } from "react-router-dom";
import { NavProvider } from "./context/showNav.context.jsx";
import AddNewPropertyProvider from "./context/AddNewProperty.jsx";
import { ChatContextProvider } from "./context/chat.context.jsx";
import { ToastContainer } from "react-toastify";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ChatContextProvider>
          <NavProvider>
            <AddNewPropertyProvider>
              <App />
              <ToastContainer
                position="top-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
              />
            </AddNewPropertyProvider>
          </NavProvider>
        </ChatContextProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>
);
