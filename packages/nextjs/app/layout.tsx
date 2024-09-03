"use client"
import { useParams } from "next/navigation";
import WildfireApp from "./wildfireLayout";
import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import { useEffect, useState } from "react";
import { fetchVideo } from "~~/utils/wildfire/fetch/fetchVideo";

const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : `http://localhost:${process.env.PORT || 3000}`;

/**
 * SE-2 APP LAYOUT
 * Entry point to the app
 **/
const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  const { video_id } = useParams();
  const [videoMetadata, setVideoMetadata] = useState<any>();

  const init = async () => {
    const res = await fetchVideo(video_id);
    setVideoMetadata(res);
  };

  useEffect(() => {
    if (video_id) {
      init();
    }
  }, [video_id]);

  return (
    <html suppressHydrationWarning>
      {videoMetadata &&
        <head>
          <title>{videoMetadata.profile.username} | wildfire</title>
          <meta name="description" content={"3-second app"} />
          <meta property="og:image" content={videoMetadata.thumbnail_url} />
          <meta name="twitter:image" content={videoMetadata.thumbnail_url} />
        </head>
      }
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
