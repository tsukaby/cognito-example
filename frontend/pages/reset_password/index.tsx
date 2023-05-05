import Head from 'next/head'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import { Auth } from '@aws-amplify/auth'
import { useRouter } from 'next/router';
import {Menu} from "@/components/menu";

const inter = Inter({ subsets: ['latin'] })

export default function ResetPassword() {
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    console.log('ResetPassword:handleSubmit');

    event.preventDefault();

    const email = event.target.email.value;

    try {
      await Auth.forgotPassword(email);
      router.push({
        pathname: '/reset_password/confirm',
        query: { email: email },
      })
    } catch (error) {
      console.warn(error);
      alert(error);
    }
  }

  return (
    <>
      <Head>
        <title>Reset password - Cognito example</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`${inter.className}`}>
        <h1>Reset password</h1>
        <hr />
        <Menu />
        <hr />
        <h2>Request</h2>
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" />
            </div>
            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      </main>
    </>
  )
}
