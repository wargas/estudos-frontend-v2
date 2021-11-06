import {
  FaCalendar, FaChartBar, FaChevronRight, FaCog, FaListAlt, FaLockOpen, FaSearch, FaUserLock
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../auth';
import { AlterarSenha } from '../components/AlterarSenha';
import { useDrawer } from '../components/Drawer';


const Sidebar = () => {

  const openDrawer = useDrawer()
  const { logout, user } = useAuth()

  return (
    <div className='absolute flex flex-col left-0 top-0 bottom-0 w-64 shadow bg-white'>
      <div className='h-14 flex bg-primary-600 shadow items-center justify-center'>
        <h1 className='text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary-50 to-primary-300'>
          APPESTUDOS
        </h1>
      </div>
      <div className='flex-1 scroll overflow-y-auto'>
        <div className='m-3 mb-5 bg-gray-100 rounded-full items-center px-5 flex'>
          <input
            type='text'
            className='w-full focus:outline-none bg-transparent  h-9'
            placeholder='Pesquisa...'
          />
          <FaSearch className='text-gray-400' />
        </div>
        <div className='text-gray-400 pl-3 text-sm mt-3'>MENU</div>
        <ul className=''>
          <li className='flex  px-2 my-1'>
            <NavLink
              to='/dashboard'
              activeClassName='bg-gray-50'
              className='text-gray-600 rounded text flex items-center pl-5 py-3 w-full transition-all hover:bg-gray-50'
              href=''>
              <FaChartBar className='mr-3' />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li className='flex  px-2 my-1'>
            <NavLink
              activeClassName='bg-gray-50'
              to='/disciplinas'
              className='text-gray-600 rounded text flex items-center pl-5 py-3 w-full transition-all hover:bg-gray-50'>
              <FaListAlt className='mr-3' />
              <span>Disciplinas</span>
            </NavLink>
          </li>
          <li className='flex  px-2 my-1'>
            <NavLink
              activeClassName='bg-gray-50'
              to='/tempo'
              className='text-gray-600 rounded text flex items-center pl-5 py-3 w-full transition-all hover:bg-gray-50'
              href=''>
              <FaCalendar className='mr-3' />
              <span>Tempo</span>
            </NavLink>
          </li>
          <li className='flex  px-2 my-1'>
            <NavLink
              activeClassName='bg-gray-50'
              to='/gerenciar'
              className='text-gray-600 rounded text flex items-center pl-5 py-3 w-full transition-all hover:bg-gray-50'>
              <FaCog className='mr-3' />
              <span>Gerenciar</span>
            </NavLink>
          </li>
        </ul>
        <div className='border-b'></div>
        <div className='text-gray-400 pl-3 text-sm mt-5'>USUÁRIO</div>
        <ul className=''>
          <li className='flex  px-2 my-1'>
            <button
              onClick={() => openDrawer(AlterarSenha, {}, () => {})}
              className='text-gray-600 rounded text flex items-center pl-5 py-3 w-full transition-all hover:bg-gray-50'
              >
              <FaUserLock className='mr-3' />
              <span>Alterar senha</span>
            </button>
          </li>
          <li className='flex  px-2 my-1'>
            <button
              onClick={() => logout()}
              className='text-gray-600 rounded text flex items-center pl-5 py-3 w-full transition-all hover:bg-gray-50'
              >
              <FaLockOpen className='mr-3' />
              <span>Sair</span>
            </button>
          </li>
        </ul>
        <div className='border-b'></div>
      </div>
      <div className='h-14 border-t cursor-pointer transition-all hover:bg-gray-100 flex items-center border-gray-50'>
        <div className='w-9 h-9 flex mx-2 items-center rounded-full'>
          <img
            className='w-7 h-7 rounded-full'
            src='https://avatars.githubusercontent.com/u/2016573?v=4'
            alt=''
          />
        </div>
        <div className='flex-1 flex flex-col'>
          <span className='text-base text-gray-800'>{user.name}</span>
          <span className='text-sm text-gray-400'>{user.email}</span>
        </div>
        <div className='mr-3'>
          <FaChevronRight className='text-gray-400 text-xs' />
        </div>
      </div>
    </div>
  );
}

export default Sidebar