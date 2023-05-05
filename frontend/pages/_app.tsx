import type { AppProps } from 'next/app'
import { Auth } from '@aws-amplify/auth';

Auth.configure({
  region: process.env.NEXT_PUBLIC_COGNITO_REGION,
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID,
  userPoolWebClientId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_WEB_CLIENT_ID,
  mandatorySignIn: true,
});

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
