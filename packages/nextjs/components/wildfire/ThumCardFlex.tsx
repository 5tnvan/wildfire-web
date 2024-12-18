import Image from "next/image";
import FormatNumber from "./FormatNumber";
import { TimeAgo } from "./TimeAgo";
import { MapPinIcon } from "@heroicons/react/24/outline";
import { EyeIcon } from "@heroicons/react/24/solid";

const ThumbCardFlex = ({ index, data, onCta }: any) => {
  return (
    <div
      className="carousel-item mr-2 relative bg-black cursor-pointer hover:opacity-85 rounded-xl"
      data-index={index}
      onClick={() => onCta(data.id)}
    >
      <img src={data.thumbnail_url} className="thumbcard rounded-lg" />
      <div className="absolute right-0 px-2 m-2 bg-white text-black flex flex-row gap-1 rounded-full">
        <EyeIcon width={20} />
        <span className="font-medium">
          <FormatNumber number={data["3sec_views"][0].view_count} />
        </span>
      </div>
      {/* STRIP */}
      <div className="absolute bottom-0 w-full flex flex-row py-6 px-4 bg-base-200 bg-opacity-90 justify-between items-center">
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
          src={`/spark/spark-logo.png`}
          alt="hero"
          height={120}
          width={120}
          className=""
          draggable={false}
          style={{ width: "30px", height: "auto" }}
        />
      </div>
    </div>
  );
};

export default ThumbCardFlex;
