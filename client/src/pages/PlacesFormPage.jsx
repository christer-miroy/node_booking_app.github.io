import axios from 'axios';
import { useState } from 'react';
import Perks from '../components/Perks';
import PhotosUploader from '../components/PhotosUploader';
import AccountNav from '../components/AccountNav';
import { Navigate, useParams } from 'react-router-dom';

export default function PlacesFormPage() {
  //get the place id
  const { id } = useParams();

  //default values
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]); //uploaded photos from file
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuest, setMaxGuest] = useState(1);
  const [redirect, setRedirect] = useState(false);

  /* dynamic header and paragraph with uniform styling */
  function inputHeader(text) {
    return <h2 className="text-2xl mt-4 ">{text}</h2>;
  }

  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }

  /* add new place */
  async function addNewPlace(ev) {
    ev.preventDefault();
    await axios.post('/places', {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuest,
    });
    setRedirect(true);
  }

  if (redirect) {
    return <Navigate to={'/account/places'} />;
  }

  return (
    <>
      <div>
        <AccountNav />
        <form onSubmit={addNewPlace}>
          {preInput('Title', 'Title of the place')}
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={title}
            onChange={(ev) => setTitle(ev.target.value)}
          />

          {preInput('Address', 'Where is your place located?')}
          <input
            type="text"
            name="address"
            placeholder="Address"
            value={address}
            onChange={(ev) => setAddress(ev.target.value)}
          />

          {preInput(
            'Photos',
            'Copy image from link or Upload from your device',
          )}

          {/* upload photos */}
          <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />

          {preInput('Description', 'Brief description of your place')}
          <textarea
            name="description"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />

          {preInput('Perks', 'What makes your place special?')}
          {/* perks selection */}
          <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
            <Perks selected={perks} onChange={setPerks} />
          </div>

          {preInput('Extra Info', 'House rules, etc.')}
          <textarea
            name="extraInfo"
            value={extraInfo}
            onChange={(ev) => setExtraInfo(ev.target.value)}
          />

          {preInput(
            'Check-In, Check-out',
            'Remember to have some time window to prepare the room between check-in and check-out times.',
          )}
          <div className="grid gap-2 sm:grid-cols-3">
            <div>
              <h3 className="mt-2 -mb-1 ">Check-in</h3>
              <input
                type="text"
                name="checkIn"
                placeholder="16:00"
                value={checkIn}
                onChange={(ev) => setCheckIn(ev.target.value)}
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-1 ">Check-out</h3>
              <input
                type="text"
                name="checkOut"
                placeholder=""
                value={checkOut}
                onChange={(ev) => setCheckOut(ev.target.value)}
              />
            </div>
            <div>
              <h3 className="mt-2 -mb-1 ">Maximum number of guests:</h3>
              <input
                type="number"
                name="maxGuest"
                value={maxGuest}
                onChange={(ev) => setMaxGuest(ev.target.value)}
              />
            </div>
          </div>
          <button className="primary my-4">Save</button>
        </form>
      </div>
    </>
  );
}
