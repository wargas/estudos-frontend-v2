import axios from 'axios';
import { ClipboardEvent, useEffect, useRef, useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { BiLoaderAlt } from 'react-icons/bi';
import { FaChevronLeft, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Api from '../../Api';
import { QuestoesToMarkdown } from '../../Helpers';
import { Questao } from '../../interfaces';
import addTags from '../../services/AddTag';
import { DrawerComponentProps } from '../Drawer';

export function EditQuestao({
  data,
  closeDrawer = () => {},
  setWidth = () => {},
}: DrawerComponentProps) {
  const [questao, setQuestao] = useState<Questao>();
  const [gabarito, setGabarito] = useState('');
  const [showGabarito, setShowGabarito] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (questao) {
      setText(QuestoesToMarkdown([questao], false));
      setGabarito(questao.gabarito);
    }
  }, [questao]);

  useEffect(() => {
    setWidth('md');
    loadQuestao();
  }, []);

  async function loadQuestao() {
    setLoading(true);
    Api.get<Questao>(`questoes/${data.id}`)
      .then(({ data }) => setQuestao(data))
      .finally(() => setLoading(false));
  }

  async function handlerSalvar() {
    setLoading(true);
    Api.post(`questoes/editar-lote`, {
      aula_id: data.aula_id,
      markdown: `${text}\n***\n${gabarito}`,
    })
      .then(({ data }) => {
        toast.success(`Dados da questão alterados`);
        closeDrawer(data);
      })
      .finally(() => setLoading(false));
  }

  async function handlerPaste(ev: ClipboardEvent<HTMLTextAreaElement>) {
    const files = ev.clipboardData.files;
    const { selectionStart, selectionEnd, value } = ev.currentTarget;

    const target = ev.currentTarget;
    const formData = new FormData();

    if (files.length > 0) {
      const name = `${files[0].lastModified}-${files[0].name}`;

      formData.append('image', files[0]);
      formData.append('name', name);

      const { data } = await axios.post<any>(
        `https://api.imgbb.com/1/upload?key=13157499d80a2ace97a7a5c6a2e7702a`,
        formData
      );

      const parte1 = value.substr(0, selectionStart);
      const parte2 = value.substr(selectionEnd);

      const imgTag = `![${data.data.title}](${data.data.url})`;

      setText(`${parte1}${imgTag}${parte2}`);

      target.setSelectionRange(
        selectionStart + imgTag.length,
        selectionStart + imgTag.length
      );
      ev.preventDefault();
    }
  }

  useHotkeys(
    'ctrl+b, ctrl+i, ctrl+u, ctrl+s, ctrl+l, ctrl+1',
    (ev: KeyboardEvent) => {
      if (textareaRef.current) {
        const { selectionEnd, selectionStart } = textareaRef.current;

          setText((_text) =>
          addTags(_text, selectionStart, selectionEnd, ev.key.toLocaleLowerCase())
        );
      }

      console.log(ev.key)

      ev.preventDefault();
    },
    {
      enableOnTags: ['TEXTAREA'],
      filterPreventDefault: true,
    },
    [textareaRef, text]
  );

  return (
    <div className='flex flex-col h-screen'>
      <div className='h-14 bg-primary-600 flex items-center'>
        <button
          onClick={() => closeDrawer(null)}
          className='text-white px-5 flex'>
          <FaChevronLeft />
        </button>
        <h1 className='text-white'>Editar Questão Única</h1>
      </div>
      <div className='flex flex-col flex-1 relative'>
        {loading && (
          <div className='absolute inset-0 flex-center bg-white'>
            <BiLoaderAlt className='text-6xl text-primary-600 animate-spin' />
          </div>
        )}
        <textarea
          onPaste={handlerPaste}
          value={text}
          ref={textareaRef}
          onChange={(ev) => setText(ev.target.value)}
          className='flex-1 p-5 m-5 text-base scroll focus:outline-none resize-none bg-gray-50 rounded shadow-sm border'
        />

        <div className='flex justify-between pb-3 px-5'>
          <div className='bg-primary-100 rounded-full flex items-center px-5'>
            <span className='text-gray-400 mr-4'>Gabarito:</span>

            <input
              disabled={!showGabarito}
              type={showGabarito ? 'text' : 'password'}
              onChange={(e) =>
                setGabarito(String(e.target.value).toUpperCase()[0])
              }
              className='bg-transparent w-10 focus:outline-none'
              value={gabarito}
            />
            <button>
              <FaEye
                onClick={() => setShowGabarito(!showGabarito)}
                className='text-gray-600 mr-4'
              />
            </button>
          </div>
          <button
            onClick={handlerSalvar}
            className='bg-primary-600 ml-auto h-9 px-5 text-white rounded-full'>
            Salvar Questão
          </button>
        </div>
      </div>
    </div>
  );
}



