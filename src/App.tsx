import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { HashRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WebFontLoader from 'webfontloader';
import { Routes } from './Routes';
import { AuthProvider } from './shared/auth';
import { DrawerProvider } from './shared/components/Drawer';
import { ModalProvider } from './shared/components/Modal';


const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    WebFontLoader.load({
      google: {
        families: ['Ubuntu', 'Inter', 'Oswald'],
      },
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen />
      <HashRouter>
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
      </HashRouter>
    </QueryClientProvider>
  );
}

export default App;
