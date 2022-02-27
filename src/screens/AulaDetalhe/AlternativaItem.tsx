import { FC } from "react"
import { FaTimes } from "react-icons/fa"
import { Markdown } from "../../shared/components/Markdown"
import { Alternativa, Respondida } from "../../shared/interfaces"

type Props = {
    alternativa: Alternativa,
    marcada: string,
    respondida: Respondida | undefined,
    onSelectLetra?: (letra: string) => void,
    onDelete?: (letra: string) => void,
    riscadas: string[]
}

const AlternativaItem: FC<Props> = ({alternativa, marcada, respondida, onDelete = () => {}, onSelectLetra = () => {}, riscadas}) => {
    return <div
    className={`${
      alternativa.letra === marcada
        ? 'border-primary-100 bg-gray-50'
        : 'border-transparent'
    } transition-all items-center border-2 group flex  hover:bg-gray-50 rounded `}>
    <div
      onClick={() => onSelectLetra(alternativa.letra)}
      className={`flex flex-1 gap-2 cursor-pointer p-2`}>
      <div className=''>
        {!!respondida && (
          <button
            className={`${
              alternativa.letra === respondida.resposta
                ? respondida.gabarito === alternativa.letra
                  ? 'bg-green-500 border-green-500 text-white'
                  : 'bg-red-500 border-red-500 text-white'
                : respondida.gabarito === alternativa.letra
                ? 'border-green-500 text-green-500'
                : 'text-gray-400'
            }  h-10 w-10 border-2 item rounded`}>
            {alternativa.letra}
          </button>
        )}
        {!respondida && (
          <button
            className={`${
                alternativa.letra === marcada
                ? 'bg-gray-400 border-gray-400 text-white'
                : 'text-gray-500'
            } h-10 w-10 border-2  item rounded`}>
            {alternativa.letra}
          </button>
        )}
      </div>
      <div
        className={`flex-1 text-justify  ${
          riscadas.includes(alternativa.letra) && 'line-through text-gray-200'
        }`}>
        <Markdown markdown={alternativa.conteudo} />
      </div>
    </div>
    <div>
      <button
        onClick={() => onDelete(alternativa.letra)}
        className={`${
          !!respondida && 'opacity-0'
        } transition-all text-transparent m-3 flex-center w-10 h-10 group-hover:bg-gray-100 rounded-full group-hover:text-gray-400`}>
        <FaTimes />
      </button>
    </div>
  </div>
}

export default AlternativaItem