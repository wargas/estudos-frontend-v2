import { useQuery } from 'react-query';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import {
  PageHeader,
  Relogio
} from '../../shared/components';
import CadernoStat from '../../shared/components/CadernoStat';
import {
  Aula
} from '../../shared/interfaces';
import AulaService from '../../shared/services/AulaService';

export default function AulaDetalhe() {
  const { aula_id = 0, caderno_id } = useParams<{ aula_id: string, caderno_id: string }>();
  const navigate = useNavigate();

  const { data: aula, isLoading } = useQuery<Aula>(['aula', aula_id], () =>
    AulaService.getAulaById(aula_id, { withMeta: true, withDisciplina: true })
  );

  return (
    <div>
      <PageHeader
        backButton={true}
        isLoading={isLoading}
        title={`${String(aula?.ordem).padStart(2, '0')} - ${aula?.name}`}
        subtitle={`${aula?.disciplina?.name} / ${aula?.meta.questoes_count} questões`}
        onBackPress={() => {
          navigate(`/disciplinas/${aula?.disciplina_id}${caderno_id ? `/aulas/${aula_id}` : ''}`);
        }}>
          {!!caderno_id && <CadernoStat caderno_id={caderno_id} />}
        {!!aula && <Relogio aula={aula} />}
      </PageHeader>
      <Outlet />
    </div>
  );
}
