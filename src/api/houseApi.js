import axios from "axios";

export const getHouses = async () => {
  const res = await axios.get("http://localhost:5000/api/house", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  return res.data;
};
