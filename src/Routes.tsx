import { Redirect, Route, Switch } from 'react-router';
import { AulaDetail } from './screens/Aula';
import { Aulas } from './screens/Aulas';
import { Auth } from './screens/Auth';
import { Disciplinas } from './screens/Disciplinas';
import { Gerenciar } from './screens/Gerenciar';
import { Home } from './screens/Home';
import { Tempo } from './screens/Tempo';
import { useAuth } from './shared/auth';
import Layout from './shared/layout/Layout';

export function Routes() {
  const { loading, logged } = useAuth();

  if (loading) {
    return (
      <div className='h-screen w-screen flex items-center justify-center'>
        <p className='text-gray-400'>Carregando dados da sessão...</p>
      </div>
    );
  }

  return (
    <Switch>
      <Route exact path='/login' component={Auth} />
      <Route path='/'>
        <Layout>
          <Route exact path='/dashboard' component={Home} />
          <Route exact path='/disciplinas' component={Disciplinas} />
          <Route exact path='/disciplinas/:id' component={Aulas} />
          <Route exact path='/disciplinas/:disciplina_id/aula/:aula_id/:route?/:questao_id?' component={AulaDetail} />
          <Route exact path='/tempo' component={Tempo} />
          <Route exact path='/gerenciar' component={Gerenciar} />
          <Route exact path='/'>
            <Redirect to='/dashboard' />
          </Route>
        </Layout>
        {!logged && <Redirect to="/login" />}
      </Route>
    </Switch>
  );
}