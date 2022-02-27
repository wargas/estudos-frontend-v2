import querystring from 'query-string';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { PageHeader } from '../../../shared/components/PageHeader';


export default function QuestoesPage() {
  

  const { search } = useLocation()

  
  const page = useMemo<number>(() => Number(querystring.parse(search).page) || 1, [search])


  return (
    <div>
      <PageHeader title='Gerenciar Questões' />
      <div className='bg-white p-5 rounded shadow'>
        
       

              {JSON.stringify(page)} <br />

        <Link to={`/gerenciar/questoes?page=${page-1}`}>Next</Link>
        <span> [{page}] </span>
        <Link to={`/gerenciar/questoes?page=${page+1}`}>Prev</Link>
      </div>
    </div>
  );
}
