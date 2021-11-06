import { useEffect, useState } from 'react';
import { FaSync } from 'react-icons/fa';
import Api from '../../shared/Api';
import { ChartQuestoesPorDia } from '../../shared/components/Charts/ChartQuestoesPorDia';
import { ChartRanking } from '../../shared/components/Charts/ChartRanking';
import { ChartTempoPorDia } from '../../shared/components/Charts/ChartTempoPorDia';
import { PageHeader } from '../../shared/components/PageHeader';
import { DashboardDataItem } from '../../shared/interfaces';

export function Home() {
  const [data, setData] = useState<DashboardDataItem[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    Api.get('relatorios/dashboard').then(({ data }) => setData(data));
  }

  return (
    <div>
      <PageHeader title='Dashboard'>
        <button
          onClick={loadData}
          className='bg-white flex-center gap-2 text-primary-600 shadow-sm px-3 h-8 rounded-full'>
          <FaSync className='text-sm' />
          <span>Atualizar</span>
        </button>
      </PageHeader>

      <div className='grid grid-cols-12 gap-x-5'>
        <div className='flex gap-5 flex-col col-span-9'>
          <ChartTempoPorDia data={data} />
          <ChartQuestoesPorDia data={data} />
        </div>

        <ChartRanking data={data} />
      </div>
    </div>
  );
}
