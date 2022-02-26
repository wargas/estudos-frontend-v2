import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routes } from './Routes';
import { AuthProvider } from './shared/auth';
import { DrawerProvider } from './shared/components/Drawer';
import { ModalProvider } from './shared/components/Modal';


const queryClient = new QueryClient();

function App() {
  
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen />
      <Router>
        <AuthProvider> 
          <ModalProvider>
            <DrawerProvider>
              <ToastContainer
                position='bottom-right'
                autoClose={2000}
                theme='light'
              />
              <Routes />
            </DrawerProvider>
          </ModalProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
