export default function Loading() {
  return (
    <div className="flex items-center justify-center h-128">
      <img
        src="ramen.gif"
        alt="loading"
        className="w-28 h-28"
        as="image"
        rel="preload"
      />
    </div>
  );
}
