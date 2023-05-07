import Head from 'next/head'
import { Inter } from 'next/font/google'
import { Auth, CognitoUser } from '@aws-amplify/auth'
import { useRouter } from 'next/router';
import {Menu} from "@/components/menu";
import React, { useState, Dispatch, SetStateAction } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [mode, setMode] = useState<string>('');
  const [cognitoUser, setCognitoUser] = useState<CognitoUser | undefined>(undefined);

  let contents = null;
  switch (mode) {
    case 'NEW_PASSWORD_REQUIRED':
      contents = ResetPasswordForm({setMode, cognitoUser});
      break;
    case 'SOFTWARE_TOKEN_MFA':
      contents = MfaForm({cognitoUser});
      break;
    default:
      contents = LoginForm({setMode, setCognitoUser});
      break;
  }

  return (
    <>
      <Head>
        <title>Login - Cognito example</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`${inter.className}`}>
        <h1>Login</h1>
        <hr />
        <Menu />
        <hr />
        {contents}
      </main>
    </>
  )
}

const ResetPasswordForm: React.FC<{
  setMode: Dispatch<SetStateAction<string>>;
  cognitoUser: CognitoUser | undefined;
}> = ({setMode, cognitoUser}) => {
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    console.log('ResetPasswordForm:handleSubmit');

    event.preventDefault()

    const password = event.target.password.value

    try {
      const user = await Auth.completeNewPassword(cognitoUser, password);

      console.log(user);

      if (!user) {
        console.log('user is undefined');
        return;
      }

      router.push('/private');
    } catch (error) {
      console.warn(error);
      alert(error);
    }
  }

  return (
    <div>
      <h2>Please set new password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" name="password" />
        </div>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  );
}

const LoginForm: React.FC<{
  setMode: Dispatch<SetStateAction<string>>;
  setCognitoUser: Dispatch<SetStateAction<CognitoUser | undefined>>;
}> = ({setMode, setCognitoUser}) => {
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    console.log('LoginForm:handleSubmit');

    event.preventDefault()

    const email = event.target.email.value;
    const password = event.target.password.value

    try {
      const user: CognitoUser | undefined = await Auth.signIn({
        username: email,
        password,
      });

      setCognitoUser(user);
      console.log(user);

      if (!user) {
        console.log('user is undefined');
        return;
      }

      if (user.challengeName === 'NEW_PASSWORD_REQUIRED') {
        setMode(user.challengeName);
      } else if (user.challengeName === "SOFTWARE_TOKEN_MFA") {
        setMode(user.challengeName);
      } else {
        router.push('/private');
      }
    } catch (error) {
      console.warn(error);
      alert(error);
    }
  }

  return (
    <div>
      <h2>Login</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <input type="password" id="password" name="password" />
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}

const MfaForm: React.FC<{
  cognitoUser: CognitoUser | undefined;
}> = ({cognitoUser}) => {
  const router = useRouter();

  const handleSubmit = async (event: any) => {
    console.log('MfaForm:handleSubmit');

    event.preventDefault();

    const code = event.target.code.value;

    try {
      const user = await Auth.confirmSignIn(cognitoUser, code, 'SOFTWARE_TOKEN_MFA');
      console.log(user);
      router.push('/private');
    } catch (error) {
      console.warn(error);
      alert(error);
    }
  }

  return (
    <div>
      <h2>Please enter your OTP</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="code">Code</label>
            <input id="code" name="code" />
          </div>
          <div>
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  )
}
