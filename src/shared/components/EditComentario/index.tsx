import { AxiosResponse } from 'axios';
import { useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { BiLoaderAlt } from 'react-icons/bi';
import {
  FaCheck,
  FaChevronLeft,
  FaEdit,
  FaEnvelopeOpenText
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import Api from '../../Api';
import { Comentario as IComentario, Questao } from '../../interfaces';
import addTags from '../../services/AddTag';
import { DrawerComponentProps } from '../Drawer';
import { Markdown } from '../Markdown';
import styles from './Style.module.css';


export function EditComentario({
  data,
  setWidth = () => {},
  closeDrawer = () => {},
}: DrawerComponentProps) {
  const [comentario, setComentario] = useState<IComentario>({} as IComentario);
  const [allowEdit, setAllowEdit] = useState(true);
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setWidth('md');
    loadComentario();
  }, []);

  async function loadComentario() {
    setLoading(true);
    Api.get<IComentario>(`comentarios/${data.id}`)
      .then(({ data }) => setComentario(data))
      .finally(() => {
        setLoading(false);
      });
  }

  async function loadQuestao() {
    const response = await Api.get<Questao>(`questoes/${data.id}`)

    const questao = response.data

    const texto = `${comentario.texto}\n\n${questao.texto}\n\n${questao.alternativas.map(alt => `${alt.letra}) ${alt.conteudo}`).join('\n\n')}`

    setComentario({...comentario, texto})
  }

  async function saveComentario() {
    setLoading(true);
    Api.post<any, AxiosResponse<IComentario>>(`comentarios/${data.id}`, {
      texto: comentario?.texto,
    })
      .then(({ data }) => {
        setComentario(data);
        setAllowEdit(false);
        toast.success('O comentário está salvo!');
      })
      .catch(() => {
        toast.error('Erro ao salvar o comentário');
      })
      .finally(() => setLoading(false));
  }

  useHotkeys(
    'ctrl+b, ctrl+i, ctrl+u, ctrl+s, ctrl+l, ctrl+1',
    (ev: KeyboardEvent) => {

      ev.preventDefault();

      if (textareaRef.current) {
        const { selectionEnd, selectionStart } = textareaRef.current;

          setComentario((_coment: IComentario) => {
           const texto = addTags(_coment.texto, selectionStart, selectionEnd, ev.key)
            return {..._coment, texto}
          }
          
        );
      }
    },
    {
      enableOnTags: ['TEXTAREA'],
      filterPreventDefault: true,
    },
    [textareaRef, comentario]
  );

  return (
    <div className={styles.wrapper}>
      <div className='h-14 bg-primary-600 flex items-center'>
        <button onClick={() => closeDrawer(null)} className='px-5 text-white'>
          <FaChevronLeft />
        </button>
      </div>
      <div className='flex-1 flex relative bg-gray-50'>
        {loading && (
          <div className='absolute bg-white inset-0 flex-center'>
            <BiLoaderAlt className='text-6xl text-primary-600 animate-spin' />
          </div>
        )}
        {!allowEdit && (
          <div className='p-5'>
            <Markdown markdown={comentario?.texto || ''} />
          </div>
        )}
        {allowEdit && (
          <textarea
            ref={textareaRef}
            onChange={(ev) =>
              setComentario({
                ...(comentario as IComentario),
                texto: ev.target.value,
              })
            }
            value={comentario?.texto}
            className='flex-1 p-5 resize-none focus:outline-none'></textarea>
        )}
      </div>
      <div className='flex bg-gray-50 items-center h-14 border-t px-5 gap-2'>
        <button
          onClick={loadQuestao}
          className='border flex items-center gap-2 text-sm h-9 text-primary-600 shadow-sm px-5 rounded-full'>
          <FaEnvelopeOpenText />
          <span>Enunciado</span>
        </button>
        <div className='ml-auto'></div>
        {!allowEdit && (
          <button
            onClick={() => setAllowEdit(true)}
            className='border flex items-center gap-2 h-9 text-sm text-primary-600 shadow-sm px-5 rounded-full'>
            <FaEdit />
            <span>Editar</span>
          </button>
        )}
        {allowEdit && (
          <button
            onClick={saveComentario}
            className='border flex items-center gap-2 text-sm h-9 text-primary-600 shadow-sm px-5 rounded-full'>
            <FaCheck />
            <span>Salvar</span>
          </button>
        )}
      </div>
    </div>
  );
}
