import { createContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

export const NavContext = createContext({
  setCurrentUser: () => null,
  currentUser: null,
  topNav: null,
  settopNav: () => null,
  BottomNavBar: null,
  setBottomNavBar: () => null,
  navText: null,
  setnavText: () => null,
});

export const NavProvider = ({ children }) => {
  const [topNav, settopNav] = useState(null);
  const [BottomNavBar, setBottomNavBar] = useState(null);

  let navInit = "Campus Dash🎿";

  const [navText, setnavText] = useState(navInit);

  const value = {
    topNav,
    settopNav,
    BottomNavBar,
    setBottomNavBar,
    navText,
    setnavText,
  };

  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
};
