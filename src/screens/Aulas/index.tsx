import { Menu } from '@headlessui/react';
import { DateTime, Duration } from 'luxon';
import qs from 'query-string';
import { useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import {
  FaChevronDown,
  FaChevronUp,
  FaCode,
  FaEdit,
  FaPlus,
  FaSearch,
  FaSync
} from 'react-icons/fa';
import { IoMdMore } from 'react-icons/io';
import { useQuery, useQueryClient } from 'react-query';
import { useHistory, useParams } from 'react-router';
import Api from '../../shared/Api';
import { useDrawer } from '../../shared/components/Drawer';
import { EditQuestoes } from '../../shared/components/EditQuestoes';
import { InsertAulas } from '../../shared/components/InsertAulas';
import { PageHeader } from '../../shared/components/PageHeader';
import { Aula, Disciplina } from '../../shared/interfaces';

export function Aulas() {
  const [orderBy, setOrderBy] = useState('ordem:asc');

  const { id = null } = useParams<{ id: string }>();

  const { data: disciplina, isLoading: isLoadingDisciplina } = useQuery<Disciplina>(
    ['disciplina', id],
    loadDisciplina
  );

  const { data: aulas, status } = useQuery<Aula[]>(['aulas', orderBy, disciplina?.id], loadAulas, {
    enabled: !!disciplina?.id
  })

  const queryClient = useQueryClient()

  const openDrawer = useDrawer();

  const history = useHistory();

  async function loadDisciplina() {
    const { data } = await Api.get(`/disciplinas/${id}`);

    return data;
  }

  async function loadAulas() {
    const { data } = await Api.get(
      `/aulas?${qs.stringify({
        order_by: orderBy,
        disciplina_id: id,
      })}`
    );

    return data;
  }

  function updateOrderBy(_coluna: string) {
    const [coluna, ordem] = orderBy.split(':');

    if (coluna === _coluna) {
      setOrderBy(`${coluna}:${ordem === 'asc' ? 'desc' : 'asc'}`);
    } else {
      setOrderBy(`${_coluna}:asc`);
    }
  }

  
  async function handlerUpdateQuestoes(retorno: any, aula_id: number) {
    if (retorno) {
     await queryClient.invalidateQueries('aulas')
    }
  }

  return (
    <div className=''>

      {disciplina && (
        <PageHeader
          isLoading={isLoadingDisciplina}
          onBackPress={() => history.push('/disciplinas')}
          backButton
          title={`${disciplina?.name || ''}`}>
          <button
            onClick={() => queryClient.invalidateQueries('aulas')}
            className='text-primary-600 bg-white hover:shadow-sm border gap-2 h-8 px-5 rounded-full flex-center'>
            <FaSync className='text-sm' />
          </button>
          <button className='text-primary-600 gap-2 flex-center h-8 px-5 rounded-full bg-white shadow-sm ml-3'>
            <FaPlus />
            <span>Adicionar Aula</span>
          </button>
          <button
            onClick={() =>
              openDrawer(
                InsertAulas,
                { disciplina_id: disciplina.id },
                (result) => {
                  if (result) {
                    loadAulas();
                  }
                }
              )
            }
            className='text-primary-600 gap-2 flex-center h-8 px-5 rounded-full bg-white shadow-sm ml-3'>
            <FaPlus />
            <span>Adicionar em Lote</span>
          </button>
        </PageHeader>
      )}
      <div className='bg-white shadow-sm overflow-hidden rounded'>
        <div className='p-5 flex items-center border-b border-gray-100'>
          <div>
            {status === 'loading' ? (
              <h1 className='bg-gray-200 rounded-full animate-pulse h-4 w-48'></h1>
            ) : (
              <h1 className='text-gray-600'>
                {aulas?.length || 0} aulas encontradas
              </h1>
            )}
          </div>
          <div className='h-10 w-96 flex ml-auto bg-gray-100 rounded-full'>
            <input
              type='text'
              placeholder='Filtrar aula'
              className='bg-transparent flex-1 px-5 focus:outline-none'
            />
            <button className='h-10 bg-primary-600 hover:bg-primary-700 rounded-r-full text-white ml-auto px-5'>
              <FaSearch />
            </button>
          </div>
        </div>
        <>
          <table
            style={{ tableLayout: 'fixed' }}
            className={`${aulas?.length === 0 && 'hidden'} w-full`}>
            <colgroup>
              <col span={1} width='65%'></col>
              <col span={1} width='10%'></col>
              <col span={1} width='10%'></col>
              <col span={1} width='10%'></col>
              <col span={1} width='5%'></col>
            </colgroup>
            <thead>
              <tr className='text-left cursor-pointer h-14 text-base bg-white text-primary-600 border-b border-t'>
                <th onClick={() => updateOrderBy('ordem')} className='pl-3'>
                  <div className='flex items-center gap-3'>
                    <div>ORDEM/NOME</div>{' '}
                    {orderBy.startsWith('ordem:') &&
                      orderBy.endsWith(':asc') && (
                        <FaChevronUp className='text-gray-600 text-xs' />
                      )}
                    {orderBy.startsWith('ordem:') &&
                      orderBy.endsWith(':desc') && (
                        <FaChevronDown className='text-gray-600 text-xs' />
                      )}
                  </div>
                </th>
                <th onClick={() => updateOrderBy('last')} className=''>
                  <div className='flex items-center gap-3'>
                    <div>ÚLTIMA</div>{' '}
                    {orderBy.startsWith('last:') &&
                      orderBy.endsWith(':asc') && (
                        <FaChevronUp className='text-gray-600 text-xs' />
                      )}
                    {orderBy.startsWith('last:') &&
                      orderBy.endsWith(':desc') && (
                        <FaChevronDown className='text-gray-600 text-xs' />
                      )}
                  </div>
                </th>
                <th className='text-left'>TEMPO</th>
                <th onClick={() => updateOrderBy('nota')} className=''>
                  <div className='flex items-center gap-3'>
                    <div>NOTA</div>{' '}
                    {orderBy.startsWith('nota:') &&
                      orderBy.endsWith(':asc') && (
                        <FaChevronUp className='text-gray-600 text-xs' />
                      )}
                    {orderBy.startsWith('nota:') &&
                      orderBy.endsWith(':desc') && (
                        <FaChevronDown className='text-gray-600 text-xs' />
                      )}
                  </div>
                </th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {aulas
                ?.map((aula) => {
                  const last = aula.days.find((item) => item.last);

                  return { ...aula, last };
                })
                .map((aula) => (
                  <tr
                    key={aula.id}
                    className='h-14  hover:bg-gray-100 border-b border-gray-100'>
                    <td
                      onClick={() =>
                        history.push(
                          `/disciplinas/${aula?.disciplina_id}/aula/${aula.id}`
                        )
                      }
                      className='px-3 overflow-hidden cursor-pointer h-14 flex items-center'>
                      <div
                        style={{ minWidth: '2.5rem' }}
                        className='mr-3 w-10 h-10 bg-primary-600 rounded-full text-white flex items-center justify-center'>
                        {String(aula.ordem).padStart(2, '0')}
                      </div>
                      <div className='overflow-hidden mr-4'>
                        <h1 className='truncate'>{aula.name} </h1>
                        <p className='text-gray-400 flex items-center gap-2 text-sm'>
                          {aula.meta.questoes_count} questoes
                          {status === `loading:${aula.id}` && (
                            <BiLoaderAlt className='animate-spin' />
                          )}
                        </p>
                      </div>
                    </td>
                    <td className='text-gray-500 text-sm'>
                      {aula.last &&
                        DateTime.fromSQL(aula.last.data).toFormat('dd/MM/yyyy')}
                    </td>
                    <td className='text-gray-500 text-sm'>
                      {!aula.last
                        ? ''
                        : Duration.fromMillis(aula.last.tempo * 1000).toFormat(
                            'hh:mm:ss'
                          )}
                    </td>
                    <td className='text-gray-500 text-sm'>
                      {aula.last &&
                        aula?.last?.acertos > 0 &&
                        ((aula.last.acertos / aula.last.total) * 100)
                          .toFixed(1)
                          .replace('.', ',')}
                      {aula.last && aula?.last?.acertos > 0 ? '%' : ''}
                    </td>
                    <td className=''>
                      <Menu as='div' className='relative'>
                        <Menu.Button
                          as='button'
                          className='w-10 h-10 ml-auto mr-3 flex items-center transition-all rounded-full justify-center'>
                          <IoMdMore />
                        </Menu.Button>
                        <Menu.Items className='absolute text-sm rounded right-0 z-10 w-48  bg-white shadow-lg'>
                          <Menu.Item
                            onClick={() =>
                              openDrawer(
                                EditQuestoes,
                                { aula_id: aula.id },
                                (ret) => handlerUpdateQuestoes(ret, aula.id)
                              )
                            }>
                            <div className='flex items-center gap-2 px-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-700'>
                              <FaCode />
                              <span> Editar Questões</span>
                            </div>
                          </Menu.Item>
                          <Menu.Item onClick={() => queryClient.invalidateQueries('aulas')}>
                            <div className='flex items-center gap-2 px-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-700'>
                              <FaEdit />
                              <span> Editar Aula</span>
                            </div>
                          </Menu.Item>
                          <Menu.Item>
                            <div className='flex items-center gap-2 px-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-700'>
                              <FaSearch />
                              <span> Detalhes </span>
                            </div>
                          </Menu.Item>
                        </Menu.Items>
                      </Menu>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {aulas?.length === 0 && status !== 'loading' && (
            <div className='h-32 flex-center'>nenhuma aula cadastrada</div>
          )}
        </>
      </div>
    </div>
  );
}
