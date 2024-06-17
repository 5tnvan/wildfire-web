import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/solid";

const LocationModal = ({ data, onClose, onCta }: any) => {
  const handleClose = () => {
    onClose();
  };

  const handleSetLocation = (location_id: any, location_name: any) => {
    onCta(location_id, location_name);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div onClick={handleClose} className="btn bg-white hover:bg-white text-black self-start absolute left-2 top-2">
        <ChevronLeftIcon width={20} color="black" />
        Back
      </div>
      <div className="bg-base-300 rounded-lg p-5">
        <div className="font-semibold mb-2">Choose location</div>
        <div className="h-screen-custom overflow-scroll">
          {data.map((country: any, index: any) => (
            <div
              key={index}
              className="btn bg-base-100 flex flex-row items-center justify-between w-full"
              onClick={() => handleSetLocation(country.id, country.name)}
            >
              <div className="flex flex-row items-center">{country.name}</div>
              <ChevronRightIcon width={10} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
