import { ComponentMeta, ComponentStory } from '@storybook/react';
import '../index.css';
import { AuthContext } from '../shared/auth';
import { PageHeader } from '../shared/components';

export default {
  title: 'App/PageHeader',
  compoent: PageHeader,
  parameters: {
    title: 'Teste',
    subtile: 'Teste sub',
  },
} as ComponentMeta<typeof PageHeader>;

const user = { name: '', email: '' };

const Template: ComponentStory<typeof PageHeader> = (args) => (
  <AuthContext.Provider
    value={{
      user,
      logged: true,
      loading: false,
      login: () => {},
      logout: () => {},
    }}>
    <PageHeader {...args} />
  </AuthContext.Provider>
);

export const Header = Template.bind({ backAction: true, title: 'Teste' });

Header.args = {
  title: 'Teste 01',
  subtitle: 'subtitle',
  backButton: true,
  isLoading: false,
  onBackPress: () => console.log('backpressed'),
};
