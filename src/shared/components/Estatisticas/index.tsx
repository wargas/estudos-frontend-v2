import { DateTime, Duration } from 'luxon';
import { useEffect, useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import { FaChevronLeft } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Api from '../../Api';
import { Aula } from '../../interfaces';
import { ComponentProps } from '../Drawer';
import { ListQuestoes } from '../ListQuestoes';

type DayProps = {
  data: DateTime;
  acertos: number;
  erros: number;
  total: number;
  tempo: number;
};

export function Estatisticas({ data, setWidth, closeDrawer = () => {} }: ComponentProps) {
  const [loading, setLoading] = useState(false);
  const [currentDay, setCurrentDay] = useState<DayProps>();
  const [aula, setAula] = useState<Aula>();
  const aula_id = data.aula_id;
  const [days, setDays] = useState<DayProps[]>([]);

  useEffect(() => {
    if (aula) {
      const registrosDays = aula.registros.map((item) =>
        DateTime.fromISO(item.horario).toSQLDate()
      );
      const respondidasDays = aula.respondidas.map((item) =>
        DateTime.fromISO(item.horario).toSQLDate()
      );

      const daysSet = new Set([
        ...registrosDays,
        ...respondidasDays,
        DateTime.local().toSQLDate(),
      ]);

      const daysArray = Array.from(daysSet)
        .map((day) => {
          const currentRegistros = aula.registros
            .filter((reg) => DateTime.fromISO(reg.horario).toSQLDate() === day)
            .reduce((acc, cur) => {
              return acc + cur.tempo;
            }, 0);

          const currentRespondidas = aula.respondidas.filter(
            (res) => DateTime.fromISO(res.horario).toSQLDate() === day
          );

          const acertos = currentRespondidas.reduce((acc, cur) => {
            if (cur.acertou) {
              return acc + 1;
            }

            return acc;
          }, 0);

          return {
            data: DateTime.fromISO(day),
            acertos: acertos,
            erros: currentRespondidas.length - acertos,
            total: currentRespondidas.length,
            tempo: currentRegistros,
          };
        })
        .sort((a, b) => {
          return b.data.toMillis() - a.data.toMillis();
        });

      setDays(daysArray);
    }
  }, [aula]);

  useEffect(() => {
    if (aula_id) {
      loadAula();
    }
  }, [aula_id]);

  useEffect(() => {
    setWidth('xs')
  }, [])

  function loadAula() {
    setLoading(true);
    Api.get<Aula>(`aulas/${aula_id}?withRegistros=true&withRespondidas=true&withQuestoes=true`)
      .then(({ data }) => setAula(data))
      .catch(() => toast.error('Erro ao buscar a aula'))
      .finally(() => setLoading(false));
  }

  return (
    <div className='flex flex-col h-screen'>
      <div className='h-14 bg-primary-600 items-center flex'>
        <button onClick={() => currentDay ? setCurrentDay(undefined) : closeDrawer(null)} className='px-5 text-white'>
          <FaChevronLeft />
        </button>
        <h1 className='text-white'>Estatísicas</h1>
      </div>
      <div className='scroll flex-1 flex flex-col max-h-screen relative overflow-y-auto'>
        {loading && (
          <div className='absolute inset-0 b-white flex-center'>
            <BiLoaderAlt className="text-primary-600 text-4xl animate-spin" />
          </div>
        )}
        {currentDay && (
          <ListQuestoes
            data={currentDay.data}
            respondidas={aula?.respondidas || []}
            questoes={aula?.questoes || []}
          />
        )}
        {!currentDay &&
          days.map((day) => (
            <div
              key={day.data.toISO()}
              onClick={() => setCurrentDay(day)}
              className='h-16 p-3 flex border-b hover:bg-gray-50 cursor-pointer border-gray-100'>
              <div>
                <h1 className='text-base'>{day.data.toLocaleString()}</h1>
                {day.total > 0 ? (
                  <p className='text-sm text-gray-500'>
                    {((day.acertos / day.total) * 100)
                      .toFixed(1)
                      .replace('.', ',')}
                    % de acerto
                  </p>
                ) : (
                  <p className='text-sm text-gray-500'>Não respondeu</p>
                )}
              </div>
              <div className='ml-auto'>
                <p className='text-sm text-right text-gray-500'>
                  {Duration.fromObject({ seconds: day.tempo }).toFormat(
                    'hh:mm:ss'
                  )}
                </p>
                <p className='text-xs text-right text-gray-500'>
                  ({day.acertos}/{day.erros}/{day.total})
                </p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
