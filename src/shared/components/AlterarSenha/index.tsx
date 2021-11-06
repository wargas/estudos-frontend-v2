import { FaChevronLeft } from 'react-icons/fa';

export function AlterarSenha({closeDrawer = () => {}}: any) {
  return (
    <div className='h-screen flex flex-col text-base'>
      <div className='h-14 bg-primary-600 flex items-center'>
        <button onClick={() => closeDrawer()} className='px-5 text-white'>
          <FaChevronLeft className='' />
        </button>
        <span className='text-white'>ALTERAR SENHA</span>
      </div>
      <div className="flex flex-1 flex-col mt-5 text-base">
        <div className='px-3 mb-3'>
          <label className='text-gray-400 text-sm'>Senha atual:</label>
          <input
            type='password'
            className='px-3 border h-9 w-full rounded'
          />
        </div>
        <div className='px-3 mb-3'>
          <label className='text-gray-400 text-sm'>Nova Senha:</label>
          <input
            type='password'
            className='px-3 border h-9 w-full rounded'
          />
        </div>
        <div className='px-3 mb-3'>
          <label className='text-gray-400 text-sm'>Repita senha:</label>
          <input
            type='password'
            className='px-3 border h-9 w-full rounded'
          />
        </div>
      </div>
      <div className='mt-auto p-3'>
        <button className='h-10 bg-primary-500 hover:bg-primary-600 transition-all w-full rounded text-white'>
          Salvar Senha
        </button>
      </div>
    </div>
  );
}
