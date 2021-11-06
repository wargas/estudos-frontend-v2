import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import { FaCheck, FaChevronLeft, FaEdit } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Api from '../../Api';
import { Comentario as IComentario } from '../../interfaces';
import { ComponentProps } from '../Drawer';
import { Markdown } from '../Markdown';

export function Comentario({
  data,
  setWidth,
  closeDrawer = () => {},
}: ComponentProps) {
  const [comentario, setComentario] = useState<IComentario>();
  const [allowEdit, setAllowEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setWidth('1/2');
    loadComentario();
  }, []);

  async function loadComentario() {
    setLoading(true);
    Api.get<IComentario>(`comentarios/${data.id}`)
      .then(({ data }) => setComentario(data))
      .finally(() => {
        setLoading(false);
      });
  }

  async function saveComentario() {
    setLoading(true);
    Api.post<any, AxiosResponse<IComentario>>(`comentarios/${data.id}`, {
      texto: comentario?.texto,
    })
      .then(({ data }) => {
        setComentario(data);
        setAllowEdit(false);
        toast.success('O comentário está salvo!');
      })
      .catch(() => {
          toast.error('Erro ao salvar o comentário')
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className='flex flex-col h-screen'>
      <div className='h-14 bg-primary-600 flex items-center'>
        <button onClick={() => closeDrawer(null)} className='px-5 text-white'>
          <FaChevronLeft />
        </button>
      </div>
      <div className='flex-1 flex relative bg-gray-50'>
        {loading && (
          <div className='absolute bg-white inset-0 flex-center'>
            <BiLoaderAlt className='text-6xl text-primary-600 animate-spin' />
          </div>
        )}
        {!allowEdit && (
          <div className='p-5'>
            <Markdown markdown={comentario?.texto || ''} />
          </div>
        )}
        {allowEdit && (
          <textarea
            onChange={(ev) =>
              setComentario({
                ...(comentario as IComentario),
                texto: ev.target.value,
              })
            }
            value={comentario?.texto}
            className='flex-1 p-5 resize-none focus:outline-none'></textarea>
        )}
      </div>
      <div className='flex bg-gray-50 items-center h-14 border-t px-5 gap-2'>
        <div className='ml-auto'></div>
        {!allowEdit && (
          <button
            onClick={() => setAllowEdit(true)}
            className='border flex items-center gap-2 h-9 text-sm text-primary-600 shadow-sm px-5 rounded-full'>
            <FaEdit />
            <span>Editar</span>
          </button>
        )}
        {allowEdit && (
          <button
            onClick={saveComentario}
            className='border flex items-center gap-2 text-sm h-9 text-primary-600 shadow-sm px-5 rounded-full'>
            <FaCheck />
            <span>Salvar</span>
          </button>
        )}
      </div>
    </div>
  );
}
