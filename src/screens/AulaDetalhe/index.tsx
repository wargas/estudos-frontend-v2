import { DateTime } from 'luxon';
import querystring from 'query-string';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiLoaderAlt } from 'react-icons/bi';
import {
  FaCheck,
  FaChevronLeft,
  FaChevronRight, FaEdit,
  FaSync, FaTrash,
  FaUndo
} from 'react-icons/fa';
import { useMutation, useQuery } from 'react-query';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  DeleteQuestao, EditQuestao,
  Estatisticas,
  Markdown,
  PageHeader, Relogio,
  useDrawer
} from '../../shared/components';
import { useModal } from '../../shared/components/Modal';
import QuestaoStates from '../../shared/components/QuestaoStates';
import {
  Aula, Paginate,
  PaginateMeta,
  Questao,
  Respondida
} from '../../shared/interfaces';
import AulaService from '../../shared/services/AulaService';
import QuestaoService from '../../shared/services/QuestaoService';
import AlternativaItem from './AlternativaItem';
import styles from './AulaDetalhe.module.css';
import ShowComentarios from './ShowComentarios';


export default function AulaDetalhe() {
  const { aula_id } = useParams<{ aula_id: string }>();
  const [questao, setQuestao] = useState<Questao>();
  const [meta, setMeta] = useState<PaginateMeta>();
  const [riscadas, setRiscadas] = useState<string[]>([]);
  const [marcada, setMarcada] = useState('');
  const [respondida, setRespondida] = useState<Respondida>();
  
  const btnResponder = useRef<HTMLButtonElement>(null);

  const { push } = useHistory();
  const openDrawer = useDrawer();
  const openModal = useModal();

  const { search, pathname } = useLocation()

  const page = useMemo<number>(() => {
    return Number(querystring.parse(search).page) || 1
  }, [search])

  function next() {
    if(meta && meta?.current_page < meta?.last_page) {
      push(`${pathname}?page=${page+1}`)
    }
  }

  function prev() {
    if(meta && meta?.current_page > 1) {
      push(`${pathname}?page=${page-1}`)
    }
  }

  useHotkeys(
    'a, b, c, d, e',
    ({ key }) => {
      handleMarcar(key.toLocaleUpperCase());
    },
    [marcada, respondida]
  );

  useHotkeys(
    'shift+a, shift+b, shift+c, shift+d, shift+e',
    ({ key }) => {
      handlerRiscadas(key.toLocaleUpperCase());
    },
    [marcada, respondida]
  );

  useHotkeys('enter', () => {
    btnResponder.current?.click();
  });

  useHotkeys('ctrl+z', () => {
    mutateRespondida.mutate();
  });

  useHotkeys(
    'left',
    () => {
      // setPage((p) => (p > 1 ? p - 1 : 1));
      prev()
    },
    [page]
  );

  useHotkeys(
    'right',
    () => {
      // setPage((p) => (meta?.last_page && p < meta?.last_page ? p + 1 : 1));
      next()
    },
    [meta?.last_page, page]
  );

  const { data: aula, isLoading } = useQuery<Aula>(['aula', aula_id], () =>
    AulaService.getAulaById(aula_id, { withMeta: true, withDisciplina: true })
  );

  const {
    data: questoesQuery,
    refetch: refetchQuestao,
    isLoading: isLoadingQuestao,
  } = useQuery<Paginate<Questao>>(
    ['questao', page, aula_id],
    () => QuestaoService.getQuestioesByAulaId(aula_id, page, 1),
    {
      onError: () => {
        toast.error('Erro ao buscar questões');
      },
    }
  );

  const {
    data: respondidas,
    refetch: refetchRespondidas,
    isLoading: isLoadingResponidas,
  } = useQuery<Respondida[]>(
    ['respondidas', questao?.aula_id, questao?.id],
    ({ queryKey }) =>
      QuestaoService.getRespondidas(Number(queryKey[1]), Number(queryKey[2])),
    {
      onError: () => {
        toast.error('Erro ao buscar questões respondidas');
      },
    }
  );

    const mutateQuestao = useMutation<Respondida>(
    () => QuestaoService.responder(questao?.id || 0, marcada),
    {
      onSuccess: (data) => {
        refetchRespondidas()
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
    setRespondida({} as Respondida);
  }, [page]);

  function handleMarcar(letra: string) {
    if (!!respondida) {
      return;
    }

    setMarcada((_marcada) => {
      if (_marcada === letra) {
        return '';
      }
      return letra;
    });
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

  return (
    <div>
      <PageHeader
        backButton={true}
        isLoading={isLoading}
        title={`${String(aula?.ordem).padStart(2, '0')} - ${aula?.name}`}
        subtitle={`${aula?.disciplina?.name} / ${aula?.meta.questoes_count} questões`}
        onBackPress={() => {
          push(`/disciplinas/${aula?.disciplina_id}`);
        }}>
        {!!aula && <Relogio aula={aula} />}
      </PageHeader>
      <div className={styles.questaoWrapper}>
        <div className={styles.questaoHeader}>
          <div
            title={questao?.banca?.name}
            className={styles.bancaImageWrapper}>
            {questao?.banca && (
              <img src={questao.banca.image_url} alt={questao.banca.name} />
            )}
          </div>
          <QuestaoStates respondidas={respondidas || []} />
          {isLoadingResponidas && (
            <button className={styles.actionButton}>
              <AiOutlineLoading3Quarters
                className={styles.loadingRespondidas}
              />
            </button>
          )}
          {!!respondida?.id && !isLoadingResponidas && (
            <button
              onClick={() => mutateRespondida.mutate()}
              className={styles.actionButton}>
              <FaUndo />
            </button>
          )}
          <div className='ml-auto'></div>
          <button
            onClick={() => refetchQuestao()}
            className={styles.actionButton}>
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
                      // setPage(page > 1 ? page - 1 : 1);
                      prev()
                    } else {
                      refetchQuestao();
                    }
                  }
                }
              )
            }
            className={styles.actionButton}>
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
            className={styles.actionButton}>
            <FaEdit />
          </button>
          <button
            onClick={() =>
              openDrawer(Estatisticas, { aula_id: aula_id })
            }
            className={styles.actionButtonEstatisticas}>
            {page} de {meta?.last_page}
          </button>
        </div>
        <div className={styles.questaoContent}>
          {isLoadingQuestao && (
            <div className={styles.loadingQuestao}>
              <AiOutlineLoading3Quarters />
            </div>
          )}
          {questao && (
            <>
              <div className={styles.questaoTitle}>
                <h1>
                  {questao.header}
                </h1>
              </div>
              <div className={styles.enunciado}>
                <Markdown markdown={questao.texto} />
              </div>
              <div className={styles.alternativasContent}>
                {questao?.alternativas.map((alternativa) => (
                  <AlternativaItem
                    onDelete={handlerRiscadas}
                    onSelectLetra={handleMarcar}
                    key={alternativa.letra}
                    alternativa={alternativa}
                    riscadas={riscadas}
                    respondida={respondida}
                    marcada={marcada}
                  />
                ))}
              </div>
            </>
          )}
          <button
          onClick={() => meta && meta.current_page > 1 && prev()}
          className={styles.pageButtonLeft}>
          <FaChevronLeft />
        </button>

        <button
          onClick={() =>
            meta &&
            meta.current_page < meta.last_page &&
            next()
          }
          className={styles.pageButtonRight}>
          <FaChevronRight />
        </button>
        </div>

        <div className={styles.footer}>
          <button
            ref={btnResponder}
            onClick={handlerResponder}
            disabled={marcada === '' || mutateQuestao.isLoading || !!respondida}
            className={styles.btnResponder}>
            {mutateQuestao.isLoading ? (
              <BiLoaderAlt className={styles.loading} />
            ) : (
              <FaCheck />
            )}
            <span> Responder</span>
          </button>
        </div>
        <ShowComentarios show={!!respondida} questao_id={questao?.id || 0} />
      </div>
    </div>
  );
}