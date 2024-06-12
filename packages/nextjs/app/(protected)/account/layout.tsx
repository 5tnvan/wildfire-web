"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../../context";

/**
 * ProtectedLayout
 * Layout for user's that are logged in
 **/
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  /* CONSUME CONTEXT */
  const { isAuthenticated } = useContext(AuthContext);

  /*
   * REDIRECT
   * Redirect to login, if not authenticated
   */
  useEffect(() => {
    if (isAuthenticated == false) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, router]);

  return <>{children}</>;
};

export default ProtectedLayout;
