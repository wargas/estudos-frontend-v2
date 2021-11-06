import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import { toast } from 'react-toastify';
import Api from '../../shared/Api';
import { useAuth } from '../../shared/auth';
export function Auth() {
  const [loading, setLoading] = useState(false);

  const { login } = useAuth()

  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      email: 'teixeira.wargas@gmail.com',
      password: '123456',
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {

        const { data } = await Api.post<typeof values, AxiosResponse<{token: string}>>('auth/login', values)

        if('token' in data) {
            login(data.token)
        } else {
          toast.error('Email ou senha incorretos')
        }

      } catch (error) {
        console.log(error)
        toast.error('Erro interno ao tentar logar')
      }
      setLoading(false)
    },
  });

  return (
    <div
      style={{ backgroundImage: 'url(https://i.ibb.co/YhMNgJf/background.jpg)' }}
      className='h-screen bg-cover w-screen flex flex-col justify-center'>
      <form
        onSubmit={handleSubmit}
        className='mx-auto flex flex-col gap-4 w-96 p-5 bg-white opacity-100 rounded shadow-lg text-base'>
        <div className='mb-5'>
          <h1 className='text-gray-700 text-4xl font-extrabold'>Bem vindo!</h1>
          <h1 className='text-primary-500'>
            Informe suas credencias para continuar
          </h1>
        </div>
        <div className=''>
          <label className='mb-3 text-gray-500'>Email:</label>
          <input
            type='text'
            name='email'
            onChange={handleChange}
            value={values.email}
            className='border focus:outline-none px-5 rounded h-10 w-full'
          />
        </div>
        <div className=''>
          <label className='mb-3 text-gray-500'>Senha:</label>
          <input
            name='password'
            onChange={handleChange}
            value={values.password}
            type='password'
            className='border focus:outline-none px-5 rounded h-10 w-full'
          />
        </div>
        <div className='mb-5'>
          <button
            type='submit'
            className='bg-primary-600 gap-3 flex justify-center items-center hover:bg-primary-700 w-full h-10 text-white rounded'>
            {loading ? (
              <BiLoaderAlt className='animate-spin text-primary-600' />
            ) : (
              <span>Entrar</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
