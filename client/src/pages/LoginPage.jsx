import axios from 'axios';
import { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  //redirect page if login is successful
  const [redirect, setRedirect] = useState(false);
  //get context (user info)
  const { setUser } = useContext(UserContext);

  async function handleLoginSubmit(ev) {
    ev.preventDefault();

    try {
      //login the user
      const { data } = await axios.post('/login', { email, password });
      setUser(data);
      alert('Login successful');
      setRedirect(true);
    } catch (e) {
      alert('Login failed');
    }
  }

  //return
  if (redirect) {
    return <Navigate to={'/'} />;
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form
          action=""
          onSubmit={handleLoginSubmit}
          className="max-w-md mx-auto"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter Email Address"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter Password"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button className="primary">Login</button>
          <div className="text-center py-5 text-gray-500">
            Don't have an account yet?{' '}
            <Link to={'/register'} className="underline text-black">
              Register
            </Link>{' '}
            here!
          </div>
        </form>
      </div>
    </div>
  );
}
