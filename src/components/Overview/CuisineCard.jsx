"use client";
import { useState } from "react";

const CuisineCard = ({ icon, title, description }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 80;

  const handleReadMoreClick = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div>
      <span className="flex items-center gap-2 text-gray-800 text-lg mb-2">
        <i className={icon}></i>
        <h2 className="font-pacifico">{title}</h2>
      </span>
      <p className={`text-xs font-dm-sans`}>
        {isExpanded ? description : `${description.substring(0, maxLength)}...`}
      </p>
      <button
        onClick={handleReadMoreClick}
        className="text-right mr-2 mt-1 text-blue-700 font-semibold font-dm-sans text-2xs"
      >
        {isExpanded ? "... Read less" : "... Read more"}
      </button>
    </div>
  );
};

export default CuisineCard;
