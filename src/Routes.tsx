import { Redirect, Route, Switch } from 'react-router';
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

export function Routes() {
  const { loading, logged } = useAuth();

  if (loading) {
    return (
      <div className='h-screen w-screen flex items-center justify-center'>
        <p className='text-gray-400'>
          <Loading show={true} />
        </p>
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
          <Route
            exact
            path='/disciplinas/:disciplina_id/aulas/:aula_id'
            component={AulaDetalhe}
          />
          <Route exact path='/tempo' component={Tempo} />
          <Route exact path='/gerenciar' component={Gerenciar}></Route>
          <Route exact path='/gerenciar/questoes' component={QuestoesPage} />
          <Route exact path='/'>
            <Redirect to='/dashboard' />
          </Route>
        </Layout>
        {!logged && <Redirect to='/login' />}
      </Route>
      <Route path='**' component={() => <p>page not found</p>} />
    </Switch>
  );
}
