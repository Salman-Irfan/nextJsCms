import APIV from "@/constants/client/apiv/apiv"
import BASE_URL from "@/constants/client/baseUrl/baseUrl"
import axios from "axios"

const getApiService = async (endPoint: string) => {
    const response = await axios.get(`${BASE_URL}${APIV}${endPoint}`)
    return response
}
export default getApiService