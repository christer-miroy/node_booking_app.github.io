export default function Perks({ selected, onChange }) {
  function handleCheckboxClick(ev) {
    const { checked, name } = ev.target;
    if (checked) {
      onChange([...selected, name]);
    } else {
      onChange([...selected.filter((selectedName) => selectedName !== name)]);
    }
  }

  return (
    <div>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input type="checkbox" name="wifi" onChange={handleCheckboxClick} />
        <span>Wifi</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input type="checkbox" name="parking" onChange={handleCheckboxClick} />
        <span>Free Parking</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input type="checkbox" name="tv" onChange={handleCheckboxClick} />
        <span>TV</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input type="checkbox" name="pets" onChange={handleCheckboxClick} />
        <span>Pets</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input type="checkbox" name="entrance" onChange={handleCheckboxClick} />
        <span>Private Entrance</span>
      </label>
      <label className="border p-4 flex rounded-2xl gap-2 items-center cursor-pointer">
        <input
          type="checkbox"
          name="complementaryDrinks"
          onChange={handleCheckboxClick}
        />
        <span>Complementary Coffee/Tea/Juice</span>
      </label>
    </div>
  );
}
