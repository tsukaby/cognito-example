import Head from 'next/head'
import { Inter } from 'next/font/google'
import { Auth } from '@aws-amplify/auth'
import { useState, useEffect } from 'react'
import {Menu} from "@/components/menu";
import { useRouter } from 'next/router';
import QRCodeSVG from 'qrcode.react';
import { CognitoUser } from '@aws-amplify/auth';

const inter = Inter({ subsets: ['latin'] })

export default function SetupTotp() {
  const router = useRouter();
  const [user, setUser] = useState<CognitoUser | undefined>(undefined);
  const [token, setToken] = useState('');
  const [mfaState, setMfaState] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      await Auth.currentAuthenticatedUser().then(async (user) => {
        await Auth.currentSession();
        setUser(user);
        const state = await Auth.getPreferredMFA(user);
        setMfaState(state);
      }).catch((error) => {
        console.warn(error);
        router.push('/');
      })
    };

    fetchData();
  }, [router]);

  const handleStartMfaSetup = async () => {
    if (!user) {
      return;
    }

    if (mfaState !== 'SOFTWARE_TOKEN_MFA') {
      const data = await Auth.setupTOTP(user);
      const sub = user.getUsername();
      console.log(`sub: ${sub}`);
      console.log(`setupTOTP: ${data}`);
      const token = 'otpauth://totp/AWSCognito:' + sub + '?secret=' + data + '&issuer=CognitoExample'
      setToken(token);
    }
  }

  const handleSubmit = async (event: any) => {
    console.log('SetupTotp:handleSubmit');

    event.preventDefault();

    const code = event.target.code.value;

    const user = await Auth.currentAuthenticatedUser();
    await Auth.verifyTotpToken(user, code);

    await Auth.setPreferredMFA(user, 'TOTP')
    alert('Complete setup TOTP.');
    router.push('/private');
  }

  const deleteTotp = async () => {
    await Auth.currentAuthenticatedUser().then(async (user) => {
      await Auth.setPreferredMFA(user, 'NOMFA');
      alert('Complete delete TOTP.');
      router.push('/private');
    });
  }

  if (!user) {
    return (
      <div>Loading</div>
    )
  }

  return (
    <>
      <Head>
        <title>Dashboard - Cognito example</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main className={`${inter.className}`}>
        <h1>Setup TOTP</h1>
        <hr />
        <Menu />
        <hr />
        <h2>MFA Status</h2>
        <div>
          <div>
            <h3>Auth.getPreferredMFA</h3>
            <pre>{JSON.stringify(mfaState, null, 2)}</pre>
          </div>
          {mfaState !== 'SOFTWARE_TOKEN_MFA' ? (
            <>
              <div>
                <h3>TOTP QR code</h3>
                <div>
                  <button onClick={handleStartMfaSetup}>Start</button>
                </div>
                <div>
                  {token && (
                    <QRCodeSVG value={token} />
                  )}
                </div>
              </div>
              <div>
                <h3>Confirm TOTP</h3>
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="code">Code</label>
                    <input type="text" id="code" name="code" />
                  </div>
                  <div>
                    <input type="submit" value="Submit" />
                  </div>
                </form>
              </div>
            </>
          ) : (
            <div>
              <h3>Delete TOTP</h3>
              <div>
                <button onClick={deleteTotp}>Delete</button>
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
