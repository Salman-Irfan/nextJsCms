import APIV from "@/constants/client/apiv/apiv"
import BASE_URL from "@/constants/client/baseUrl/baseUrl"
import endPoints from "@/constants/client/endPoints/endPoints"
import axios from "axios"

const getPageContentService = async (slugName:string) => {
    const response = await axios.get(`${BASE_URL}${APIV}${endPoints.GET_PAGE_CONTENT}/${slugName}`)
    return response
}
export default getPageContentService