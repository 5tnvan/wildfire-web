import React from "react";
import Link from "next/link";
import { SwitchTheme } from "~~/components/SwitchTheme";

/**
 * Site footer
 */
export const Footer = () => {
  return (
    <div className="flex flex-row py-5 px-1">
      <ul className="menu menu-horizontal w-full flex flex-row justify-center gap-2">
        <div className="flex justify-center items-center gap-2 text-sm w-full">
          <div className="text-center">
            <a href="/help" rel="noreferrer" className="link">
              Help
            </a>
          </div>
          <span>·</span>
          <div className="text-center">
            <a href="/privacy" rel="noreferrer" className="link">
              Privacy
            </a>
          </div>
          <span>·</span>
          <div className="text-center">
            <a href="/terms" rel="noreferrer" className="link">
              Terms
            </a>
          </div>
        </div>
        <div className="text-sm">
          ©{" "}
          <Link href="https://micalabs.org/" className="link">
            MicaLabs
          </Link>{" "}
          2024 - All right reserved
        </div>
      </ul>
      <div className="absolute right-0 p-4 pointer-events-none">
        <SwitchTheme className={`pointer-events-auto`} />
      </div>
    </div>
  );
};
