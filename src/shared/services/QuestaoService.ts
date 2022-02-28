import { AxiosResponse } from 'axios';
import qs from 'query-string';
import Api from "../Api";
import { Respondida } from '../interfaces';

export default class QuestaoService {
    static async getQuestioesByAulaId(aula_id: string | number, page?: number, perPage?: number) {

        const params = qs.stringify({ page, perPage })


        const { data } = await Api.get(`aulas/${aula_id}/questoes?${params}`)

        return data;
    }

    static async getAll(page?: number, perPage?: number) {
        const params = qs.stringify({ page, perPage })
        const { data } = await Api.get(`questoes?${params}`)
        return data;
    }

    static async getComentario(questao_id: number) {
        const { data } = await Api.get(
            `comentarios/${questao_id}`
        );

        return data
    }

    static async getRespondidas(aula_id: number, questao_id: number) {
        const { data } = await Api.get(`respondidas/${aula_id}/${questao_id}`)

        return data
    }

    static async responder(questao_id: number, caderno_id: string, resposta: string): Promise<Respondida> {
        const { data } = await Api.post<any, AxiosResponse<Respondida>>('questoes/responder', {
            questao_id,
            resposta,
            caderno_id
        })

        return data;
    }

    static async deleteRespondida(id: number) {
        await Api.delete(`respondidas/${id}`);
    }

}