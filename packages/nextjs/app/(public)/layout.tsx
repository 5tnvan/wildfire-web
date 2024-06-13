"use client";

import { Footer } from "~~/components/wildfire/Footer";
import { Header } from "~~/components/wildfire/Header";

/**
 * ProtectedLayout
 * Layout for user's that are logged in
 **/
const PublicLayout = ({ children }: { children: React.ReactNode }) => {

  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default PublicLayout;
