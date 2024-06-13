"use client";

import { useEffect, useRef, useState } from "react";
import { NextPage } from "next";

const Test: NextPage = () => {
  const myRef = useRef<any>();
  const [visible, setVisible] = useState<boolean | null>(null);

  console.log("visible", visible);

  // Set up Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      console.log(entries[0]);

    });

    observer.observe(myRef.current);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <div className="p-10">Minimouse</div>
      <div className="p-10">Micky</div>
      <div className="p-10">Menu</div>
      <div className="p-10">Minimouse</div>
      <div className="p-10">Micky</div>
      <div className="p-10">Menu</div>
      <div className="p-10">Minimouse</div>
      <div className="p-10">Micky</div>
      <div className="p-10">Menu</div>
      <div ref={myRef} className="p-10 bg-lime-500">
        Mukbang
      </div>
      <div className="p-10">Minimouse</div>
      <div className="p-10">Micky</div>
      <div className="p-10">Menu</div>
      <div className="p-10">Minimouse</div>
      <div className="p-10">Micky</div>
      <div className="p-10">Menu</div>
    </div>
  );
};

export default Test;
