import Image from "next/image";
import FormatNumber from "./FormatNumber";
import { TimeAgo } from "./TimeAgo";
import { EyeIcon } from "@heroicons/react/24/solid";

const ThumbCard = ({ index, data, onCta }: any) => {
  return (
    <div
      className="carousel-item mr-2 relative bg-black cursor-pointer hover:opacity-85 rounded-xl"
      data-index={index}
      onClick={() => onCta(data.id)}
    >
      <img src={data.thumbnail_url} className="h-screen rounded-lg" style={{ height: "calc(100vh - 71px)" }} />
      <div className="absolute right-0 px-2 m-2 bg-white text-black flex flex-row gap-1 rounded-full">
        <EyeIcon width={20} />
        <span className="font-medium">
          <FormatNumber number={data["3sec_views"][0].view_count} />
        </span>
      </div>
      <div className="absolute bottom-0 w-full flex flex-row p-4 bg-base-200 justify-between items-center">
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
