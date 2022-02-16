import { AxiosResponse } from 'axios';
import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import {
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaComment,
  FaEdit,
  FaSync,
  FaTimes,
  FaTrash
} from 'react-icons/fa';
import { useHistory, useParams } from 'react-router';
import { toast } from 'react-toastify';
import Api from '../../Api';
import {
  Comentario as ComentarioInterface,
  Questao,
  Respondida
} from '../../interfaces';
import { Comentario } from '../Comentario';
import { DeleteQuestao } from '../DeleteQuestao';
import { useDrawer } from '../Drawer';
import { EditQuestao } from '../EditQuestao';
import { Estatisticas } from '../Estatisticas';
import { Markdown } from '../Markdown';
import { useModal } from '../Modal';
import { useQueue } from '../QueueHook';
import { QuestaoSkeleton } from './QuestaoSkeleton';
import { QuestaoStates } from './QuestaoStates';

type Params = {
  disciplina_id: string;
  questao_id: string;
  aula_id: string;
};

type Props = { questoes: number[] };

export function QuestaoItem({ questoes }: Props) {
  const [questao, setQuestao] = useState<Questao>();
  const [loading, setLoading] = useState(false);
  const [loadingResponder, setLoadingResponder] = useState(false);
  const [riscadas, setRiscadas] = useState<string[]>([]);
  const [marcada, setMarcada] = useState('');
  const [respondida, setRespondida] = useState<Respondida>();
  const [comentario, setComentario] = useState<ComentarioInterface>();

  const params = useParams<Params>();
  const history = useHistory();
  const { current, next, prev, hasNext, hasPrev, items, goto, remove } =
    useQueue<number>(questoes);
  const openDrawer = useDrawer();
  const openModal = useModal();

  useEffect(() => {
    if (current) history.push(current.toString());
  }, [current]);

  useEffect(() => {
    loadQuestao();
    loadComentario();
    setRiscadas([]);
    setMarcada('');
    if (current.toString() !== params.questao_id) {
      goto(Number(params.questao_id));
    }
  }, [params.questao_id]);

  useEffect(() => {
    if (questao) {
      const dtHoje = DateTime.local().toSQLDate();
      const respondidaHoje = questao.respondidas.find(
        (item) => DateTime.fromISO(item.horario).toSQLDate() === dtHoje
      );

      setRespondida(respondidaHoje);
    }
  }, [questao]);

  useEffect(() => {
    document.addEventListener('keydown', handlerPressKey);

    return () => {
      document.removeEventListener('keydown', handlerPressKey);
    };
  }, [params.questao_id, questao, marcada, riscadas, respondida]);

  function handlerPressKey(event: any) {
    const targetsIgnore = new Set(['textarea', 'text']);
    const letras = new Set(questao?.alternativas.map((alt) => alt.letra));
    const keysLineners = new Set(['ArrowRight', 'ArrowLeft', 'Enter']);

    if (targetsIgnore.has(event.target.type)) {
      return;
    }

    if (keysLineners.has(event.key)) {
      if (event.key === 'ArrowRight') {
        next();
      }

      if (event.key === 'ArrowLeft') {
        prev();
      }

      if (event.key === 'Enter') {
        handlerResponder();
      }

      event.preventDefault();
    }

    if (letras.has(event.key.toUpperCase()) && !event.ctrlKey) {
      if (event.shiftKey) {
        handlerRiscadas(event.key.toUpperCase());
      } else {
        handleMarcar(event.key.toUpperCase());
      }

      event.preventDefault();
    }
  }

  function handlerRiscadas(letra: string) {
    if (!!respondida) {
      return;
    }
    const itemsSet = new Set(riscadas);

    if (itemsSet.has(letra)) {
      itemsSet.delete(letra);
    } else {
      itemsSet.add(letra);
      if (marcada === letra) {
        setMarcada('');
      }
    }

    setRiscadas(Array.from(itemsSet));
  }

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

  async function loadQuestao() {
    setLoading(true);
    Api.get<Questao>(`questoes/${params.questao_id}`)
      .then(({ data }) => {
        setQuestao(data);
      })
      .catch(() => {
        toast.warning('Ocorreu um erro ao buscar a questão');
      })
      .finally(() => {
        setLoading(false);
      });
  }

  async function handlerResponder() {
    if (marcada === '') {
      return;
    }
    setLoadingResponder(true);
    Api.post<any, AxiosResponse<Respondida>>('questoes/responder', {
      questao_id: questao?.id,
      resposta: marcada,
    })
      .then(({ data }) => {
        setMarcada('');
        setRiscadas([]);
        setQuestao((item) => {
          if (item)
            return {
              ...item,
              respondidas: [...(item?.respondidas || []), data],
            };
        });
      })
      .catch(() => {
        toast.error('Ocorreu um erro ao enviar a resposta');
      })
      .finally(() => {
        setLoadingResponder(false);
      });
  }

  async function loadComentario() {
    const { data } = await Api.get<ComentarioInterface>(
      `comentarios/${params.questao_id}`
    );

    setComentario(data);
  }

  return (
    <div className='bg-white rounded shadow-sm relative'>
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
        <QuestaoStates respondidas={questao?.respondidas || []} />
        <div className='ml-auto'></div>
        <button
          onClick={() => loadQuestao()}
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
                  remove(current);
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
                  loadQuestao();
                }
              }
            )
          }
          className='hover:bg-gray-100 text-gray-600 transition-all w-10 h-10 flex-center rounded-full'>
          <FaEdit />
        </button>
        <button
          onClick={() =>
            openDrawer(Estatisticas, { aula_id: params.aula_id }, () => {})
          }
          className=' text-gray-600 font-bold px-3 h-10 w-32 rounded-full bg-gray-50 hover:bg-gray-100'>
          {items.indexOf(Number(params.questao_id)) + 1} de {items.length}
        </button>
      </div>
      <div className={'min-h-full relative'}>
        {loading && (
          <div className='absolute bg-white inset-0'>
            <QuestaoSkeleton />
          </div>
        )}
        <div className='p-5 px-8'>
          <div className='flex mb-2'>
            <h1 className='font-bold text-lg text-gray-900'>
              {questao?.header}
            </h1>
          </div>
          <div className='text-lg enunciado  text-justify'>
            <Markdown markdown={questao?.texto || ''} />
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
        </div>
      </div>
      <div className='border-t p-5 flex items-center'>
        <button
          onClick={handlerResponder}
          disabled={marcada === '' || loadingResponder || !!respondida}
          className='text-white disabled:opacity-50 flex gap-3 flex-center bg-primary-600 hover:bg-primary-700 transition-all rounded-full h-9 px-5'>
          {loadingResponder ? (
            <BiLoaderAlt className='animate-spin text-primary-600' />
          ) : (
            <FaCheck />
          )}
          <span> Responder</span>
        </button>
        <div className='ml-auto'></div>
      </div>

      <div style={{minHeight: 150}} className='p-5 border-t flex flex-col'>
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
            onClick={() => openDrawer(Comentario, { id: questao?.id }, loadComentario)}
            className='text-white ml-auto  flex gap-3 flex-center bg-primary-600 hover:bg-primary-700 transition-all rounded-full h-9 px-5'>
            <FaComment />
            <span>Editar</span>
          </button>
        </div>
      </div>

      {hasNext && (
        <button
          onClick={next}
          className='absolute opacity-95 hover:opacity-100 transform -translate-y-5 w-10 h-10 flex-center rounded-full top-1/2 -right-4 bg-white shadow'>
          <FaChevronRight />
        </button>
      )}
      {hasPrev && (
        <button
          onClick={prev}
          className='absolute opacity-95 hover:opacity-100 transform -translate-y-5 w-10 h-10 flex-center rounded-full top-1/2 -left-4 bg-white shadow'>
          <FaChevronLeft />
        </button>
      )}
    </div>
  );
}
