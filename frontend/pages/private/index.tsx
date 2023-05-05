import Head from 'next/head'
import { Inter } from 'next/font/google'
import { Auth } from '@aws-amplify/auth'
import { useState, useEffect } from 'react'
import { CognitoUserSession } from 'amazon-cognito-identity-js'
import {Menu} from "@/components/menu";
import { useRouter } from 'next/router';

const inter = Inter({ subsets: ['latin'] })

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<CognitoUserSession | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      await Auth.currentAuthenticatedUser().then(() => {
        Auth.currentSession().then((userSession) => {
          setUser(userSession);
        }).catch((error) => {
          console.warn(error);
          router.push('/');
        })
      }).catch((error) => {
        console.warn(error);
        router.push('/');
      })
    };

    fetchData();
  }, [router]);

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
        <h1>Dashboard</h1>
        <hr />
        <Menu />
        <hr />
        <h2>Debug info</h2>
        <div>
          <div>
            <h3>Auth.currentSession (CognitoUserSession)</h3>
            <pre>{JSON.stringify(user, null, 2)}</pre>
          </div>
          <div>
            <h3>Time</h3>
            <table>
              <thead>
                <tr>
                  <th>key</th>
                  <th>value</th>
                  <th>converted value</th>
                  <th>description</th>
                </tr>
              </thead>
              <tbody>
              <tr>
                <td>idToken.payload.auth_time</td>
                <td>{user?.getIdToken().payload.auth_time}</td>
                <td>{(new Date(user?.getIdToken().payload.auth_time * 1000)).toLocaleString()}</td>
                <td>ユーザーが認証を完了した認証時刻 (Unix の時間形式)。</td>
              </tr>
              <tr>
                <td>idToken.payload.exp</td>
                <td>{user?.getIdToken().payload.exp}</td>
                <td>{(new Date(user?.getIdToken().payload.exp * 1000)).toLocaleString()}</td>
                <td>ユーザーのトークンの有効期限が切れる有効期限 (Unix の時間形式)。</td>
              </tr>
              <tr>
                <td>idToken.payload.iat</td>
                <td>{user?.getIdToken().payload.iat}</td>
                <td>{(new Date(user?.getIdToken().payload.iat * 1000)).toLocaleString()}</td>
                <td>Amazon Cognito がユーザーのトークンを発行した発行時刻 (Unix の時間形式)。</td>
              </tr>
              <tr>
                <td>accessToken.payload.auth_time</td>
                <td>{user?.getAccessToken().payload.auth_time}</td>
                <td>{(new Date(user?.getAccessToken().payload.auth_time * 1000)).toLocaleString()}</td>
                <td>ユーザーが認証を完了した認証時刻 (Unix の時間形式)。</td>
              </tr>
              <tr>
                <td>accessToken.payload.exp</td>
                <td>{user?.getAccessToken().payload.exp}</td>
                <td>{(new Date(user?.getAccessToken().payload.exp * 1000)).toLocaleString()}</td>
                <td>ユーザーのトークンの有効期限が切れる有効期限 (Unix の時間形式)。</td>
              </tr>
              <tr>
                <td>accessToken.payload.iat</td>
                <td>{user?.getAccessToken().payload.iat}</td>
                <td>{(new Date(user?.getAccessToken().payload.iat * 1000)).toLocaleString()}</td>
                <td>Amazon Cognito がユーザーのトークンを発行した発行時刻 (Unix の時間形式)。</td>
              </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  )
}
