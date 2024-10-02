"use client";

import { useContext, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

import { Sidebar } from "@/components/wildfire/Sidebar";
import { Topbar } from "@/components/wildfire/Topbar";

import { AuthContext } from "../context";

/**
 * ProtectedLayout
 * Layout for user's that are logged in
 **/
const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { username, video_id } = useParams();

  /* CONSUME CONTEXT */
  const { isAuthenticated } = useContext(AuthContext);

  /*
   * REDIRECT
   * Redirect to login, if not authenticated
   */
  useEffect(() => {
    if (isAuthenticated == false && !(username || video_id)) {
      router.push("/login");
    }
  }, [isAuthenticated, username, video_id, router]);

  return (
    <div id="auth-ui" className="flex flex-col md:flex-row h-dvh">
      <Sidebar />
      <div id="auth-ui-right-wrapper" className="flex flex-col w-full">
        <Topbar />
        <div id="auth-ui-children-wrapper" className="m-2 h-full overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ProtectedLayout;
