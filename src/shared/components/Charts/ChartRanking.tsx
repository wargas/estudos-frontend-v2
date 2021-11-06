import { DateTime, Duration } from 'luxon';
import { useEffect, useState } from 'react';
import { DashboardDataItem } from '../../interfaces';

type Props = {
  data: DashboardDataItem[];
};

const NUM_ITENS = 10;

export function ChartRanking({ data }: Props) {
  const [aba, setAba] = useState(0);
  const [days, setDays] = useState<DashboardDataItem[]>([]);
  

  useEffect(() => {
    if (data.length > 0) {
      const _days = data
        .sort((a, b) => {
          return aba === 0
            ? b.questoes.total - a.questoes.total
            : b.tempo - a.tempo;
        })
        .map((item, index) => {
          return { ...item, position: index + 1 };
        })
        .filter((day, index) => {
          return (
            index < NUM_ITENS - 1 || day.day === DateTime.local().toSQLDate()
          );
        });

      setDays(_days);
    }
  }, [data, aba]);

  return (
    <div
     
      className='bg-white col-span-3 row-span-2 flex flex-col rounded-lg shadow-sm'>
      <div className='h-16 flex'>
        <div
          onClick={() => setAba(0)}
          className={`${
            aba === 0
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'border-b border-gray-50 text-gray-400'
          } transition-all uppercase  flex-center flex-1 cursor-pointer`}>
          Questões
        </div>
        <div
          onClick={() => setAba(1)}
          className={`${
            aba === 1
              ? 'border-b-2 border-primary-600 text-primary-600'
              : 'border-b border-gray-50 text-gray-400'
          } transition-all uppercase  flex-center flex-1 cursor-pointer`}>
          Tempo
        </div>
      </div>
      <div className='flex-1 scroll overflow-y-auto'>
        {days
          .filter(() => true)
          .map((day) => (
            <div
              key={day.day}
              className='border-b h-16 flex items-center gap-2 border-gray-50 px-3 cursor-pointer'>
              <div className='w-10 h-10 bg-primary-100 flex-center text-primary-600 font-bold rounded-full'>
                {day?.position || 0}
              </div>
              <div className='flex-1'>
                <h1 className='text-gray-500 text-sm'>
                  {DateTime.fromSQL(day.day).toFormat('dd/MM/yyyy')}
                </h1>
                <span className='text-xs text-gray-400'>
                  {aba === 0 &&
                    `${(
                      (day.questoes.acertos / day.questoes.total) *
                      100
                    ).toFixed(1)}% de acerto`}
                  {aba === 1 &&
                    `${((day.tempo * 100) / (4 * 60 * 60)).toFixed(
                      1
                    )}% da meta`}
                </span>
              </div>
              <div>
                <span className='bg-primary-600 text-xs rounded-full text-white py-1 px-2'>
                  {aba === 0
                    ? day.questoes.total
                    : Duration.fromObject({ seconds: day.tempo }).toFormat(
                        'hh:mm'
                      )}
                </span>
              </div>
            </div>
          ))}
        
      </div>
    </div>
  );
}
