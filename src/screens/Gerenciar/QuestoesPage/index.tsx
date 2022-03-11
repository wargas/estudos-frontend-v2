import { DateTime } from 'luxon';
import { useQuery } from 'react-query';
import { PageHeader } from '../../../shared/components/PageHeader';
import Table from '../../../shared/components/Table';
import { Caderno } from '../../../shared/interfaces';
import CadernoService from '../../../shared/services/CadernoService';

const columns = [
  {
    id: 'inicio',
    Header: 'INICIO',
    Cell: ({ row }: any) => <HeaderData data={row.values.inicio} />,
    accessor: 'inicio',
  },
  {
    id: 'fim',
    Header: 'FIM',
    Cell: ({ row }: any) => <HeaderData data={row.values.fim} />,
    accessor: 'fim',
  },
  {
    id: 'acertos',
    Header: 'ACERTOS',
    accessor: 'acertos',
  },
  {
    id: 'erros',
    Header: 'ERROS',
    accessor: 'erros',
  },
  {
    id: 'total',
    Header: 'Total',
    accessor: 'total',
  },
];

function HeaderData({ data }: any) {
  return <span>{DateTime.fromISO(data).toFormat('dd/MM/yyyy')}</span>;
}

export default function QuestoesPage() {
  const { data } = useQuery<Caderno[]>(['cadernos'], () =>
    CadernoService.getByDisciplina(1668)
  );

  return (
    <div>
      <PageHeader title='Gerenciar Questões' />
      <div className='bg-white shadow'>
        <Table data={data || []} columns={columns} />
      </div>
    </div>
  );
}
