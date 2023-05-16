import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Perks from '../components/Perks';
import axios from 'axios';

export default function PlacesPage() {
  const { action } = useParams();
  //   console.log(action); //new

  //default values
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]); //uploaded photos from file
  const [photoLink, setPhotoLink] = useState(''); //copy photo from link
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [maxGuest, setMaxGuest] = useState(1);

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

  /* add photo by link functionality */
  async function addPhotoByLink(ev) {
    ev.preventDefault();
    const { data: filename } = await axios.post('/upload-by-link', {
      link: photoLink,
    });
    setAddedPhotos((prev) => {
      return [...prev, filename];
    });

    //reset state
    setPhotoLink('');
  }

  /* upload photo from file functionality */
  function uploadPhoto(ev) {
    ev.preventDefault();
    const files = ev.target.files;
    const data = new FormData();
    for (let i = 0; i < files.length; i++) {
      data.append('photos', files[i]);
    }

    axios
      .post('/upload', data, {
        headers: { 'Content-type': 'multipart/form-data' },
      })
      .then((response) => {
        const { data: filenames } = response;
        setAddedPhotos((prev) => {
          return [...prev, ...filenames];
        });
      });
  }

  return (
    <div>
      {/* add new button will display only if the action is not new */}
      {action !== 'new' && (
        <div className="text-center">
          <Link
            className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full"
            to={'/account/places/new'}
          >
            {/* plus icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Add New Place
          </Link>
        </div>
      )}
      {/* display form if action is new */}
      {action === 'new' && (
        <div>
          <form action="">
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

            {/* upload photo from link */}
            <div className="flex w-auto">
              <input
                type="text"
                name="photoLink"
                placeholder="{Add using a link ...jpg}"
                value={photoLink}
                onChange={(ev) => setPhotoLink(ev.target.value)}
              />
              <button
                className="bg-gray-200 px-4 gap-2 rounded-2xl"
                onClick={addPhotoByLink}
              >
                Add photo from link
              </button>
            </div>

            <div className="grid gap-2 grid-cols-3 lg:grid-col-6 md:grid-cols-4 mt-2">
              {/* arrays of photos to be uploaded here */}
              {addedPhotos.length > 0 &&
                addedPhotos.map((link) => (
                  <div className="h-32 flex">
                    <img
                      className="rounded-2xl w-full object-cover"
                      src={'http://localhost:4000/uploads/' + link}
                      alt=""
                    />
                  </div>
                ))}

              {/* upload photo from file */}
              <label className="h-32 cursor-pointer flex items-center justify-center gap-1 border bg-transparent rounded-2xl text-2xl p-2">
                <input
                  type="file"
                  multiple
                  className="hidden"
                  onChange={uploadPhoto}
                />
                {/* upload icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                  />
                </svg>
                Upload from file
              </label>
            </div>

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
      )}
    </div>
  );
}
