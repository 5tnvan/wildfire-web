"use client";

import { AuthContext, AuthUserContext } from "./context";
import { Footer } from "~~/components/Footer";
import { Header } from "~~/components/Header";
import { useAuth } from "~~/hooks/wildfire/useAuth";
import { useProfile } from "~~/hooks/wildfire/useProfile";
import "~~/styles/width-height.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Wildpay App",
  description: "Wildpay | Dare to get paid?",
});
/**
 * WILDPAY APP LAYOUT
 * Entry point to the app
 **/
const WildfireApp = ({ children }: { children: React.ReactNode }) => {
  /* PROVIDE CONTEXTS */
  const { loading: loadingAuth, isAuthenticated, user, refetch: refetchAuth } = useAuth(); //<AuthContext>
  const { loading: loadingAuthUser, profile, account, refetch: refetchAuthUser } = useProfile(); //<AuthUserContext>

  console.log("wildpayLayout isAuthenticated", isAuthenticated);

  return (
    <>
      <AuthContext.Provider value={{ loadingAuth, isAuthenticated, user, refetchAuth }}>
        <AuthUserContext.Provider value={{ loadingAuthUser, profile, account, refetchAuthUser }}>
          <Header />
          {children}
          <Footer />
        </AuthUserContext.Provider>
      </AuthContext.Provider>
    </>
  );
};

export default WildfireApp;
