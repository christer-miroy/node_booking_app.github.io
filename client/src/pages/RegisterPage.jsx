import axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function registerUser(ev) {
    ev.preventDefault();
    try {
      //send request to api via axios
      await axios.post('/register', {
        name,
        email,
        password,
      });
      alert('Registration complete!');
    } catch (e) {
      alert('Registration failed. Please try again.');
    }
  }

  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-64">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form action="" onSubmit={registerUser} className="max-w-md mx-auto">
          <input
            type="text"
            name="name"
            placeholder="Enter your name here"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email address here"
            value={email}
            onChange={(ev) => setEmail(ev.target.value)}
          />
          <input
            type="password"
            name="password"
            placeholder="Enter your password here"
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button className="primary">Register</button>
          <div className="text-center py-5 text-gray-500">
            Already a member?{' '}
            <Link to={'/login'} className="underline text-black">
              Login
            </Link>{' '}
            here!
          </div>
        </form>
      </div>
    </div>
  );
}
