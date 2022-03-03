import Api from "../Api";
import { Caderno } from "../interfaces";

class CadernoService {
    static async getByDisciplina(aula_id: number | string): Promise<Caderno[]> {
        const {data} = await Api.get(`aulas/${aula_id}/cadernos`)
        
        return data
    }

    static async getById(caderno_id: string): Promise<Caderno> {
        const { data } = await Api(`cadernos/${caderno_id}`)

        return data
    }

    static async create(aula_id: number | string):Promise<Caderno> {
        const { data } = await Api.post(`aulas/${aula_id}/cadernos`)

        return data
    }
}

export default CadernoService