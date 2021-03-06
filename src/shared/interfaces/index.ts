export type Disciplina = {
    id: number
    name: string
    user_id: number
    arquivada: boolean
    meta: {
        aulas_count: number,
        questoes_count: number
    }
}

export type DashboardDataItem = {
    day: string,
    tempo: number,
    questoes: {
        total: number,
        acertos: number
    },
    position?: number
}

export type Aula = {
    id: number
    name: string
    user_id: number
    ordem: number,
    disciplina_id: number,
    disciplina: Disciplina,
    registros: Registro[],
    respondidas: Respondida[],
    questoes: Questao[]
    meta: {
        questoes_count: number
    }
    days: [
        {
            data: string,
            acertos: number,
            erros: number,
            total: number,
            last: boolean,
            tempo: number
        }
    ],
    cadernos: Caderno[]
}

export type Questao = {
    id: number
    modalidade: string
    enunciado: string
    gabarito: string
    aula_id: number
    banca: {
        name: string,
        image_url: string
    }
    alternativas: Alternativa[],
    respondidas: Respondida[],
    texto: string,
    header: string
}

export type Alternativa =  {
    conteudo: string
    letra: string
    correta: boolean
}

export type Comentario = {
    id: number
    texto: string,
    questao_id: number,
    user_id: number
}

export type Registro = {
    id?: number
    horario: string
    tempo: number
    aula_id: number
    disciplina_id: number
}

export type Respondida = {
    id: number
    aula_id: number
    horario: string
    resposta: string
    gabarito: string
    acertou: number
    user_id: number
    questao_id: number
    caderno_id: string
}

export interface Paginate<T> {
    meta: PaginateMeta,
    data: T[]
}

export interface PaginateMeta {
    total: number,
    per_page: number,
    current_page: number,
    last_page: number,
    first_page: number
}

export interface Caderno {
    id: string,
    inicio: string,
    fim: string,
    total: number,
    acertos: number,
    erros: number,
    encerrado: boolean
}