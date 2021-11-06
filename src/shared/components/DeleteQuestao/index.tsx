import { useEffect, useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import { FaExclamation, FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Api from '../../Api';
import { ComponentProps } from '../Modal';

export function DeleteQuestao({ data, closeModal, setWidth }: ComponentProps) {
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setWidth('96');
  }, []);

  function handlerDelete() {
    setLoading(true);
    const id = data.id;

    Api.delete(`questoes/${id}`)
      .then(() => {
        closeModal(data);
        toast.success(`A questão foi exlcuída`);
      })
      .catch(() => {
          toast.error('Não foi possível excluir')
      })
      .finally(() => setLoading(false));
  }

  return (
    <div className='relative'>
      <button
        onClick={() => closeModal(null)}
        className='absolute right-0 top-0 w-9 h-9 flex-center text-gray-500 text-sm hover:text-white transition-all  opacity-95'>
        <FaTimes />
      </button>
      <div className='p-3 border-b bg-primary-600'>
        <h1 className='text-base uppercase font-bold text-white'>
          Deletar Questão
        </h1>
      </div>
      <div className='p-3 py-5 flex items-center relative'>
        {loading && (
          <div className='flex-center absolute inset-0 bg-white'>
            <BiLoaderAlt className='animate-spin text-primary-600 text-2xl' />
          </div>
        )}
        <div className='bg-red-600 border-2 border-red-300 flex-center mr-3 w-9 h-9 rounded-full text-white'>
          <FaExclamation />
        </div>
        <div>
          <h1 className='text-base'>Você confirma a exclusão desta questão?</h1>
          <p className='text-gray-400 text-sm'>
            Depois de confirmar, não tem mais volta!
          </p>
        </div>
      </div>
      <div className='flex gap-5 p-3 text-sm  border-t'>
        <div className='ml-auto '></div>
        <button
          onClick={() => closeModal(null)}
          className='border rounded-full px-5 h-9'>
          Cancelar
        </button>
        <button
          onClick={handlerDelete}
          className='rounded-full bg-primary-600 text-white px-5 h-9'>
          Excluir
        </button>
      </div>
    </div>
  );
}
