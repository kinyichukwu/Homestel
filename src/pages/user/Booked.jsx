import { BiDollar, BiSolidBookmarkAlt } from "react-icons/bi";
import SettingsNav from "../../components/settings/SettingsNav";
import { useContext, useEffect, useLayoutEffect, useState } from "react";
import { NavContext } from "../../context/showNav.context";
import NoBooked from "../../components/booked-components/NoBooked";

const Booked = () => {
  const { topNav, settopNav, BottomNavBar, setBottomNavBar } =
    useContext(NavContext);

  useLayoutEffect(() => {
    settopNav(false);
    setBottomNavBar(true);
  }, []);

  const [booked, setbooked] = useState(false);

  return (
    <section>
      <SettingsNav title="Booked" />

      <section className="flex max-md:flex-col mb-[14rem] lg:mb-0">
        <div className="hidden md:block w-[20%] h-screen max-md:w-full max-md:relative  max-md:h-fit fixed p-5 max-md:p-0 py-4 bg-[#54007B]/[3%]">
          <div className="mb-10 max-md:mb-0 max-md:flex max-md:items-center">
            <p className="font-semibold text-[15px] mb-4 max-md:hidden">
              Filter
            </p>

            <p className="bg-[#54007B]/10 hover:bg-[#54007B]/10 max-md:text-white max-md:bg-[#A445D1] max-md:w-[50%]  cursor-pointer rounded-md p-3 mb-2 max-md:rounded-none text-[#1a0623] max-md:text-center text-[.8rem]">
              Male Hostel
            </p>

            <p className=" max-md:w-[50%] hover:bg-[#54007B]/10  text-[#1a0623] cursor-pointer rounded-md p-3 mb-2 max-md:text-center max-md:rounded-none text-[.8rem]">
              Apartment
            </p>

            <p className=" max-md:w-[50%] hover:bg-[#54007B]/10  text-[#1a0623] cursor-pointer rounded-md p-3 mb-2 max-md:text-center max-md:rounded-none text-[.8rem]">
              Female Hostel
            </p>
          </div>
          {false && (
            <div className="max-md:p-2 max-md:flex max-md:items-center">
              <p className="font-semibold text-[15px] mb-4 max-md:hidden">
                Spaces
              </p>
            
              <p className="bg-[#1a0623] max-md:w-[50%] text-white cursor-pointer rounded-md p-3 mb-2 max-md:text-center max-md:rounded-full">
                Bed spaces
              </p>
            </div>
          )}
        </div>

        {booked ? (
          <div className="w-[80%] ml-[20%] max-md:w-full max-md:ml-0 p-5">
            <h3 className="text-xl font-bold flex items-center gap-x-2">
              Booked{" "}
              <span className="font-medium text-[16px]">&gt; Bed Spaces</span>{" "}
            </h3>
            <div className="grid grid-cols-3 max-md:grid-cols-1 gap-5 my-5">
              {/**booked card */}
              <div className="bg-[#f6f6f6] p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold">JAJA HALL</p>
                    <p className="text-sm opacity-70">Buy Bed Space</p>
                  </div>
                  <div>
                    <p className="text-sm opacity-60">
                      Room no.: <span className="opacity-[100%]">G107</span>
                    </p>
                    <p className="font-semibold text-sm">4 Man Room</p>
                  </div>
                </div>

                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-[#54007B] font-bold text-xl ">
                    N 70,000
                  </h3>
                  <p className=" text-[0.5rem] opacity-70 text-[#FF1010] my-auto font-semibold">
                    11 others have booked
                  </p>
                </div>

                <div className="flex items-center gap-x-3">
                  <button className="flex bg-[#54007B] w-[50%] text-white p-3 rounded-2xl items-center justify-center gap-x-1 text-sm">
                    <BiDollar size={16} />
                    <p className="text-xs">View Contact</p>
                  </button>
                  <button className="flex w-[50%] p-3 rounded-2xl items-center justify-center gap-x-1 border-[1px] border-[#54007B] bg-transparent text-[#54007B] text-sm">
                    <BiSolidBookmarkAlt size={16} />
                    <p className="text-xs">Unbook</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <NoBooked text="" extraText="Click on home and book now 😄" />
        )}
      </section>
    </section>
  );
};

export default Booked;
