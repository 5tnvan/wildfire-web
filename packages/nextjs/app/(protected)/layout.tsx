"use client";

import { useContext, useEffect } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { AuthContext } from "../context";
import { Sidebar } from "~~/components/wildfire/Sidebar";
import { Topbar } from "~~/components/wildfire/Topbar";

/**
 * ProtectedLayout
 * Layout for user's that are logged in
 **/
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  /* CHECK ROUTES */
  const pathname = usePathname();
  const home = pathname === "/home";
  const { username, video_id, spark_id } = useParams();

  /* CONSUME CONTEXT */
  const { isAuthenticated } = useContext(AuthContext);

  /*
   * REDIRECT
   * Redirect to login, if not authenticated
   */
  useEffect(() => {
    if (
      isAuthenticated == false 
      && !(username || video_id || spark_id)
      && !home
    ) {
      router.push("/login");
    }
  }, [isAuthenticated, username, video_id, router]);

  return (
    <>
      <div id="auth-ui" className="flex flex-col md:flex-row">
        <Sidebar />
        <div id="auth-ui-right-wrapper" className="w-full">
          <Topbar />
          <div id="auth-ui-children-wrapper">{children}</div>
        </div>
      </div>
    </>
  );
};

export default ProtectedLayout;
