import { DateTime } from 'luxon';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { Questao, Respondida } from '../../interfaces';

export function ListQuestoes({ questoes, data, respondidas }: Props) {
  const [items, setItems] = useState<number[]>([]);

  const { push } = useHistory();
  const { pathname } = useLocation()

  useEffect(() => {
    setItems(
      questoes.map((questao) => {
        const hoje = respondidas?.find(
          (it) =>
            it.questao_id === questao.id &&
            data.toSQLDate() === DateTime.fromISO(it.horario).toSQLDate()
        );

        if (!hoje) {
          return 0;
        }

        if (hoje.acertou) {
          return 1;
        } else {
          return -1;
        }
      })
    );
  }, []);

 

  return (
    <div className='grid grid-cols-5 gap-3 items-stretch p-3 pb-24'>
      {items.map((item, index) => (
        <div
          onClick={() => push(`${pathname}?page=${index + 1}`)}
          className={`relative ${item === 0 && 'bg-gray-300'} ${
            item === 1 && 'bg-green-600 '
          } ${
            item === -1 && 'bg-red-600'
          } h-10 shadow-sm flex-center cursor-pointer text-white rounded`}
          key={index}>
          <span className='text-sm'>
            <span>{index + 1}</span>
          </span>
          <span className='text-xs absolute right-0 bottom-0 p-1'>{questoes[index].alternativas.length}</span>
        </div>
      ))}
    </div>
  );
}

type Props = {
  questoes: Questao[];
  data: DateTime;
  respondidas: Respondida[];
};
