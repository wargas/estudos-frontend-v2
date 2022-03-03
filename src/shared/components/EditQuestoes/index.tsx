import axios from 'axios';
import { ClipboardEvent, useEffect, useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import { FaChevronLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Api from '../../Api';
import { QuestoesToMarkdown } from '../../Helpers';
import { Questao } from '../../interfaces';
import { DrawerComponentProps } from '../Drawer';

export function EditQuestoes({
  data,
  closeDrawer = () => {},
  setWidth = () => {},
}: DrawerComponentProps) {
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (questoes) {
      setText(QuestoesToMarkdown(questoes, true));
    }
  }, [questoes]);

  useEffect(() => {
    setWidth('md');
    loadQuestoes();
  }, []);

  async function loadQuestoes() {
    setLoading(true);
    Api.get<Questao[]>(`aulas/${data.aula_id}/questoes`)
      .then(({ data }) => setQuestoes(data))
      .finally(() => setLoading(false));
  }

  async function handlerSalvar() {
    setLoading(true);
    Api.post(`questoes/editar-lote`, {
      aula_id: data.aula_id,
      markdown: text,
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
        `https://api.imgbb.com/1/upload?key=f6348ee2d87ec6e0e0bf05556592ca86`,
        formData
      );

      const parte1 = value.substr(0, selectionStart);
      const parte2 = value.substr(selectionEnd);

      const imgTag = `![${data.data.title}](${data.data.url})`

      setText(`${parte1}${imgTag}${parte2}`);

      target.setSelectionRange(selectionStart + imgTag.length, selectionStart + imgTag.length);
      ev.preventDefault();
    }
  }

  return (
    <div className='flex flex-col h-screen'>
      <div className='h-14 bg-primary-600 flex items-center'>
        <button
          onClick={() => closeDrawer(null)}
          className='text-white px-5 flex'>
          <FaChevronLeft />
        </button>
        <h1 className='text-white'>Editar Questão</h1>
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
          onChange={(ev) => setText(ev.target.value)}
          className='flex-1 p-5 m-5 text-base scroll focus:outline-none resize-none bg-gray-50 rounded shadow-sm border'
        />

        <div className='flex justify-between pb-3 px-5'>
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
