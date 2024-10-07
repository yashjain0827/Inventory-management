import axios from "axios";
import config from "../config/config";
const loginuser = JSON.parse(localStorage.getItem("loginuser"));

export const fetchLogin = async (loginbody) => {
  try {
    const response = await axios.post(
      `${config.baseUrl}${config.apiEndPoint.login}`,
      loginbody
    );

    return response;
  } catch (error) {
    throw error;
  }
};
export const fetchSignup = async (signupbody) => {
  try {
    const response = await axios.post(
      `${config.baseUrl}${config.apiEndPoint.sigup}`,
      signupbody
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
export const fetchallproducts = async (url, header) => {
  console.log(header);
  try {
    const response = await axios.get(url, header);
    return response;
  } catch (error) {
    throw error;
  }
};
export const addnewproduct = async (url, payload, header) => {
  try {
    const response = await axios.post(url, payload, header);
    return response;
  } catch (error) {
    throw error;
  }
};
export const fetchallbill = async (url, header) => {
  try {
    const response = await axios.get(url, header);
    return response;
  } catch (error) {
    throw error;
  }
};
export const addnewbill = async (url, payload, header) => {
  try {
    const response = await axios.post(url, payload, header);
    return response;
  } catch (error) {
    throw error;
  }
};
