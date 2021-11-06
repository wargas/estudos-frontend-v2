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
import { generatePath, useHistory, useParams } from 'react-router';
import { toast } from 'react-toastify';
import Api from '../../Api';
import { Questao, Respondida } from '../../interfaces';
import { Comentario } from '../Comentario';
import { DeleteQuestao } from '../DeleteQuestao';
import { useDrawer } from '../Drawer';
import { EditQuestao } from '../EditQuestoes';
import { Estatisticas } from '../Estatisticas';
import { Markdown } from '../Markdown';
import { useModal } from '../Modal';

type Params = {
  disciplina_id: string;
  questao_id: string;
  aula_id: string;
};

type Props = { questoes: number[] };

export function QuestaoItem({ questoes }: Props) {
  const [questao, setQuestao] = useState<Questao>();
  const [list, setList] = useState<number[]>(questoes);
  const [loading, setLoading] = useState(false);
  const [loadingResponder, setLoadingResponder] = useState(false);
  const [riscadas, setRiscadas] = useState<string[]>([]);
  const [marcada, setMarcada] = useState('');
  const [respondida, setRespondida] = useState<Respondida>();

  const params = useParams<Params>();
  const history = useHistory();
  const openDrawer = useDrawer();
  const openModal = useModal();

  useEffect(() => {
    loadQuestao();
    setRiscadas([]);
    setMarcada('');
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
        next(1);
      }

      if (event.key === 'ArrowLeft') {
        next(-1);
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

  function next(fator = 0) {
    const nextIndex = list.indexOf(Number(params.questao_id));
    const nextId = list[nextIndex + fator];

    if (nextId) {
      history.push(makeRoute(nextId));
    }
  }

  function makeRoute(questao_id: number) {
    return generatePath(
      '/disciplinas/:disciplina_id/aula/:aula_id/aula/:questao_id',
      {
        ...params,
        questao_id,
      }
    );
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
      .then(({ data, status }) => {
        if (status === 204) {
          const nextId = list.indexOf(Number(params.questao_id));

          history.push(makeRoute(list[nextId + 1]));

          setList(list.filter((item) => item !== Number(params.questao_id)));
        } else {
          setQuestao(data);
        }
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
        <div className='flex items-center gap-1'>
          {questao &&
            questao?.respondidas
              .filter((_, index, arr) => index >= arr.length - 10)
              .map((respondida) => (
                <div
                  key={respondida.id}
                  className={`${
                    respondida.acertou ? 'bg-green-500' : 'bg-red-500'
                  } w-4 h-2 rounded-full cursor-pointer`}></div>
              ))}
          {(questao?.respondidas.length || 0) < 10 &&
            Array(10 - (questao?.respondidas.length || 0))
              .fill('')
              .map((_, key) => (
                <div
                  key={key}
                  className={`bg-gray-200 w-4 h-2 rounded-full`}></div>
              ))}
        </div>
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
                  loadQuestao();
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
          {list.indexOf(Number(params.questao_id)) + 1} de {list.length}
        </button>
      </div>
      <div className={'min-h-full relative'}>
        {loading && (
          <div className='absolute bg-white inset-0'>
            {/* <BiLoaderAlt className='text-4xl text-primary-600 animate-spin' /> */}
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
        <button
          onClick={() => openDrawer(Comentario, { id: questao?.id })}
          className='text-white flex gap-3 flex-center bg-primary-600 hover:bg-primary-700 transition-all rounded-full h-9 px-5'>
          <FaComment />
          <span> Comentários</span>
        </button>
      </div>

      {!(list[list.length - 1] === Number(params.questao_id)) && (
        <button
          onClick={() => next(1)}
          className='absolute opacity-95 hover:opacity-100 transform -translate-y-5 w-10 h-10 flex-center rounded-full top-1/2 -right-4 bg-white shadow'>
          <FaChevronRight />
        </button>
      )}
      {!(list[0] === Number(params.questao_id)) && (
        <button
          onClick={() => next(-1)}
          className='absolute opacity-95 hover:opacity-100 transform -translate-y-5 w-10 h-10 flex-center rounded-full top-1/2 -left-4 bg-white shadow'>
          <FaChevronLeft />
        </button>
      )}
    </div>
  );
}

function QuestaoSkeleton() {
  return (
    <div className='py-5 px-8 flex animate-pulse flex-col gap-1'>
      <div className='h-6 bg-gray-200 w-1/3 rounded'></div>
      <div className='h-2'></div>
      <div className='h-6 bg-gray-200 w-3/4 rounded'></div>
      <div className='h-6 bg-gray-200 w-2/3 rounded'></div>
      <div className='h-6 bg-gray-200 w-2/3 rounded'></div>
      <div className='h-4'></div>
      <div className='flex gap-3'>
        <div className='h-10 w-10 bg-gray-200 rounded'></div>
        <div className="flex-1 flex gap-1 flex-col">
          <div className='h-4 bg-gray-200 w-1/3 rounded'></div>
          <div className='h-4 bg-gray-200 w-3/4 rounded'></div>
        </div>
      </div>
      <div className='h-2'></div>
      <div className='flex gap-3'>
        <div className='h-10 w-10 bg-gray-200 rounded'></div>
        <div className="flex-1 flex gap-1 flex-col">
          <div className='h-4 bg-gray-200 w-1/3 rounded'></div>
          <div className='h-4 bg-gray-200 w-3/4 rounded'></div>
        </div>
      </div>
    </div>
  );
}
