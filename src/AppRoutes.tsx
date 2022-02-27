import { Navigate, Route, Routes } from 'react-router-dom';
import AulaDetalhe from './screens/AulaDetalhe';
import { Aulas } from './screens/Aulas';
import { Auth } from './screens/Auth';
import { Disciplinas } from './screens/Disciplinas';
import { Gerenciar } from './screens/Gerenciar';
import QuestoesPage from './screens/Gerenciar/QuestoesPage';
import { Home } from './screens/Home';
import { Tempo } from './screens/Tempo';
import { useAuth } from './shared/auth';
import Loading from './shared/components/Loading';
import Layout from './shared/layout/Layout';

export function AppRoutes() {
  const { loading, logged } = useAuth();

  if (loading) {
    return (
      <div className='h-screen w-screen flex items-center justify-center'>
        <Loading show={true} />
      </div>
    );
  }

  return (
    <Routes>
      <Route path='/login' element={<Auth />} />
      <Route path='/' element={<Layout />}>
        <Route path='/dashboard' element={<Home />} />
        <Route path='/disciplinas' element={<Disciplinas />} />
        <Route path='/disciplinas/:id' element={<Aulas />} />
        <Route
          path='/disciplinas/:disciplina_id/aulas/:aula_id'
          element={<AulaDetalhe />}
        />
        <Route path='/tempo' element={<Tempo />} />
        <Route path='/gerenciar' element={<Gerenciar />}></Route>
        <Route path='/gerenciar/questoes' element={<QuestoesPage />} />
        <Route path='/' element={<Navigate replace to='/dashboard' />}></Route>
        

        {!logged && <Navigate replace to='/login' />}
      </Route>
      <Route path='*' element={<p>page not found</p>} />
    </Routes>
  );
}
