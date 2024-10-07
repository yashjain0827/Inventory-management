import { fetchallbill } from "../services/user.service";
import { addnewbill } from "../services/user.service";
import config from "../config/config";

const getOptions = () => {
  const loginData = JSON.parse(localStorage.getItem("loginuser"));
  const token = loginData?.jwtToken || "";
  const id = loginData?.adminId || "";

  const headers = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  return { headers, id };
};

export const getallbill = async (searchQuery, page, rowsPerPage, date) => {
  try {
    const url = `${config.baseUrl}${config.apiEndPoint.allbill}?adminId=${
      getOptions().id
    }&search=${searchQuery}&page=${page}&size=${rowsPerPage}&date=${date}`;

    const allbills = await fetchallbill(url, getOptions().headers);
    return allbills;
  } catch (error) {
    console.error("Error while login", error);
    throw error;
  }
};

export const addbill = async (payload) => {
  try {
    const url = `${config.baseUrl}${config.apiEndPoint.addbill}`;
    const response = await addnewbill(url, payload, getOptions().headers);
    return response;
  } catch (error) {
    console.error("Error while login", error);
    throw error;
  }
};
