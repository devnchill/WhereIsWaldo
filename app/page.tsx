"use client";
import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [menuCoord, setMenuCoord] = useState<{ x: number; y: number } | null>(
    null,
  );

  function handleSelectChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const selectedValue = e.target.value;
    console.log("selectedValue: ", selectedValue);
    setMenuVisible(false);
  }

  function handleClick(e: React.MouseEvent<HTMLImageElement, MouseEvent>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMenuCoord({ x, y });
    setMenuVisible(true);
    console.log(menuCoord);
  }

  function displayMenu(
    coord: { x: number; y: number } | null,
  ): React.ReactElement | null {
    if (!coord) return null;
    return (
      <div className="absolute border-solid border-red-2 right-0 top-30">
        <select
          onChange={handleSelectChange}
          className="border border-gray-300 rounded p-2"
        ></select>
      </div>
    );
  }

  return (
    <div className="flex justify-center gap-40">
      <Image
        className="relative"
        onClick={handleClick}
        width={600}
        height={800}
        src={"/map.png"}
        alt="puzzle"
      />
      <section id="characters" className="flex flex-col gap-2">
        <Image src={"/target1.png"} width={200} height={200} alt="target1" />
        <Image src={"/target2.png"} width={200} height={200} alt="target2" />
        <Image src={"/target3.png"} width={200} height={200} alt="target3" />
      </section>
      {menuVisible && displayMenu(menuCoord)}
    </div>
  );
}
