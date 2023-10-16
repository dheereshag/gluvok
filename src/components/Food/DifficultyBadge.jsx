const DifficultyBadge = ({ difficulty }) => {
  return (
    <span
      className={`px-2.5 py-0.5 text-xs ${
        difficulty === "Easy"
          ? "bg-emerald-100 text-emerald-700"
          : difficulty === "Medium"
          ? "bg-amber-100 text-amber-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {difficulty}
    </span>
  );
};
export default DifficultyBadge;
