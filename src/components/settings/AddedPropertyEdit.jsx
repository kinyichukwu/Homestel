import React, { useContext, useLayoutEffect } from "react";
import SettingsNav from "./SettingsNav";
import RoundedCheckboxGroup from "../utilities/RoundedCheckboxGroup";
import { NavContext } from "../../context/showNav.context";
import { useLocation } from "react-router-dom";

import EditSellOffCampusHostel from "./Edit/EditSellOffCampusHostel";
import EditAddNewProperty from "./Edit/EditAddNewProperty";
import EditSellCampusHostel from "./Edit/EditSellCampusHostel";

const AddedPropertyEdit = ({ propertyToEdit }) => {
  // bot nav
  const { topNav, settopNav, BottomNavBar, setBottomNavBar } =
    useContext(NavContext);

  useLayoutEffect(() => {
    settopNav(false);
    setBottomNavBar(true);
  }, []);

  const { pathname } = useLocation();

  console.log(propertyToEdit);

  return (
    <>
      {pathname.split("/")[5] === "hostel" ? (
        <EditSellCampusHostel propertyToEdit={propertyToEdit} />
      ) : pathname.split("/")[5] === "offCampusHostel" ? (
        <EditSellOffCampusHostel propertyToEdit={propertyToEdit} />
      ) : pathname.split("/")[5] === "offCampus" ? (
        <EditAddNewProperty propertyToEdit={propertyToEdit} />
      ) : (
        <></>
      )}
    </>
  );
};

export default AddedPropertyEdit;
