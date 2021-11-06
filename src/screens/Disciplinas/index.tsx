import { Menu } from '@headlessui/react';
import { useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import {
  FaEdit,
  FaPlus,
  FaSearch,
  FaSync,
  FaTimes,
  FaTrash
} from 'react-icons/fa';
import { IoMdMore } from 'react-icons/io';
import { useHistory } from 'react-router';
import useSWR from 'swr';
import { fetcher } from '../../shared/Api';
import { PageHeader } from '../../shared/components/PageHeader';
import { Disciplina } from '../../shared/interfaces';

export function Disciplinas() {
  const [loading] = useState(false);
  const [search, setSearch] = useState('');

  const history = useHistory();

  const { data: disciplinas } = useSWR<Disciplina[], any>(
    `/disciplinas?countQuestoes=true&countAulas=true&search=${search}`,
    fetcher
  );

  return (
    <div>
      {}
      <PageHeader
        backButton
        title='Disciplinas'
        subtitle='Suas disciplins cadastradas'>
        <button
          // onClick={() => loadDisciplinas()}
          className='text-primary-600 border bg-white shadow-sm h-8 px-5 rounded-full flex items-center gap-3 mr-3'>
          <FaSync />
          <span>Atualizar</span>
        </button>
        <button className='text-primary-600 border bg-white shadow-sm h-8 px-5 rounded-full flex items-center gap-3'>
          <FaPlus />
          <span>Cadastrar</span>
        </button>
      </PageHeader>

      <div className='bg-white shadow-sm rounded'>
        <div className='border-b items-center p-5 flex'>
          <div>{disciplinas?.length} registros encontrados</div>
          <div className='bg-gray-100 ml-auto rounded-lg flex h-10'>
            <input
              value={search}
              onChange={(ev) => setSearch(ev.target.value)}
              type='text'
              className='bg-transparent focus:outline-none flex-1 px-5'
              placeholder='Pesquisa disciplina'
            />
            <button
              // onClick={() => loadDisciplinas()}
              className='px-5 rounded-r-lg bg-primary-600 text-white'>
              <FaSearch />
            </button>
          </div>
        </div>
        {loading && (
          <div className='p-5 py-12 flex items-center justify-center'>
            <BiLoaderAlt className='animate-spin text-3xl text-primary-600' />
          </div>
        )}
        {disciplinas?.map((disciplina) => (
          <div
            key={disciplina.id}
            className='border-b flex hover:bg-gray-100 transition-all border-gray-50 p-3 px-5 '>
            <div
              onClick={() => history.push(`/disciplinas/${disciplina.id}`)}
              className='flex flex-1 cursor-pointer'>
              <div className='w-10 h-10 bg-primary-600 text-white rounded-full mr-5 flex items-center justify-center text-center'>
                <span className='text-base'>{disciplina.id}</span>
              </div>
              <div className='flex-1'>
                <h1>{disciplina.name}</h1>
                <p className='text-sm text-gray-400'>
                  {disciplina.meta.aulas_count} aulas &#8226;{' '}
                  {disciplina.meta.questoes_count} questões
                </p>
              </div>
            </div>
            <Menu as={'div'} className='flex relative'>
              <Menu.Button
                className='ml-auto w-8 h-8 flex items-center justify-center'
                as='button'>
                <IoMdMore className='text-lg' />
              </Menu.Button>
              <Menu.Items className='absolute w-44 z-10 shadow-lg border border-gray-100 top-8 right-0 bg-white rounded'>
                <Menu.Item>
                  <button
                    onClick={() =>
                      history.push(`/disciplinas/${disciplina.id}`)
                    }
                    className='flex items-center text-gray-600 px-5 p-3 w-full text-left hover:bg-gray-100 border-b border-gray-50'>
                    <FaSearch className='mr-5 text-sm' />
                    <span> Ver aulas</span>
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button className='flex items-center text-gray-600 px-5 p-3 w-full text-left hover:bg-gray-100 border-b border-gray-50'>
                    <FaEdit className='mr-5 text-sm' />
                    <span> Editar</span>
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button className='flex items-center text-gray-600 px-5 p-3 w-full text-left hover:bg-gray-100'>
                    <FaTrash className='mr-5 text-sm' />
                    <span> Arquivar</span>
                  </button>
                </Menu.Item>
                <Menu.Item>
                  <button className='flex items-center text-gray-600 px-5 p-3 w-full text-left hover:bg-gray-100'>
                    <FaTimes className='mr-5 text-sm' />
                    <span> Exluir</span>
                  </button>
                </Menu.Item>
              </Menu.Items>
            </Menu>
          </div>
        ))}
      </div>
    </div>
  );
}
