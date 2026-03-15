"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [menuCoord, setMenuCoord] = useState<{ x: number; y: number } | null>(
    null,
  );

  useEffect(() => {
    const startRound = async () => {
      localStorage.removeItem("roundId");
      try {
        const response = await fetch("/api/round/start", { method: "POST" });
        const parsedRes = await response.json();
        localStorage.setItem("roundId", parsedRes.roundId);
      } catch (error) {
        console.error(error);
      }
    };

    startRound();
  }, []);

  async function handleSelectChange(character: string) {
    if (!menuCoord) return;

    const res = await fetch("/api/round/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        roundId: localStorage.getItem("roundId"),
        character,
        x: menuCoord.x,
        y: menuCoord.y,
      }),
    });

    const data = await res.json();
    console.log(data);
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
      <div
        className="absolute border bg-white p-2 flex gap-2 right-0 top-30"
        style={{
          left: `${coord.x * 100}%`,
          top: `${coord.y * 100}%`,
          transform: "translate(10px,10px)",
          zIndex: 50,
        }}
      >
        <img
          src="/target1.png"
          width={60}
          height={60}
          onClick={() => handleSelectChange("target1")}
        />

        <img
          src="/target2.png"
          width={60}
          height={60}
          onClick={() => handleSelectChange("target2")}
        />

        <img
          src="/target3.png"
          width={60}
          height={60}
          onClick={() => handleSelectChange("target3")}
        />
      </div>
    );
  }
  return (
    <div className="flex justify-center gap-40 ">
      <div className="relative">
        <Image
          className="relative"
          onClick={handleClick}
          width={600}
          height={800}
          src={"/map.png"}
          alt="puzzle"
        />
        {menuVisible && displayMenu(menuCoord)}
      </div>
      <section id="characters" className="flex flex-col gap-2">
        <Image src={"/target1.png"} width={200} height={200} alt="target1" />
        <Image src={"/target2.png"} width={200} height={200} alt="target2" />
        <Image src={"/target3.png"} width={200} height={200} alt="target3" />
      </section>
    </div>
  );
}
