import { Menu } from '@headlessui/react';
import { DateTime, Duration } from 'luxon';
import { useState } from 'react';
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
import { useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router';
import { useDrawer } from '../../shared/components/Drawer';
import { EditQuestoes } from '../../shared/components/EditQuestoes';
import SelectAula from '../../shared/components/FormSelectAula';
import { InsertAulas } from '../../shared/components/InsertAulas';
import Loading from '../../shared/components/Loading';
import { PageHeader } from '../../shared/components/PageHeader';
import { Aula, Disciplina } from '../../shared/interfaces';
import AulaService from '../../shared/services/AulaService';
import DisciplinaService from '../../shared/services/DisciplinaService';
import styles from './Aulas.module.css';

export function Aulas() {
  const [orderBy, setOrderBy] = useState('ordem:asc');

  const { id = null } = useParams<{ id: string }>();

  

  const { data: disciplina, isLoading: isLoadingDisciplina } =
    useQuery<Disciplina>(['disciplina', id], () =>
      DisciplinaService.getDisciplinaById(id || '')
    );



  const {
    data: aulas,
    isLoading: isLoadingAula,
    refetch: refetchAulas,
  } = useQuery<Aula[]>(
    ['aulas', disciplina?.id],
    () =>
      AulaService.getAulasByDisciplina(disciplina?.id, {
        withMeta: true,
        withCadernos: true,
        withRegistros: true,
      }),
    {
      enabled: !!disciplina?.id,
    }
  );

  // const aulasSort = useSort<Aula>(aulas || [], (aula) => {
  //   return aula.cadernos[0].acertos
  // }, 'asc')

  
  const openInserAulas = useDrawer(InsertAulas, (result) => {
    if (result) {
      refetchAulas();
    }
  });
  const openEditQuestoes = useDrawer(EditQuestoes, (ret) =>
    handlerUpdateQuestoes(ret)
  );

  const openSelectAula = useDrawer(SelectAula, () => {});

  const navigate = useNavigate();

  function updateOrderBy(_coluna: string) {
    const [coluna, ordem] = orderBy.split(':');

    if (coluna === _coluna) {
      setOrderBy(`${coluna}:${ordem === 'asc' ? 'desc' : 'asc'}`);
    } else {
      setOrderBy(`${_coluna}:asc`);
    }
  }

  async function handlerUpdateQuestoes(retorno: any) {
    if (retorno) {
      await refetchAulas();
    }
  }

  return (
    <div className={styles.wrapper}>
      {disciplina && (
        <PageHeader
          isLoading={isLoadingDisciplina}
          onBackPress={() => navigate('/disciplinas')}
          backButton
          title={`${disciplina?.name || ''}`}>
          <button
            onClick={() => refetchAulas()}
            className={styles.actionButton}>
            <FaSync />
          </button>
          <button className={styles.actionButton}>
            <FaPlus />
            <span>Adicionar Aula</span>
          </button>
          <button
            onClick={() => openInserAulas({ disciplina_id: disciplina.id })}
            className={styles.actionButton}>
            <FaPlus />
            <span>Adicionar em Lote</span>
          </button>
        </PageHeader>
      )}
      <div className={styles.content}>
        <div className={styles.header}>
          <div>
            {isLoadingAula ? (
              <h1 className={styles.loading}></h1>
            ) : (
              <h1>
                {aulas?.length || 0} {orderBy} aulas encontradas
              </h1>
            )}
          </div>
          <div className={styles.search}>
            <input type='text' placeholder='Filtrar aula' />
            <button>
              <FaSearch />
            </button>
          </div>
        </div>
        <>
          {isLoadingAula ? (
            <div className={styles.contentLoading}>
              <Loading show={true} />
            </div>
          ) : (
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
                    const lastDay = DateTime.max(
                      ...aula.registros.map((r) => DateTime.fromISO(r.horario))
                    );

                    const caderno = aula?.cadernos
                      .filter((c) => c.encerrado)
                      .sort((a, b) => (a.fim < b.fim ? 1 : -1));

                    const tempoTotal = aula?.registros.reduce((acc, cur) => {
                      return acc + cur.tempo;
                    }, 0);

                    return {
                      ...aula,
                      lastDay,
                      caderno: caderno[0] || null,
                      tempoTotal,
                    };
                  })
                  .sort((a, b) => {
                    if (orderBy.startsWith('nota:')) {
                      if(!a?.caderno || !b.caderno ) {
                        return 0
                      }
                      const notaA = a.caderno.acertos / a.caderno.total;
                      const notaB = b.caderno.acertos / b.caderno.total;
                      if(orderBy.endsWith(':asc')) {
                        return notaA - notaB;
                      }
                      return notaB - notaA
                    }
                    return 0
                  })
                  .map((aula) => (
                    <tr
                      key={aula.id}
                      className='h-14  hover:bg-gray-100 border-b border-gray-100'>
                      <td
                        onClick={() =>
                          navigate(
                            `/disciplinas/${aula?.disciplina_id}/aulas/${aula.id}`
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
                          </p>
                        </div>
                      </td>
                      <td className='text-gray-500 text-sm'>
                        {aula.lastDay
                          ? aula.lastDay.toFormat('dd/MM/yyyy')
                          : '-'}
                      </td>
                      <td className='text-gray-500 text-sm'>
                        {aula.tempoTotal
                          ? Duration.fromMillis(
                              aula.tempoTotal * 1000
                            ).toFormat('hh:mm:ss')
                          : '-'}
                      </td>
                      <td className='text-gray-500 text-sm'>
                        {aula.caderno
                          ? `${(
                              (aula.caderno.acertos / aula.caderno.total) *
                              100
                            ).toFixed(1)}% (${aula.caderno.acertos} de ${
                              aula.caderno.total
                            })`
                          : '-'}
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
                                openEditQuestoes({ aula_id: aula.id })
                              }>
                              <div className='flex items-center gap-2 px-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-700'>
                                <FaCode />
                                <span> Editar Questões</span>
                              </div>
                            </Menu.Item>
                            <Menu.Item onClick={() => refetchAulas()}>
                              <div className='flex items-center gap-2 px-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-700'>
                                <FaEdit />
                                <span> Editar Aula</span>
                              </div>
                            </Menu.Item>
                            <Menu.Item onClick={() => openSelectAula({})}>
                              <div className='flex items-center gap-2 px-3 py-3 cursor-pointer hover:bg-gray-50 text-gray-700'>
                                <FaSearch />
                                <span> Importar Questões </span>
                              </div>
                            </Menu.Item>
                          </Menu.Items>
                        </Menu>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          )}
          {aulas?.length === 0 && !isLoadingAula && (
            <div className='h-32 flex-center'>nenhuma aula cadastrada</div>
          )}
        </>
      </div>
    </div>
  );
}
