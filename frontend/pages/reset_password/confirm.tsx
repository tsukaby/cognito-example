import Head from 'next/head'
import { Inter } from 'next/font/google'
import { Auth } from '@aws-amplify/auth'
import { useRouter } from 'next/router';
import {Menu} from "@/components/menu";

const inter = Inter({ subsets: ['latin'] })

export default function Confirm() {
  const router = useRouter();
  const { email } = router.query

  const stringEmail = email as string

  const handleSubmit = async (event: any) => {
    console.log('Confirm:handleSubmit');

    event.preventDefault();

    const code = event.target.code.value;
    const password = event.target.password.value;

    try {
      await Auth.forgotPasswordSubmit(stringEmail, code, password);
      alert('Success reset password.')
      router.push('/');
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
        <h2>Confirm</h2>
        <div>Enter the code you received in your email and your new password.</div>
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="code">Code</label>
              <input id="code" name="code" />
            </div>
            <div>
              <label htmlFor="password">New password</label>
              <input type="password" id="password" name="password" />
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
