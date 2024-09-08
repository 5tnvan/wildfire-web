"use client";

import { AuthContext, AuthUserAccountContext, AuthUserContext, AuthUserFollowsContext } from "./context";
import { useAuth } from "~~/hooks/wildfire/useAuth";
import { useUserAccount } from "~~/hooks/wildfire/useUserAccount";
import { useUserFollows } from "~~/hooks/wildfire/useUserFollows";
import { useUserProfile } from "~~/hooks/wildfire/useUserProfile";
import "~~/styles/globals.css";
import "~~/styles/video-feed.css";
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
  const { loading: loadingAuthUser, profile, refetch: refetchAuthUser } = useUserProfile(); //<AuthUserContext>
  const { account, refetch: refetchAuthUserAccount } = useUserAccount(); //<AuthUserAccountContext>
  const { loading: loadingFollows, followers, following, followed, refetch: refetchAuthUserFollows } = useUserFollows(); //<AuthUserFollowsContext>

  return (
    <>
      <AuthContext.Provider value={{ loadingAuth, isAuthenticated, user, refetchAuth }}>
        <AuthUserContext.Provider value={{ loadingAuthUser, profile, account, refetchAuthUser }}>
          <AuthUserAccountContext.Provider value={{ account, refetchAuthUserAccount }}>
            <AuthUserFollowsContext.Provider
              value={{ loadingFollows, followers, following, followed, refetchAuthUserFollows }}
            >
              {children}
            </AuthUserFollowsContext.Provider>
          </AuthUserAccountContext.Provider>
        </AuthUserContext.Provider>
      </AuthContext.Provider>
    </>
  );
};

export default WildfireApp;
