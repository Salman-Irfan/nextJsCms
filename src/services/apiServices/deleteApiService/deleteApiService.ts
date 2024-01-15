import APIV from "@/constants/client/apiv/apiv";
import BASE_URL from "@/constants/client/baseUrl/baseUrl";
import axios from "axios";

const deleteApiService = async (endPoint: string) => {
	const response = await axios.delete(`${BASE_URL}${APIV}${endPoint}`);
	return response;
};
export default deleteApiService;
