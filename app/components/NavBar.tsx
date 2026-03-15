"use client";
import { useScore } from "../context/score";

const NavBar = () => {
  const { score } = useScore();

  return (
    <nav className="h-15 flex justify-between p-4 bg-gray-100">
      <span>MapIt</span>
      <span>Score: {score}</span>
    </nav>
  );
};

export default NavBar;
