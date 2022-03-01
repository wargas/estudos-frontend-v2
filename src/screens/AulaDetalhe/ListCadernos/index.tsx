import { DateTime } from 'luxon';
import { FaEllipsisV, FaPlus } from 'react-icons/fa';
import { useMutation, useQuery } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { Caderno } from '../../../shared/interfaces';
import CadernoService from '../../../shared/services/CadernoService';
import styles from './ListCadernos.module.css';
const ListCadernos = () => {
  const navigate = useNavigate();
  const { aula_id = '' } = useParams();

  const { data: cadernos, refetch } = useQuery<Caderno[]>(
    ['cadernos', aula_id],
    async () => CadernoService.getByDisciplina(aula_id)
  );

  const mutation = useMutation(() => CadernoService.create(aula_id), {
    onSuccess: (data) => {
      refetch();
    },
  });

  return (
    <div className={styles.wrapper}>
      <div className={styles.tableWrapper}>
        <table>
          <thead>
            <tr>
              <th>Inicio</th>
              <th>Fim</th>
              <th>Nota</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cadernos?.map((caderno) => (
              <tr
                key={caderno.id}
                onClick={() => navigate(`${caderno.id}?page=1`)}>
                <td>
                  {caderno.inicio
                    ? DateTime.fromISO(caderno.inicio).toFormat(
                        'dd/MM/yyyy hh:mm'
                      )
                    : 'Não inciado'}
                </td>
                <td>
                  {caderno.fim
                    ? DateTime.fromISO(caderno.fim).toFormat('dd/MM/yyyy hh:mm')
                    : 'Não finalizado'}
                </td>

                <td>
                  {caderno.acertos + caderno.erros > 0
                    ? (
                        (caderno.acertos / (caderno.acertos + caderno.erros)) *
                        100
                      ).toFixed(1)
                    : '0,0'}
                  %
                </td>
                <td>
                  <div className='flex space-x-3'>
                    {caderno.encerrado ? (
                      <span className={`${styles.state} ${styles.stateDone}`}>
                        encerrado
                      </span>
                    ) : (
                      <span
                        className={`${styles.state} ${styles.stateWarning}`}>
                        pendente
                      </span>
                    )}
                    <div className={styles.countWrapper}>
                      <div className={styles.countItem}>
                        {caderno.acertos + caderno.erros}
                      </div>
                      <div className={styles.countItem}>{caderno.acertos | 0}</div>
                      <div className={styles.countItem}>{caderno.erros | 0}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div className={styles.itemActions}>
                    <button onClick={(ev) => ev.stopPropagation()}>
                      <FaEllipsisV />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.footer}>
          {mutation.isLoading ? (
            <p>Salvando...</p>
          ) : (
            <button
              className={styles.btnIniciar}
              onClick={() => mutation.mutate()}>
              <FaPlus />
              Iniciar novo
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListCadernos;
