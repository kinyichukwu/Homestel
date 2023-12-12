import { useNavigate } from "react-router-dom";
import SettingsNav from "../settings/SettingsNav";

const AddNewPropertyOptions = () => {
  const navigate = useNavigate();

  return (
    <>
      <SettingsNav title="Add New Property" />
      <div className="isolate  px-6 py-3 lg:px-8 settings-input">
        <div className="mx-auto mt-3 max-w-xl sm:mt-4 ">
          <div
            className="mt-4 flex px-4 py-2 rounded-2xl shadow-sm profile-white-color  hover:opacity-70 active:opacity-100 items-center"
            onClick={() => navigate("campuhsHostel")}
          >
            <button className="block w-full py-2.5 text-center text-sm color-p  focus:scale-103">
              Campus Hostel ( Squat/ Bed space )
            </button>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
            >
              <path
                d="M28.8 14.4211H24.4V12.2105C24.4 10.9837 23.421 10 22.2 10H17.8C16.579 10 15.6 10.9837 15.6 12.2105V14.4211H11.2C9.979 14.4211 9.011 15.4047 9.011 16.6316L9 28.7895C9 30.0163 9.979 31 11.2 31H28.8C30.021 31 31 30.0163 31 28.7895V16.6316C31 15.4047 30.021 14.4211 28.8 14.4211ZM22.2 14.4211H17.8V12.2105H22.2V14.4211Z"
                fill="#54007B"
              />
            </svg>
          </div>

          <div
            className="mt-4 flex px-4 py-2 rounded-2xl shadow-sm profile-white-color   hover:opacity-70 active:opacity-100 items-center"
            onClick={() => navigate("offCampusHostel")}
          >
            <button className="block w-full py-2.5 text-center text-sm color-p  focus:scale-103 ">
            Off Campus Hostel 
            </button>

            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="16"
              viewBox="0 0 30 16"
              fill="none"
            >
              <path
                d="M25.1667 4.16675H0.666748V5.91675H25.1667V4.16675Z"
                fill="#54007B"
              />
              <path
                d="M26.9167 7.66675H0.666748V15.8334H29.2501V0.666748H26.9167V7.66675Z"
                fill="#54007B"
              />
            </svg>
          </div>

          <div className=" flex items-center mt-4">
            <div className="bg-black opacity-20 h-[1px] w-full mr-3"></div>
            <span className="text-black opacity-20 text-[1.2rem]">or</span>
            <div className="bg-black opacity-20 h-[1px] w-full ml-3"></div>
          </div>

      

          <div
            className="mt-4 flex bg-color-p  hover:opacity-70 active:opacity-100 px-4 py-2 rounded-2xl items-center"
            onClick={() => navigate("offCampus")}
          >
            <button className="block w-full  text-center text-sm text-white shadow-sm focus:scale-103 p-4">
              Off Campus Apartment
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddNewPropertyOptions;
