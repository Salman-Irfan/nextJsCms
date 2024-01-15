import APIV from "@/constants/client/apiv/apiv";
import BASE_URL from "@/constants/client/baseUrl/baseUrl";
import axios from "axios";

const postFormService = async (endPoint: string,formData: any) => {
	const response = await axios.post(
		`${BASE_URL}${APIV}${endPoint}`,
		formData
	);
	return response;
};
export default postFormService;
