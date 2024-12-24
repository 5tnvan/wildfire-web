"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type { NextPage } from "next";

const Landing: NextPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /home
    router.push("/home");
  }, [router]);

  return null; // No need to render anything as we're redirecting
};

export default Landing;
