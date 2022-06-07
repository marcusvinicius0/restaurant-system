import { useContext, FormEvent, useState } from 'react';
import Head from "next/head";
import Image from "next/image";                //propria tag <img/> do next;
import styles from '../../styles/home.module.scss';

import logoImg from '../../public/logo.png';

import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

import { AuthContext } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

import Link from 'next/link';

export default function Home() {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent) {
    event.preventDefault();

    if(email === '' || password === ''){
      toast.warning("Preencha todos os campos!")
      return;
    }

    setLoading(true);

    let data = {
     email,
     password
    }

    await signIn(data)
    
    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>OrderSystem - Faça login.</title>
      </Head>
      <div className={styles.containerCenter}>
        <Image src={logoImg} width="200" height="200" alt="main logo" />

        <div className={styles.login}>
          <form onSubmit={handleLogin}>
            <Input
              placeholder="Digite seu email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              placeholder="Digite sua senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button
              type="submit"
              loading={loading}
            >
              Acessar
            </Button>
          </form>

          <Link href="/signup">
            <a className={styles.text}>Não possui uma conta? Cadastre-se.</a>
          </Link>

        </div>
      </div>
    </>
  )
}
