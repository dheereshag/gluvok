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
            className="shadow rounded-xl px-5 py-4 text-gray-800 drop-shadow-sm"
          >
            <h3 className="uppercase mb-2 font-pacifico">
              {stepNumber}:
            </h3>
            <p>{stepDescription}</p>
          </li>
        );
      })}
    </ul>
  );
};

export default InstructionsList;
