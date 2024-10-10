import React, { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";

interface CardProps {
  title: string;
  text: string;
  initialLikes: number;
}

const Card: React.FC<CardProps> = ({ title, text, initialLikes }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg p-4 bg-white my-6">
      <div className="flex items-start mb-4">
        <h2 className="text-xl font-bold">{title}</h2>
      </div>
      <p className="text-gray-700 text-base mb-4 line-clamp-3">{text}</p>
      <div className="flex items-center">
        <button onClick={handleLike} className="flex items-center">
          {isLiked ? (
            <FaHeart className="text-red-500 mr-1 h-5 w-5" />
          ) : (
            <FaRegHeart className="text-gray-500 mr-1 h-5 w-5" />
          )}
          <span className="text-gray-600">{likes}</span>
        </button>
      </div>
    </div>
  );
};

export default Card;
