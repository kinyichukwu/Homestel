import placement from "../assets/couch.png";
import Apartment from "../pages/user/Apartment";

const DUMMY_DATA = [
  {
    id: "m1",
    img: placement,
    title: "4 Man Room, Opposite Chemist",
  },
  {
    id: "m2",
    img: placement,
    title: "4 Man Room, Opposite Chemist",
  },
  {
    id: "m3",
    img: placement,
    title: "4 Man Room, Opposite Chemist",
  },
  {
    id: "m4",
    img: placement,
    title: "4 Man Room, Opposite Chemist",
  }
];

const HostelData = () => {
  return (
    <>
      {DUMMY_DATA.map((hostel) => (
        <Apartment key={hostel.id} img={hostel.img} title={hostel.title} />
      ))}
    </>
  );
};

export default HostelData;
