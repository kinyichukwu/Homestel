import { useContext, useEffect, useState } from "react";
import SettingsInput from "../../components/settings/Input";
import "./setting.scss";
import SettingsPersonalInfo from "../../components/settings/SettingsPersonalInfo";
import SettingsOptions from "../../components/settings/SettingsOptions";
import AddedProperty from "../../components/settings/AddedProperty";
import AddedPropertyEdit from "../../components/settings/AddedPropertyEdit";
import { Route, Routes } from "react-router-dom";
import AddedPropertyPromote from "../../components/settings/AddedPropertyPromote";

export default function Setting() {
  const [propertyToEdit, setpropertyToEdit] = useState(null);
  return (
    <>
      <Routes>
        <Route path="/" element={<SettingsOptions />} />
        <Route path="/personalInfo" element={<SettingsPersonalInfo />} />
        <Route
          path="/addedproperty"
          element={<AddedProperty setEdit={setpropertyToEdit} />}
        />
        <Route
          path="/addedproperty/edit/*"
          element={<AddedPropertyEdit propertyToEdit={propertyToEdit} />}
        />
        <Route
          path="/addedproperty/promote/*"
          element={<AddedPropertyPromote propertyToPromote={propertyToEdit} />}
        />
      </Routes>
    </>
  );
}
