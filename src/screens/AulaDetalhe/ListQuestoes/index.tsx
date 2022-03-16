import querystring from 'query-string';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BiLoaderAlt } from 'react-icons/bi';
import {
  FaCheck,
  FaChevronLeft,
  FaChevronRight,
  FaEdit,
  FaSync,
  FaTrash,
  FaUndo
} from 'react-icons/fa';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  DeleteQuestao,
  EditQuestao,
  Estatisticas,
  Markdown,
  useDrawer
} from '../../../shared/components';
import { useModal } from '../../../shared/components/Modal';
import QuestaoStates from '../../../shared/components/QuestaoStates';
import {
  Paginate,
  PaginateMeta,
  Questao,
  Respondida
} from '../../../shared/interfaces';
import QuestaoService from '../../../shared/services/QuestaoService';
import AlternativaItem from './AlternativaItem';
import styles from './ListQuestoes.module.css';
import ShowComentarios from './ShowComentarios';

const ListQuestoes: FC = () => {
  const { aula_id = 0, caderno_id = '' } =
    useParams<{ aula_id: string; caderno_id: string }>();
  const [questao, setQuestao] = useState<Questao>();
  const [meta, setMeta] = useState<PaginateMeta>();
  const [riscadas, setRiscadas] = useState<string[]>([]);
  const [marcada, setMarcada] = useState('');
  const [respondida, setRespondida] = useState<Respondida>();

  const btnResponder = useRef<HTMLButtonElement>(null);

  const navigate = useNavigate();
  const openDrawerEditQuestao = useDrawer(EditQuestao, (retorno) => {
    if (retorno) {
      refetchQuestao();
    }
  });

  const openDrawerEstatisticas = useDrawer(Estatisticas, () => {});

  const openModal = useModal(DeleteQuestao, (resp: { id: number }) => {
    if (resp) {
      if (meta?.current_page === meta?.last_page) {
        prev();
      } else {
        refetchQuestao();
      }
    }
  });

  const { search, pathname } = useLocation();

  const page = useMemo<number>(() => {
    return Number(querystring.parse(search).page) || 1;
  }, [search]);

  function next() {
    if (meta && page < meta?.last_page) {
      navigate(`${pathname}?page=${page + 1}`);
    } else {
      navigate(`${pathname}?page=1`);
    }
  }

  function prev() {
    if (page > 1) {
      navigate(`${pathname}?page=${page - 1}`);
    } else if (!!meta?.last_page) {
      navigate(`${pathname}?page=${meta?.last_page}`);
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

  useHotkeys('enter', (ev) => {
    btnResponder.current?.click();

    ev.preventDefault();
  });

  useHotkeys('ctrl+z', () => {
    mutateRespondida.mutate();
  });

  useHotkeys(
    'left',
    () => {
      prev();
    },
    [page]
  );

  useHotkeys(
    'right',
    () => {
      next();
    },
    [meta?.last_page, page]
  );

  const queryClient = useQueryClient();

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
      onSuccess: () => {
        queryClient.refetchQueries(['caderno', caderno_id]);
      },
    }
  );

  const mutateQuestao = useMutation<Respondida>(
    () => QuestaoService.responder(questao?.id || 0, caderno_id, marcada),
    {
      onSuccess: (data) => {
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
      setRespondida(respondidas.find((res) => caderno_id === res.caderno_id));
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
    <div className={styles.questaoWrapper}>
      <div className={styles.questaoHeader}>
        <div title={questao?.banca?.name} className={styles.bancaImageWrapper}>
          {questao?.banca && (
            <img src={questao.banca.image_url} alt={questao.banca.name} />
          )}
        </div>
        <div className={styles.questaoTitle}>
          <h1>{questao && questao.header}</h1>
        </div>
        <div className='ml-auto'></div>
        <QuestaoStates respondidas={respondidas || []} />

        {isLoadingResponidas && (
          <button className={styles.actionButton}>
            <AiOutlineLoading3Quarters className={styles.loadingRespondidas} />
          </button>
        )}
        {!!respondida?.id && !isLoadingResponidas && (
          <button
            onClick={() => mutateRespondida.mutate()}
            className={styles.actionButton}>
            <FaUndo />
          </button>
        )}
        
        <button
          onClick={() => refetchQuestao()}
          className={styles.actionButton}>
          <FaSync />
        </button>
        <button
          onClick={() => openModal({ id: questao?.id })}
          className={styles.actionButton}>
          <FaTrash />
        </button>
        <button
          onClick={() =>
            openDrawerEditQuestao({
              aula_id: questao?.aula_id,
              id: questao?.id,
            })
          }
          className={styles.actionButton}>
          <FaEdit />
        </button>
        <button
          onClick={() => openDrawerEstatisticas({ aula_id: aula_id })}
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
          onClick={() => meta?.last_page && page < meta.last_page && next()}
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
  );
};

export default ListQuestoes;
