import { createContext, useState, useEffect } from "react";
import {
  onAuthStateChangedListener,
  createUserDocumentFromAuth,
  db,
} from "../utils/firebase/firebase.utils";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";

export const UserContext = createContext({
  setCurrentUser: () => null,
  currentUser: null,
});

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const value = { currentUser, setCurrentUser };
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener(async (user) => {
      if (user) {
        const navigateToProfile = async () => {
          const userDocRef = doc(db, "users", user.uid);
          const userSnapshot = await getDoc(userDocRef);

          if (!userSnapshot.exists()) {
            navigate("/user/settings/personalInfo");
          }
        };

        localStorage.setItem('currentUser', JSON.stringify(user));

        navigateToProfile();
      } else {
        localStorage.removeItem('currentUser');
      }
      setCurrentUser(user);
    });

    return unsubscribe;
  }, [navigate]);

  return (
    <UserContext.Provider value={value}>{children}</UserContext.Provider>
  );
};
