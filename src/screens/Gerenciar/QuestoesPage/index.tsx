import { useState } from 'react';
import { useQuery } from 'react-query';
import { PageHeader } from '../../../shared/components/PageHeader';
import { Paginate, Questao } from '../../../shared/interfaces';
import QuestaoService from '../../../shared/services/QuestaoService';

export default function QuestoesPage() {
  const [page, setPage] = useState(1);

  const { data: paginate } = useQuery<Paginate<Questao>>(
    ['questoes', page],
    () => QuestaoService.getAll(page, 10)
  );

  return (
    <div>
      <PageHeader title='Gerenciar Questões' />
      <div className='bg-white p-5 rounded shadow'>
        wargasssdsadas
        <table>
          <tbody>
            {paginate?.data.map((questao) => (
              <tr>
                <td>{questao.alternativas.length}</td>
                <td>{questao.texto.substring(0, 100)}...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
