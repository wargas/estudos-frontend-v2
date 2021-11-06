import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { DateTime, Duration } from 'luxon';
import { useEffect, useRef } from 'react';
import { FaClock } from 'react-icons/fa';
import { DashboardDataItem } from '../../interfaces';

Chart.register(...registerables);
const START_ON = 3600;
const META = 60 * 60 * 4;

type Props = {
  data: DashboardDataItem[];
};

export function ChartTempoPorDia({ data }: Props) {
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
          datasets: [
            {
              data: getLabels().map(() => START_ON + META),
              borderWidth: 1,
              borderDash: [1, 5],
              borderColor: 'white',
              pointBackgroundColor: 'transparent',
              pointBorderColor: 'transparent',
            },
            {
              data: getData(),
              backgroundColor: '#475569',
              fill: true,
              borderRadius: 3,
            },
          ],
        };

        chart.update();
      }
    }
  }

  function getLabels(): string[] {
    return getDays().map((day) => day.toFormat('dd/MM'));
  }

  function getData(): number[] {
    return getDays().map((day) => {
      const current = data.find((item) => item.day === day.toSQLDate());

      if (current) {
        return current.tempo + START_ON;
      }

      return START_ON;
    });
  }

  function getDays(): DateTime[] {
    return Array(15)
      .fill('')
      .map((_, index) => {
        return DateTime.local().minus({ days: 14 - index });
      });
  }

  return (
    <div className='overflow-hidden  bg-primary-700 rounded-lg'>
      <div className='h-14 px-3 items-center border-primary-400 flex'>
        <div className='mr-3'>
          <FaClock className="text-gray-400 w-8 h-8" />
        </div>
        <div>
          <h1 className='text-base  text-white uppercase'>Tempo Estudado</h1>
          <span className='text-gray-300 text-sm'>
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
  type: 'line',
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
        tension: 0.2,
      },
      bar: {
        borderRadius: 3,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (props) => {
            const newLabel = Duration.fromObject({seconds: Number(props.raw)-START_ON}).toFormat('hh:mm')
            return `${props.label}: ${newLabel}`;
          },
        },
      },
    },
  },
};
