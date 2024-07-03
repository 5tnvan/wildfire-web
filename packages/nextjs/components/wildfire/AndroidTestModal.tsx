import React, { useRef } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import { useOutsideClick } from "~~/hooks/scaffold-eth/useOutsideClick";

const FollowersModal = ({ onClose }: any) => {
  const insideRef = useRef<any>(null);

  useOutsideClick(insideRef, () => {
    handleClose();
  });

  const handleClose = () => {
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div onClick={handleClose} className="btn bg-white hover:bg-white text-black self-start absolute left-2 top-2">
        <ChevronLeftIcon width={20} color="black" />
        Back
      </div>
      <div ref={insideRef} className="bg-white text-black content p-5 rounded-lg">
        <div className="font-semibold text-3xl">{"Be an early bird 🎉"}</div>
        <div className="mb-5">Help us test the Android App on Google Play</div>
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLSeSVc6O1raVMDdI2zVsCW0rMwA0h_NBZLVyEkdR5Xy3rxqL5A/viewform?embedded=true"
          width="640"
          height="451"
          frameBorder="0"
        >
          Loading…
        </iframe>
      </div>
    </div>
  );
};

export default FollowersModal;
