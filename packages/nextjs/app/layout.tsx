"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import "@rainbow-me/rainbowkit/styles.css";

import { ScaffoldEthAppWithProviders } from "@/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "@/components/ThemeProvider";
import { fetchVideo } from "@/utils/wildfire/fetch/fetchVideo";

import WildfireApp from "./wildfireLayout";

/**
 * SE-2 APP LAYOUT
 * Entry point to the app
 **/
const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  const { video_id } = useParams();
  const [videoMetadata, setVideoMetadata] = useState<any>();

  useEffect(() => {
    if (video_id) {
      (async () => {
        const res = await fetchVideo(video_id);
        setVideoMetadata(res);
      })();
    }
  }, [video_id]);

  return (
    <html suppressHydrationWarning>
      {videoMetadata && (
        <head>
          <title>{videoMetadata.profile.username}</title>
          <meta name="description" content={"3-second app"} />
          <meta property="og:image" content={videoMetadata.thumbnail_url} />
          <meta name="twitter:image" content={videoMetadata.thumbnail_url} />
        </head>
      )}
      <body>
        <ThemeProvider>
          <ScaffoldEthAppWithProviders>
            <WildfireApp>{children}</WildfireApp>
          </ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
