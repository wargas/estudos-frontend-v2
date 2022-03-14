import { useState } from 'react';
import { useQuery } from 'react-query';
import { Caderno } from '../../interfaces';
import CadernoService from '../../services/CadernoService';
import styles from './CadernoStat.module.css';

type Props = {
  caderno_id: string;
};

type DataTypes = string;
const typesAvaiables = ['acertos', 'erros', 'nota'];

export default function CadernoStat({ caderno_id }: Props) {
  const [type, setType] = useState<DataTypes>('nota');

  const changeToNext = () => {
    setType((_type) => {
      const index = typesAvaiables.indexOf(_type);

      if (index < typesAvaiables.length - 1) {
        return typesAvaiables[index + 1];
      }

      return typesAvaiables[0];
    });
  };

  const { data } = useQuery<Caderno>(
    ['caderno', caderno_id],
    () => CadernoService.getById(caderno_id),
    {
      enabled: !!caderno_id,
    }
  );

  return (
    <div className={styles.wrapper} onClick={changeToNext}>
      {type === 'nota' && (
        <>
          <span className={styles.data}>
            {data &&
              ((data?.acertos / (data?.erros + data?.acertos)) || 0 * 100).toFixed(
                1
              )}
            %
          </span>
          <span className={styles.label}>{type}</span>
        </>
      )}
      {type === 'acertos' && (
        <>
          <span className={styles.data}>
            {(data && data?.acertos) || 0}/
            {(data?.erros || 0) + (data?.acertos || 0)}
          </span>
          <span className={styles.label}>{type}</span>
        </>
      )}
      {type === 'erros' && (
        <>
          <span className={styles.data}>
            {(data && data?.erros) || 0}/
            {(data?.erros || 0) + (data?.acertos || 0)}
          </span>
          <span className={styles.label}>{type}</span>
        </>
      )}
    </div>
  );
}
