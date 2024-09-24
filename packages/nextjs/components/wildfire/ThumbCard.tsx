import Image from "next/image";

import { EyeIcon } from "@heroicons/react/24/solid";

import FormatNumber from "./FormatNumber";
import { TimeAgo } from "./TimeAgo";

const ThumbCard = ({ index, data, onCta }: any) => {
  return (
    <div
      className="carousel-item relative bg-black cursor-pointer hover:opacity-85 rounded-xl"
      data-index={index}
      onClick={() => onCta(data)}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://vod-cdn.lp-playback.studio/raw/jxf4iblf6wlsyor6526t4tcmtmqa/catalyst-vod-com/hls/${data.playback_id}/thumbnails/keyframes_0.png`}
        alt="Thumbnail is not generated yet!"
        className="rounded-lg"
      />
      <div className="absolute right-0 px-2 m-2 bg-white text-black flex flex-row gap-1 rounded-full">
        <EyeIcon width={20} />
        <span className="font-medium">
          <FormatNumber number={data["3sec_views"][0].view_count} />
        </span>
      </div>
      <div className="absolute bottom-0 w-full flex flex-row p-4 bg-base-200 justify-between items-center rounded-bl-xl">
        <div>
          <span className="font-semibold text-sm">{data.country && data.country.name}</span>
          <span className="text-sm">
            <TimeAgo timestamp={data.created_at} />
          </span>
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
