// import Chart from '../../Chart';

import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DateTime } from 'luxon';
import { useEffect, useRef } from 'react';
import { FaCheck } from 'react-icons/fa';
import { DashboardDataItem } from '../../interfaces';

Chart.register(...registerables);

type Props = {
  data: DashboardDataItem[];
};

export function ChartQuestoesPorDia({ data }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');

    if (ctx) {
      Chart.getChart(ctx)?.destroy();

      new Chart(ctx, chartConfig);
    }
  }, [canvasRef]);

  useEffect(() => {
    if (data.length) {
      updateChart();
    }
  }, [data]);

  function updateChart() {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      const chart = Chart.getChart(ctx);
      if (chart) {
        chart.data = {
          labels: getLabels(),
          datasets: [{
            data: getData(),
            backgroundColor: '#475569',
            borderRadius: 3
          }],
        };

        chart.update()
      }
    }
  }

  function getLabels(): string[] {
    return getDays().map(day => day.toFormat('dd/MM'))
  }

  function getData(): number[] {
    return getDays().map(day => {

      const current = data.find(item => item.day === day.toSQLDate())

      if(current) {
        return current.questoes.total
      }

      return 0
    })
  }

  function getDays(): DateTime[] {
    return Array(15).fill('').map((_, index) => {
      return DateTime.local().minus({days: 14 - index})
    })
  }

  return (
    <div className='overflow-hidden border-primary-600 bg-gray-800 rounded-lg'>
      <div className='h-14 px-3 items-center border-gray-50 flex'>
        <div className="mr-3 bg-gray-600 flex-center rounded-full w-8 h-8">
          <FaCheck className="text-gray-400" />
        </div>
        <div>
          <h1 className='text-base  text-white uppercase'>
            Questões responidas
          </h1>
          <span className='text-gray-400 text-sm'>
            {DateTime.local().minus({ days: 15 }).toFormat('dd/MM')} -{' '}
            {DateTime.local().toFormat('dd/MM')}
          </span>
        </div>
      </div>
      <canvas
        className=''
        style={{ margin: -4 }}
        ref={canvasRef}
        width='400'
        height='100'></canvas>
    </div>
  );
}

const chartConfig: ChartConfiguration = {
  type: 'bar',
  data: {
    labels: [],
    datasets: [],
  },
  options: {
    scales: {
      y: {
        display: false,
        beginAtZero: true,
        grid: {
          display: false,
          drawTicks: true,
        },
      },
      x: {
        display: false,
        grid: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        tension: 0.3,
      },
      bar: {
        borderRadius: 3,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  },
};
