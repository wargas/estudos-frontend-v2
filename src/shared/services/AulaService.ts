import querystring from 'query-string';
import Api from "../Api";
import { Aula } from "../interfaces";

export default class AulaService {

    static async getAulaById(id: number | string, options: any = {}) {

        const qs = querystring.stringify(options)

        const { data } = await Api.get(`aulas/${id}?${qs}`)

        return data;
    }

    static async getAulasByDisciplina(id: number | undefined, options: any = {}): Promise<Aula[]> {

        const qs = querystring.stringify(options)

        const { data } = await Api.get(`disciplinas/${id}/aulas?${qs}`)

        return data
    }

}