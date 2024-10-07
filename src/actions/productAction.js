import { fetchallproducts } from "../services/user.service";
import { addnewproduct } from "../services/user.service";
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

export const getallproduct = async () => {
  try {
    const url = `${config.baseUrl}${config.apiEndPoint.allproduct}?adminId=${
      getOptions().id
    }`;

    const response = await fetchallproducts(url, getOptions().headers);

    return response;
  } catch (error) {
    console.error("Error while login", error);
    throw error;
  }
};
export const addproduct = async (payload) => {
  try {
    const url = `${config.baseUrl}${config.apiEndPoint.addproduct}`;

    const allproduct = await addnewproduct(url, payload, getOptions().headers);

    return allproduct;
  } catch (error) {
    console.error("Error while login", error);
    throw error;
  }
};
