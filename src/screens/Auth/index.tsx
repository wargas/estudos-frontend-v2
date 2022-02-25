import { AxiosResponse } from 'axios';
import { useFormik } from 'formik';
import { useState } from 'react';
import { BiLoaderAlt } from 'react-icons/bi';
import { toast } from 'react-toastify';
import Api from '../../shared/Api';
import { useAuth } from '../../shared/auth';
import styles from './Auth.module.css';

export function Auth() {
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();

  const { handleSubmit, handleChange, values } = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const { data } = await Api.post<
          typeof values,
          AxiosResponse<{ token: string }>
        >('auth/login', values);

        if ('token' in data) {
          login(data.token);
        } else {
          toast.error('Email ou senha incorretos');
        }
      } catch (error) {
        console.log(error);
        toast.error('Erro interno ao tentar logar');
      }
      setLoading(false);
    },
  });

  return (
    <div className={styles.wrapper}>
      <form
        onSubmit={handleSubmit}
       >
        <div className={styles.header}>
          <h1 className={styles.title}>Bem vindo!</h1>
          <h1 className={styles.subtitle}>
            Informe suas credencias para continuar
          </h1>
        </div>
       
        <div>
          <label className={styles.inputLabel}>Email:</label>
          <input
            type='text'
            name='email'
            onChange={handleChange}
            value={values.email}
            className={styles.input}
          />
        </div>
        <div>
          <label className={styles.inputLabel}>Senha:</label>
          <input
            name='password'
            onChange={handleChange}
            value={values.password}
            type='password'
            className={styles.input}
          />
        </div>
        <div className={styles.footer}>
          <button
            type='submit'
            className={styles.buttonPrimary}>
            {loading ? (
              <BiLoaderAlt className={styles.iconLoading} />
            ) : (
              <span>Entrar</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
