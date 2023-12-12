import crossPic from "../../assets/crossImage.png";

export default function NoBooked({ text, extraText }) {
  return (
    <div className=" flex items-center justify-center flex-col w-[80%] ml-[20%] max-md:w-full max-md:ml-0 p-5">
      <div className="mt-8 md:mt-20 ">
        {/* <AiOutlineArrowLeft className="text-2xl ml-2" /> */}
        <h2 className="text-2xl text-center md:mt-8 md:text-3xl">
          {text.length > 0 ? "" : "Booked"}
        </h2>
      </div>
      <div className="flex flex-col items-center mt-16">
        <img src={crossPic} alt="An Image" />
        <p className="w-40 mt-10 text-center  md:w-96 md:text-2xl ">
          {text || "Hey there! You have no booked property yet"}
        </p>
        <p className="w-40 mt-10 text-center  md:w-96 md:text-xl opacity-40">
          {extraText || ""}
        </p>
      </div>
    </div>
  );
}
