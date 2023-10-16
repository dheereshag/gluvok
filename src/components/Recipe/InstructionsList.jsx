const InstructionsList = ({ singleFood, showAllInstructions }) => {
  return (
    <ul className="flex flex-col gap-2 mr-4 text-sm">
      {(showAllInstructions
        ? singleFood.method
        : singleFood.method.slice(0, 2)
      ).map((method, index) => {
        const stepNumber = Object.keys(method)[0];
        const stepDescription = method[stepNumber];
        return (
          <li
            key={stepNumber}
            className="bg-white shadow rounded-xl px-5 py-4 text-gray-800 drop-shadow-sm"
          >
            <p className="font-semibold uppercase mb-2 text-base font-dm-sans">
              {stepNumber}:
            </p>
            <p>{stepDescription}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default InstructionsList;
