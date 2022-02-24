import axios from "axios";

const Api = axios.create({
    // baseURL: 'https://app-estudos.herokuapp.com/api'
    baseURL: 'http://localhost:3333/api'
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

