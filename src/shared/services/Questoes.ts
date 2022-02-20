import { Questao } from "../interfaces";

export class QuestoesService  {
    static async  getAll(): Promise<Questao[]> {
        return []
    }
    static async getById(): Promise<Questao> {
        return {} as Questao
    }
    static async getByDisciplina(): Promise<Questao[]> {
        return []
    }
}