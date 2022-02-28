import { FC } from "react"
import { FaComment } from "react-icons/fa"
import { useQuery } from "react-query"
import { toast } from "react-toastify"
import { useDrawer } from "../../../shared/components/Drawer"
import { EditComentario } from "../../../shared/components/EditComentario"
import { Markdown } from "../../../shared/components/Markdown"
import { Comentario } from "../../../shared/interfaces"
import QuestaoService from "../../../shared/services/QuestaoService"

type Props = {
    questao_id: number,
    show: boolean
}

const ShowComentarios: FC<Props> = ({questao_id, show}) => {

    const { data: comentario, refetch: refetchComentario } = useQuery<Comentario>(
        ['comentarios', questao_id],
        () => QuestaoService.getComentario(questao_id),
        {
          onError: () => {
            toast.error('Erro ao buscar comentários');
          },
        }
      );

    const openDrawer = useDrawer()
    return  <div style={{ minHeight: 150 }} className='p-5 border-t flex flex-col'>
    <h1 className='text-2xl mb-3 text-gray-700'>Comentário</h1>
    {comentario?.texto ? (
      <div style={{ filter: show ? 'blur(0px)' : 'blur(5px)' }}>
        <Markdown markdown={comentario.texto} />
      </div>
    ) : (
      <div className='text-gray-300'>Sem comentário</div>
    )}
    <div className='flex pt-5 mt-auto'>
      <button
        onClick={() =>
          openDrawer(
            EditComentario,
            { id: questao_id },
            refetchComentario
          )
        }
        className='text-white ml-auto  flex gap-3 flex-center bg-primary-600 hover:bg-primary-700 transition-all rounded-full h-9 px-5'>
        <FaComment />
        <span>Editar</span>
      </button>
    </div>
  </div>
}

export default ShowComentarios