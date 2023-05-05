import Link from 'next/link'
import { Auth } from '@aws-amplify/auth'
import { useRouter } from 'next/router';

export const Menu = () => {
  const router = useRouter();

  const logout = () => {
    Auth.signOut().then(() => {
      router.push('/');
    })
  }

  return (
    <div>
      <h2>Menu</h2>
      <ul>
        <li><Link href="/">/</Link></li>
        <li><Link href="/private">/dashboard</Link></li>
        <li><Link href="/reset_password">/reset_password</Link></li>
        <li><button onClick={logout}>Logout</button></li>
      </ul>
    </div>
  )
}
