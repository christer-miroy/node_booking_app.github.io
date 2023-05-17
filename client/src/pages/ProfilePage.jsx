import { useContext, useState } from 'react';
import { UserContext } from '../context/UserContext';
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import PlacesPage from './PlacesPage';
import AccountNav from '../components/AccountNav';

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null); //redirect to home page upon logout
  const { ready, user, setUser } = useContext(UserContext);
  //subpages
  let { subpage } = useParams();
  if (subpage === undefined) {
    subpage = 'profile';
  }

  //logout
  async function logout() {
    await axios.post('/logout');
    //redirect to homepage
    setRedirect('/');
    //reset user data
    setUser(null);
  }

  if (!ready) {
    return 'Loading...';
  }

  //account page should not be visible if the user is not logged in
  if (ready && !user && !redirect) {
    return <Navigate to={'/login'} />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <AccountNav />
      {subpage === 'profile' && (
        <div className="text-center max-w-lg mx-auto">
          Logged in as {user.name} ({user.email})<br />
          <button className="primary max-w-sm mt-2" onClick={logout}>
            Log out
          </button>
        </div>
      )}
      {subpage === 'places' && <PlacesPage />}
    </div>
  );
}
