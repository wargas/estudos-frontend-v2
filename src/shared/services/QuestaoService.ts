import qs from 'query-string';
import Api from "../Api";

export default class QuestaoService {
    static async getQuestioesByAulaId(aula_id: string | number, page?: number, perPage?: number) {

        const params = qs.stringify({ aula_id, page, perPage })


        const { data } = await Api.get(`/questoes?${params}`)

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

    static async responder(questao_id: number, resposta: string) {
        const { data } = await Api.post('questoes/responder', {
            questao_id,
            resposta,
        })

        return data;
    }

    static async deleteRespondida(id: number) {
        await Api.delete(`respondidas/${id}`);
    }

}