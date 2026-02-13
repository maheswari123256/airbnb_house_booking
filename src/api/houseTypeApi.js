import axios from "axios";

export const getHouseTypes = async () => {
  const res = await axios.get("/api/admin/house-types", {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });
  return res.data;
};
