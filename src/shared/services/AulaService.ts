import Api from "../Api";

export default class AulaService {

    static async getAulaById(id: number | string) {
        const { data } = await Api.get(`aulas/${id}`)

        return data;
    }

}