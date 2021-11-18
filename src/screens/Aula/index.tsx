import { useEffect, useState } from 'react';
import { FaChartBar, FaCheck, FaEdit, FaSync } from 'react-icons/fa';
import { useHistory, useParams } from 'react-router';
import Api from '../../shared/Api';
import { useDrawer } from '../../shared/components/Drawer';
import { EditQuestao } from '../../shared/components/EditQuestoes';
import { Estatisticas } from '../../shared/components/Estatisticas';
import { PageHeader } from '../../shared/components/PageHeader';
import { QuestaoItem } from '../../shared/components/QuestaoItem';
import { Relogio } from '../../shared/components/Relogio';
import { Aula } from '../../shared/interfaces';

type Params = {
  disciplina_id: string;
  questao_id: string;
  aula_id: string;
};

export function AulaDetail() {
  const [aula, setAula] = useState<Aula>();
  const params = useParams<Params>();
  const history = useHistory();
  const [status, setStatus] = useState('');
  const openDrawer = useDrawer();

  useEffect(() => {
    loadAula();
  }, []);

  async function loadAula() {
    setStatus('loading:aula');
    try {
      const { data } = await Api.get<Aula>(`aulas/${params.aula_id}`);

      setAula(data);
    } catch (error) {}
    setStatus('');
  }

  return (
    <div>
      <PageHeader
        isLoading={status === 'loading:aula'}
        backButton={!!aula}
        onBackPress={() => {
          params.questao_id
            ? history.push(
                `/disciplinas/${params.disciplina_id}/aula/${params.aula_id}`
              )
            : history.push(`/disciplinas/${params.disciplina_id}`);
        }}
        title={
          !!aula?.id
            ? `${String(aula?.ordem).padStart(2, '0')} - ${aula?.name}`
            : ''
        }
        subtitle={`${aula?.questoes.length || 0} questões`}>
        {!!aula && <Relogio aula={aula} />}
      </PageHeader>

      <div>
        {!params.questao_id && (
          <div className='bg-white rounded shadow-sm overflow-x-hidden'>
            <div className='flex p-3 border-b gap-3'>
              <button
                onClick={() => openDrawer(Estatisticas, { aula_id: aula?.id })}
                className='text-primary-600 border hover:shadow-sm transition-all text-sm flex-center gap-2 px-5 h-9 rounded-full ml-auto'>
                <FaChartBar />
                <span>Estatísticas</span>
              </button>
              <button
                onClick={() =>
                  openDrawer(EditQuestao, { aula_id: aula?.id }, (result) => {
                    if (result) {
                      loadAula();
                    }
                  })
                }
                className='text-primary-600 border hover:shadow-sm transition-all text-sm flex-center gap-2 px-5 h-9 rounded-full'>
                <FaEdit />
                <span>Editar Questões</span>
              </button>
              <button
                onClick={() =>
                  history.push(
                    `/disciplinas/${params.disciplina_id}/aula/${params.aula_id}/questao/${aula?.questoes[0].id}`
                  )
                }
                className='text-primary-600 border hover:shadow-sm transition-all text-sm flex-center gap-2 px-5 h-9 rounded-full'>
                <FaCheck />
                <span>Iniciar Questões</span>
              </button>
              <button
                onClick={() => loadAula()}
                className='px-5 text-primary-600 border text-sm rounded-full'>
                <FaSync />
              </button>
            </div>

            <div>
              {status === 'loading:aula' &&
                Array(20)
                  .fill(1)
                  .map((_, i) => <SkeletonQuestao key={i} />)}
              {aula?.questoes.map((questao) => (
                <div
                  onClick={() =>
                    history.push(`${questao.aula_id}/questao/${questao.id}`)
                  }
                  key={questao?.id}
                  className='px-5 py-3 cursor-pointer overflow-hidden hover:bg-gray-100 border-gray-50 flex border-b'>
                  <div
                    className='w-10 h-10 bg-white flex-center mr-3 rounded-full border'
                    title={questao?.banca?.name}>
                    <img
                      className='w-8 h-8 rounded-full'
                      src={questao?.banca?.image_url}
                      alt=''
                    />
                  </div>
                  <div className='flex-1'>
                    <b>{questao.header}</b> <br />
                    <span className='text-sm text-gray-500'>
                      {questao.texto.substr(0, 100)}...
                    </span>
                  </div>
                  <div className='text-xs text-gray-50 h-4 flex-center px-2 rounded-full bg-primary-500'>
                    {questao.alternativas.length}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!!params.questao_id && aula?.questoes && (
          <QuestaoItem questoes={aula?.questoes.map((item) => item.id)} />
        )}
      </div>
    </div>
  );
}

function SkeletonQuestao() {
  return (
    <div className='flex gap-3 px-5 py-3 border-b border-gray-50'>
      <div className='w-10 h-10 rounded-full bg-gray-200'></div>
      <div className='flex-1 flex flex-col gap-1'>
        <div className='h-4 w-48 bg-gray-200'></div>
        <div className='h-2 w-96 bg-gray-200'></div>
      </div>
      <div>
        <div className='h-4 w-6 rounded-full bg-gray-200'></div>
      </div>
    </div>
  );
}
