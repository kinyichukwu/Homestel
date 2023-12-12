import "./styles.scss";
import SignUpLogo from "../../assets/onboarding/welcome.svg";
import { useNavigate } from "react-router";
import { db, signInWithGooglePopup } from "../../utils/firebase/firebase.utils";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/user.context";
import { NavContext } from "../../context/showNav.context";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const { currentUser, setCurrentUser } = useContext(UserContext);

  const { topNav, settopNav, BottomNavBar, setBottomNavBar } =
    useContext(NavContext);

  useEffect(() => {
    settopNav(false);
    setBottomNavBar(false);
  }, []);

  const signInWithGoogle = async () => {
    setloading(true);
    try {
      const { user } = await signInWithGooglePopup();
      // creating chat collection for each seller
      const res = await getDoc(doc(db, "userChats", user.uid));
      if (!res.exists()) {
        await setDoc(doc(db, "userChats", user.uid), {});
        await setDoc(doc(db, "aichats", user.uid), { messages: [] });
      }
      setCurrentUser(user);
      console.log(user);
      toast.success("Welcome");
      navigate("/user/apartment");
    } catch (err) {
      console.error(err);
      toast.error("An error has occured");
    } finally {
      setloading(false);
    }
  };

  return (
    <div className="login flex h-screen  flex-col items-center py-5 my-4 justify-center ">
      {loading ? (
        <ClipLoader size={60} />
      ) : (
        <>
          <div className="text-center welcome mb-14">
            <h2 className="text-[2rem] font-extrabold">Welcome</h2>
            <p className="text-[0.9375rem] font-normal">
              Connect and make deals
            </p>
          </div>
          <img
            src={SignUpLogo}
            alt="Sign Up Logo"
            className="mb-14 h-[13rem] w-[13rem]"
          />

          <div>
            <div
              className="flex items-center  justify-center gap-8 p-4 login-btns-btn w-80 my-2 cursor-pointer"
              onClick={signInWithGoogle}
            >
              <p className=" text-sm font-medium mx-auto">
                Sign up with Google
              </p>
              <div className="w-6 h-6 rounded-full bg-color-p  inline"></div>
            </div>

            <div className="flex items-center  justify-center mt-14">
              <p className="text-[0.9rem] font-normal ">
                Already registered?{" "}
                <a
                  className="color-p font-bold"
                  onClick={() => navigate("/auth/login")}
                  style={{ cursor: "pointer" }}
                >
                  Log in
                </a>
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Register;
