import bancas from '../data/bancas.json'
import { Questao } from "./interfaces"

export function extractEnunciadoHeader(enunciado: string): string {
    return enunciado.substr(0, getEnunciadoDividerPosition(enunciado))

}

export function extractEnunciadoContent(enunciado: string): string {
    return enunciado.substring(getEnunciadoDividerPosition(enunciado))
}

export function getEnunciadoDividerPosition(enunciado: string): number {
    const words = enunciado.split("")
    let compareOpenClose = 0
    let dividerPos = 0

    words.every((word, index) => {
        if (index > 0 && compareOpenClose === 0) {
            dividerPos = index
            return false
        }

        if (word === '(') {
            compareOpenClose++
        }
        if (word === ')') {
            compareOpenClose--
        }

        return true
    })

    return dividerPos
}

export function getBancaName(enunciado: string): string {

    const header = extractEnunciadoHeader(enunciado).toLowerCase()

    const match = bancas.find(({name}) => header.includes(name.toLowerCase()))

    return match?.name || ''
}

export function QuestoesToMarkdown(questoes: Questao[], showGabarito = true): string {

    return questoes
        .map((questao) => {
            const alternativas =
                questao.alternativas &&
                questao?.alternativas
                    .map((alt) => `${alt.conteudo}`)
                    .join(`\n***\n`);

            const _head = `[ID: ${questao.id}]`;

            return `${_head}${questao.enunciado}\n***\n${alternativas}${showGabarito ? `\n***\n ${questao.gabarito}` : ''}`;
        })
        .join(`\n****\n`)
}