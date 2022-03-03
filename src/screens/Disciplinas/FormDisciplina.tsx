import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import Api from '../../shared/Api';
import { DrawerComponentProps } from '../../shared/components/Drawer';

export default function FormDisciplina({ closeDrawer = () => {} }: DrawerComponentProps) {
  const mutation = useMutation((newDisciplina: any) => {
    return Api.post('/disciplinas', newDisciplina);
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      arquivada: 0
    },
    onSubmit: (values) => {
      mutation.mutate(values, {
          onSuccess: () => {
            closeDrawer(true)
          }
      });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className='flex flex-col h-screen'>
      <div className='h-14 bg-primary-500 px-3 flex items-center text-white'>
        <button>
          <i className='fas fa-chevron-up'></i>
        </button>
        <h1>Cadastrar Disciplina</h1>
        <p>{mutation.status}</p>
      </div>
      <div>
        <div className='text-base flex flex-col px-3 py-4'>
          <label className='mb-1 text-sm' htmlFor=''>
            Nome:
          </label>
          <input
            name='name'
            value={formik.values.name}
            onChange={formik.handleChange('name')}
            className='border rounded px-2 py-2'
            type='text'
            placeholder='Nome da disciplina'
          />
        </div>
      </div>
      <div className='mt-auto p-3 border-t'>
        <button className='bg-primary-600 text-white w-full rounded py-2'>
          Salvar
        </button>
      </div>
      {mutation.isLoading && (
        <div className='absolute inset-0 flex items-center justify-center bg-white opacity-25'>
          carregando...
        </div>
      )}
    </form>
  );
}
