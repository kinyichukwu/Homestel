import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { db } from "../utils/firebase/firebase.utils";

const AddNewPropertyContext = createContext();

export const useAddNewProperty = () => {
  return useContext(AddNewPropertyContext);
};

const AddNewPropertyProvider = ({ children }) => {
  const navigate = useNavigate();
  const [adding, setAdding] = useState(false);

  const addProperty = async (data) => {
    try {
      setAdding(true);
      const colRef = await collection(db, "property");
      await addDoc(colRef, {
        ...data,
      })
        .then(async () => {
          setAdding(false);
          toast.success("Property Added Successfully");
          navigate("/");
        })
        .catch((e) => {
          setAdding(false);
          toast.error("An error occured");
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const addHostel = async (data) => {
    try {
      setAdding(true);
      const colRef = await collection(db, "hostel");
      await addDoc(colRef, {
        ...data,
      })
        .then(async () => {
          setAdding(false);
          toast.success("hostel Added Successfully");
          navigate("/");
        })
        .catch((e) => {
          setAdding(false);
          toast.error("An error occured");
          console.log(e);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const editHostel = async (data, id, userID) => {
    try {
      setAdding(true);
      const colRef = await doc(db, "hostel", id);

      if (data?.sellersID !== userID) {
        toast.error("You are not authorized to edit this property 🙄");
        return;
      } else {
        await updateDoc(colRef, {
          ...data,
        })
          .then(async () => {
            setAdding(false);
            toast.success("hostel Updated Successfully");
            navigate("/");
          })
          .catch((e) => {
            setAdding(false);
            toast.error("An error occured");
            console.log(e);
          });

        toast.success("Edited Successfully 😁");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const editProperty = async (data, id, userID) => {
    try {
      setAdding(true);
      const colRef = await doc(db, "property", id);

      if (data?.sellersID !== userID) {
        toast.error("You are not authorized to edit this property 🙄");
        return;
      } else {
        await updateDoc(colRef, {
          ...data,
        })
          .then(async () => {
            setAdding(false);
            toast.success("Property Updated Successfully");
            navigate("/");
          })
          .catch((e) => {
            setAdding(false);
            toast.error("An error occured");
            console.log(e);
          });

        toast.success("Edited Successfully 😁");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const value = {
    addProperty,
    addHostel,
    adding,
    editHostel,
    editProperty,
  };
  return (
    <AddNewPropertyContext.Provider value={value}>
      {children}
    </AddNewPropertyContext.Provider>
  );
};

export default AddNewPropertyProvider;
