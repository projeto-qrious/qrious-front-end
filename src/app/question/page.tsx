"use client";

import { FaHeart, FaRegHeart } from "react-icons/fa";
import Header from "../components/Header";
import { useState } from "react";
import Goback from "../components/GobackIcon";
import Link from "next/link";

interface QuestionProps {
  initialLikes: number;
}

export default function Question({ initialLikes }: QuestionProps) {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  return (
    <>
      <Header />
      <section className="pt-28 md:max-w-[1080px] mx-auto">
        <div className="md:m-6 md:shadow-lg md:p-6 ">
          <div className=" flex flex-row justify-between items-center px-6">
            <Link href="/">
              <Goback />
            </Link>
            <h2 className="px-6 text-2xl font-semibold">Maria</h2>
          </div>
          <div className="border-b border-gray-200 pt-2"></div>
          <p className="text-gray-700 text-base px-6 text-justify pt-4">
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using Content here, content
            here, making it look like readable English.
          </p>
          <div className="px-6 pt-6">
            <button onClick={handleLike} className="flex items-center">
              {isLiked ? (
                <FaHeart className="text-red-500 mr-1 h-5 w-5" />
              ) : (
                <FaRegHeart className="text-red-500 mr-1 h-5 w-5" />
              )}
              <span className="text-gray-600">10</span>
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
