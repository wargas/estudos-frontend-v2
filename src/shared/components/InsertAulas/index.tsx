import { useEffect, useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import { FaCheck, FaChevronLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Api from '../../Api';
import { ComponentProps } from '../Drawer';

export function InsertAulas({
  data,
  closeDrawer = () => {},
  setWidth = () => {},
}: ComponentProps) {
  const [text, setText] = useState('');
  const { disciplina_id = 0 } = data;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setWidth('96');
  }, []);

  async function handlerSalvar() {
    setLoading(true);
    Api.post(`aulas/insert-lote`, { text, disciplina_id })
      .then(({ data }) => closeDrawer(data))
      .catch(() => toast.error('Ocorreu ao salvar aulas'))
      .finally(() => setLoading(false));
  }

  return (
    <div className='flex flex-col h-screen'>
      <div className='h-14 bg-primary-600 items-center text-white flex'>
        <button onClick={() => closeDrawer(null)} className='px-5'>
          <FaChevronLeft />
        </button>
        <h1>Inserir Disciplinas em lote</h1>
      </div>
      <div className="flex flex-col flex-1 relative">
          {loading && (
              <div className="absolute flex inset-0 bg-white flex-center">
                  <BiLoaderAlt className="text-4xl animate-spin " />
              </div>
          )}
        <textarea
          onChange={(ev) => setText(ev.target.value)}
          className='bg-gray-50 whitespace-pre text-sans border m-3 p-3 focus:outline-none flex-1 rounded resize-none'></textarea>
        <div className='px-3 pb-3 text-gray-400 text-sm'>
          Informe uma linha para cada aula
        </div>
        <div className='flex'>
          <button
            onClick={handlerSalvar}
            className='flex-center gap-3 border bg-primary-600 text-white rounded-full shadow-sm flex-1 mt-0 m-3 h-10 '>
            <FaCheck />
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
