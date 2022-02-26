import {
  FaCalendar, FaChartBar, FaChevronRight, FaCog, FaExclamation, FaListAlt, FaLockOpen, FaSearch, FaUserLock
} from 'react-icons/fa';
import { NavLink } from 'react-router-dom';
import dataPackage from '../../../../package.json';
import { useAuth } from '../../auth';
import { AlterarSenha } from '../../components/AlterarSenha';
import { useDrawer } from '../../components/Drawer';
import styles from './Sidebar.module.css';


const Sidebar = () => {

  const openDrawer = useDrawer()
  const { logout, user } = useAuth()

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h1>
          <NavLink to="/">APPESTUDOS</NavLink>
        </h1>
      </div>
      <div className={[styles.center, 'scroll'].join(' ')}>
        <div className={styles.search}>
          <input
            type='text'
            placeholder='Pesquisa...'
          />
          <FaSearch  />
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
          <li className='flex  px-2 my-1'>
            <button className='tsext-gray-600 rounded text flex items-center pl-5 py-3 w-full transition-all hover:bg-gray-50'>
              <FaExclamation className='mr-3' />
              <span>Versão: <span className='text-gray-300'> {dataPackage.version} </span></span>
            </button>
          </li>
        </ul>
        <div className='border-b'></div>
      </div>
      <div className={styles.footer}>
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