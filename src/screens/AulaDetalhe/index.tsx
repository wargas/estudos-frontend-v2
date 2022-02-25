import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { HotKeys } from 'react-hotkeys';
import { BiLoaderAlt } from 'react-icons/bi';
import {
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaComment,
  FaEdit,
  FaSync,
  FaTimes,
  FaTrash,
  FaUndo
} from 'react-icons/fa';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { DeleteQuestao } from '../../shared/components/DeleteQuestao';
import { useDrawer } from '../../shared/components/Drawer';
import { EditComentario } from '../../shared/components/EditComentario';
import { EditQuestao } from '../../shared/components/EditQuestao';
import { Estatisticas } from '../../shared/components/Estatisticas';
import { Markdown } from '../../shared/components/Markdown';
import { useModal } from '../../shared/components/Modal';
import { PageHeader } from '../../shared/components/PageHeader';
import { QuestaoStates } from '../../shared/components/QuestaoItem/QuestaoStates';
import { Relogio } from '../../shared/components/Relogio';
import {
  Aula,
  Comentario,
  Paginate,
  PaginateMeta,
  Questao,
  Respondida
} from '../../shared/interfaces';
import AulaService from '../../shared/services/AulaService';
import QuestaoService from '../../shared/services/QuestaoService';

export default function AulaDetalhe() {
  const { aula_id } = useParams<{ aula_id: string }>();
  const [page, setPage] = useState(1);
  const [questao, setQuestao] = useState<Questao>();
  const [meta, setMeta] = useState<PaginateMeta>();
  const [riscadas, setRiscadas] = useState<string[]>([]);
  const [marcada, setMarcada] = useState('');
  const [respondida, setRespondida] = useState<Respondida>();
  const [keyHandlres, setKeyHandlers] = useState<any>();

  const { push } = useHistory();
  const openDrawer = useDrawer();
  const openModal = useModal();

  const { data: aula, isLoading } = useQuery<Aula>(['aula', aula_id], () =>
    AulaService.getAulaById(aula_id)
  );

  const {
    data: questoesQuery,
    refetch: refetchQuestao,
    failureCount,
  } = useQuery<Paginate<Questao>>(
    ['questao', page, aula_id],
    () => QuestaoService.getQuestioesByAulaId(aula_id, page, 1),
    {
      onError: () => {
        toast.error('Erro ao buscar questões');
      },
    }
  );

  const { data: respondidas, refetch: refetchRespondidas } = useQuery<
    Respondida[]
  >(
    ['respondidas', questao?.aula_id, questao?.id],
    ({ queryKey }) =>
      QuestaoService.getRespondidas(Number(queryKey[1]), Number(queryKey[2])),
    {
      onError: () => {
        toast.error('Erro ao buscar questões respondidas');
      },
    }
  );

  const { data: comentario, refetch: refetchComentario } = useQuery<Comentario>(
    ['comentarios', questao?.id],
    () => QuestaoService.getComentario(questao?.id || 0),
    {
      onError: () => {
        toast.error('Erro ao buscar comentários');
      },
    }
  );

  const mutateQuestao = useMutation(
    () => QuestaoService.responder(questao?.id || 0, marcada),
    {
      onSuccess: () => {
        refetchRespondidas();
      },
    }
  );

  const mutateRespondida = useMutation(
    () => QuestaoService.deleteRespondida(respondida?.id || 0),
    {
      onSuccess: () => {
        refetchRespondidas();
      },
    }
  );

  useEffect(() => {
    if (questoesQuery && questoesQuery?.data.length > 0) {
      setQuestao(questoesQuery?.data[0]);
      setMeta(questoesQuery.meta);
    }
  }, [questoesQuery]);

  useEffect(() => {
    if (respondidas) {
      setRespondida(
        respondidas.find((res) =>
          DateTime.fromISO(res?.horario || '').hasSame(DateTime.local(), 'day')
        )
      );
    }
  }, [respondidas]);

  useEffect(() => {
    setRiscadas([]);
    setMarcada('');
  }, [page]);

  function handleMarcar(letra: string) {
    if (!!respondida) {
      return;
    }
    if (marcada === letra) {
      setMarcada('');
    } else {
      setMarcada(letra);
    }
  }

  function handlerRiscadas(letra: string) {
    setRiscadas((_riscadas) => {
      if (_riscadas.includes(letra)) {
        return _riscadas.filter((l) => l !== letra);
      }
      return [..._riscadas, letra];
    });
  }

  async function handlerResponder() {
    if (marcada === '') {
      return;
    }

    mutateQuestao.mutate();
  }

  const keyMap = {
    mark: ['a', 'b', 'c', 'd', 'e', 'A', 'B', 'C', 'D', 'E'],
    risk: [
      'shift+a',
      'shift+b',
      'shift+c',
      'shift+d',
      'shift+e',
      'shift+A',
      'shift+B',
      'shift+C',
      'shift+D',
      'shift+E',
    ],
    prev: ['left'],
    right: ['right'],
  };

  useEffect(() => {
    setKeyHandlers({
      mark: (ev: any) => handleMarcar(String(ev.key).toUpperCase()),
      risk: (ev: any) => handlerRiscadas(String(ev.key).toUpperCase()),
      prev: () => setPage((page) => (page > 1 ? page - 1 : 1)),
      right: () =>
        meta?.last_page &&
        page < meta?.last_page &&
        setPage((page) => page + 1),
    });

    return () => {
      setKeyHandlers(null);
    };
  }, [page, marcada, riscadas, questao]);

  return (
    <HotKeys keyMap={keyMap} handlers={keyHandlres}>
      <div>
        <PageHeader
          backButton={true}
          isLoading={isLoading}
          title={`${aula?.name}`}
          subtitle={`${aula?.disciplina?.name} / ${aula?.questoes?.length} questões`}
          onBackPress={() => {
            push(`/disciplinas/${aula?.disciplina_id}`);
          }}>
          {!!aula && <Relogio aula={aula} />}
        </PageHeader>
        <div
          style={{ minHeight: 200 }}
          className='bg-white rounded shadow-sm relative'>
          <div className='flex items-center border-b h-16 px-5'>
            <div
              title={questao?.banca?.name}
              className='rounded-full w-10 h-10 border flex-center mr-3 shadow-sm'>
              {questao?.banca && (
                <img
                  className='w-8 h-8 rounded-full'
                  src={questao.banca.image_url}
                  alt={questao.banca.name}
                />
              )}
            </div>
            <QuestaoStates respondidas={respondidas || []} />
            {respondida && (
              <button
                onClick={() => mutateRespondida.mutate()}
                className='hover:bg-gray-100 ml-4 text-gray-600 transition-all w-10 h-10 flex-center rounded-full'>
                <FaUndo />
              </button>
            )}
            <div className='ml-auto'></div>
            <button
              onClick={() => refetchQuestao()}
              className='hover:bg-gray-100 text-gray-600 transition-all w-10 h-10 flex-center rounded-full'>
              <FaSync />
            </button>
            <button
              onClick={() =>
                openModal(
                  DeleteQuestao,
                  { id: questao?.id },
                  (resp: { id: number }) => {
                    if (resp) {
                      if (meta?.current_page === meta?.last_page) {
                        setPage(page > 1 ? page - 1 : 1);
                      } else {
                        refetchQuestao();
                      }
                    }
                  }
                )
              }
              className='hover:bg-gray-100 text-gray-600 transition-all w-10 h-10 flex-center rounded-full'>
              <FaTrash />
            </button>
            <button
              onClick={() =>
                openDrawer(
                  EditQuestao,
                  { aula_id: questao?.aula_id, id: questao?.id },
                  (retorno) => {
                    if (retorno) {
                      refetchQuestao();
                    }
                  }
                )
              }
              className='hover:bg-gray-100 text-gray-600 transition-all w-10 h-10 flex-center rounded-full'>
              <FaEdit />
            </button>
            <button
              onClick={() =>
                openDrawer(Estatisticas, { aula_id: aula_id }, (ev) => {
                  if (ev !== null) {
                    setPage(ev + 1);
                  }
                })
              }
              className='text-gray-600 font-bold px-3 h-10 w-32 rounded-full bg-gray-50 hover:bg-gray-100'>
              {page} de {meta?.last_page}
            </button>
          </div>
          <div className='px-8 py-5'>
            {questao && (
              <>
                <div className='flex mb-2'>
                  <h1 className='font-bold text-lg text-gray-900'>
                    {questao.header}
                  </h1>
                </div>

                <div className='text-lg enunciado  text-justify'>
                  <Markdown markdown={questao.texto} />
                </div>

                <div className='mt-5 flex flex-col gap-0'>
                  {questao?.alternativas.map(({ letra, conteudo }) => (
                    <div
                      key={letra}
                      className={`${
                        letra === marcada
                          ? 'border-primary-100 bg-gray-50'
                          : 'border-transparent'
                      } transition-all items-center border-2 group flex  hover:bg-gray-50 rounded `}>
                      <div
                        onClick={() => handleMarcar(letra)}
                        className={`flex flex-1 gap-2 cursor-pointer p-2`}>
                        <div className=''>
                          {!!respondida && (
                            <button
                              className={`${
                                letra === respondida.resposta
                                  ? respondida.gabarito === letra
                                    ? 'bg-green-500 border-green-500 text-white'
                                    : 'bg-red-500 border-red-500 text-white'
                                  : respondida.gabarito === letra
                                  ? 'border-green-500 text-green-500'
                                  : 'text-gray-400'
                              }  h-10 w-10 border-2 item rounded`}>
                              {letra}
                            </button>
                          )}
                          {!respondida && (
                            <button
                              className={`${
                                letra === marcada
                                  ? 'bg-gray-400 border-gray-400 text-white'
                                  : 'text-gray-500'
                              } h-10 w-10 border-2  item rounded`}>
                              {letra}
                            </button>
                          )}
                        </div>
                        <div
                          className={`flex-1 text-justify  ${
                            riscadas.includes(letra) && 'line-through'
                          }`}>
                          <Markdown markdown={conteudo} />
                        </div>
                      </div>
                      <div>
                        <button
                          onClick={() => handlerRiscadas(letra)}
                          className={`${
                            !!respondida && 'opacity-0'
                          } transition-all text-transparent m-3 flex-center w-10 h-10 group-hover:bg-gray-100 rounded-full group-hover:text-gray-400`}>
                          <FaTimes />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className='border-t p-5 flex items-center'>
            <button
              onClick={handlerResponder}
              disabled={
                marcada === '' || mutateQuestao.isLoading || !!respondida
              }
              className='text-white disabled:opacity-50 flex gap-3 flex-center bg-primary-600 hover:bg-primary-700 transition-all rounded-full h-9 px-5'>
              {mutateQuestao.isLoading ? (
                <BiLoaderAlt className='animate-spin text-primary-600' />
              ) : (
                <FaCheck />
              )}
              <span> Responder</span>
            </button>
            <div className='ml-auto'></div>
          </div>

          <div
            style={{ minHeight: 150 }}
            className='p-5 border-t flex flex-col'>
            <h1 className='text-2xl mb-3 text-gray-700'>Comentário</h1>
            {comentario?.texto ? (
              <div style={{ filter: !!respondida ? 'blur(0px)' : 'blur(5px)' }}>
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
                    { id: questao?.id },
                    refetchComentario
                  )
                }
                className='text-white ml-auto  flex gap-3 flex-center bg-primary-600 hover:bg-primary-700 transition-all rounded-full h-9 px-5'>
                <FaComment />
                <span>Editar</span>
              </button>
            </div>
          </div>

          <button
            onClick={() => meta && meta.current_page > 1 && setPage(page - 1)}
            className='absolute opacity-95 hover:opacity-100 transform -translate-y-5 w-10 h-10 flex-center rounded-full top-1/2 -left-4 bg-white shadow'>
            <FaChevronLeft />
          </button>

          <button
            onClick={() =>
              meta &&
              meta.current_page < meta.last_page &&
              setPage(meta.current_page + 1)
            }
            className='absolute opacity-95 hover:opacity-100 transform -translate-y-5 w-10 h-10 flex-center rounded-full top-1/2 -right-4 bg-white shadow'>
            <FaChevronRight />
          </button>
        </div>
      </div>
    </HotKeys>
  );
}
