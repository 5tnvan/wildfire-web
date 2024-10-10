import Image from "next/image";

import { MapPinIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "@heroicons/react/24/solid";

import FormatNumber from "./FormatNumber";
import { TimeAgo } from "./TimeAgo";

const ThumbCard = ({ index, data, onCta }: any) => {
  return (
    <div
      className="carousel-item relative bg-black cursor-pointer hover:opacity-85 rounded-xl mr-2"
      data-index={index}
      onClick={() => onCta(data)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        // src={`https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/${data.playback_id}/thumbnails/keyframes_0.png`}
        src={data.thumbnail_url}
        alt="Thumbnail is not generated yet!"
        className="thumbcard rounded-lg w-64"
      />
      <div className="absolute right-0 px-2 m-2 bg-white text-black flex flex-row gap-1 rounded-full">
        <EyeIcon width={20} />
        <span className="font-medium">
          <FormatNumber number={data["3sec_views"][0].view_count} />
        </span>
      </div>
      <div className="absolute bottom-0 w-full flex flex-row py-6 px-4 bg-base-200 bg-opacity-90 justify-between items-center rounded-bl-l">
        <div className="flex flex-row">
          <span className="text-base mr-2">
            <TimeAgo timestamp={data.created_at} />
          </span>
          {data.country && (
            <div className="font-semibold text-base flex flex-row gap-1">
              <MapPinIcon width={15} />
              <span>{data.country.name}</span>
            </div>
          )}
        </div>
        <Image
          src={`/wildfire-logo-lit.png`}
          alt="hero"
          height={120}
          width={120}
          className=""
          draggable={false}
          style={{ width: "70px", height: "auto" }}
        />
      </div>
    </div>
  );
};

export default ThumbCard;
