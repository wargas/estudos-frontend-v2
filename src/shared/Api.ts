import axios from "axios";

const Api = axios.create({
    baseURL: process.env.REACT_APP_API_URL
})


async function fetcher<T>(url: string): Promise<T> {
    try {
        const {data} = await Api.get(url)

        return data
    } catch (error) {        
        throw(error)
    }
}

export default Api
export { fetcher };

