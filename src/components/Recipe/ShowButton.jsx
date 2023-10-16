const ShowButton = ({ showAll, setShowAll }) => {
  return (
    <button
      onClick={() => setShowAll(!showAll)}
      className="text-sm float-right text-blue-700 font-semibold font-dm-sans mr-4 mt-3"
    >
      {showAll ? `Show Less` : `Show All`}
    </button>
  );
};

export default ShowButton;
