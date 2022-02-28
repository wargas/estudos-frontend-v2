import { DateTime } from 'luxon';
import { FaChevronRight } from 'react-icons/fa';
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
    onSuccess: () => {
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
              <th>Total</th>
              <th>Acertos</th>
              <th>Erros</th>
              <th>%</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {cadernos?.map((caderno) => (
              <tr key={caderno.id}>
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
                <td>{caderno.total}</td>
                <td>{caderno.acertos}</td>
                <td>{caderno.erros}</td>
                <td>{((caderno.acertos / caderno.total) * 100).toFixed(1)}%</td>
                <td>
                  {caderno.encerrado ? (
                    <span>encerrado</span>
                  ) : (
                    <span>pendente</span>
                  )}
                </td>
                <td>
                  <div className='flex justify-end'>
                    <button onClick={() => navigate(`${caderno.id}?page=1`)}>
                      <FaChevronRight />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={8}>
                <div className='flex justify-center'>
                  {mutation.isLoading ? (
                    <p>Salvando...</p>
                  ) : (
                    <button onClick={() => mutation.mutate()}>
                      Iniciar novo
                    </button>
                  )}
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListCadernos;
