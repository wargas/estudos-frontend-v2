import questystring from 'query-string'
import Api from '../Api'
import { Disciplina } from '../interfaces'

export default class DisciplinaService {
    static async getDisciplinaById(id: number | string, options: any = {}): Promise<Disciplina> {
        const qs = questystring.stringify(options)
        const { data } = await Api.get(`disciplinas/${id}?${qs}`)

        return data;
    }
}