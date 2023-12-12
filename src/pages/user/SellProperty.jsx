import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import AddNewProperty from "../../components/appartment-components/AddNewProperty";
import AddNewPropertyOptions from "../../components/appartment-components/AddNewPropertyOptions";
import { Route, Routes, useNavigate } from "react-router-dom";
import { NavContext } from "../../context/showNav.context";
import { UserContext } from "../../context/user.context";
import AddedProperty from "../../components/settings/AddedProperty";
import AddedPropertyEdit from "../../components/settings/AddedPropertyEdit";
import SellCampusHostel from "../../components/sell/SellCampusHostel";
import SellOffCampusHostel from "../../components/sell/SellOffCampusHostel";

// import AddNewPropertyOptions from "../../components/appartment-components/AddNewPropertyOptions";
// import SettingsNav from "../../components/settings/SettingsNav";

const SellProperty = () => {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const { topNav, settopNav, BottomNavBar, setBottomNavBar } =
    useContext(NavContext);

  useLayoutEffect(() => {
    settopNav(false);
    setBottomNavBar(true);
  }, []);

  return (
    <div>
      <Routes>
        <Route path="/" element={<AddNewPropertyOptions />} />
        <Route path="/campuhsHostel" element={<SellCampusHostel />} />
        <Route path="/offCampusHostel" element={<SellOffCampusHostel />} />
        <Route path="/offCampus" element={<AddNewProperty />} />
      </Routes>
    </div>
  );
};

export default SellProperty;
