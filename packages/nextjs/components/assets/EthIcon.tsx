import React from "react";

type Props = {
  width: any;
  height: any;
  fill: any;
};

export const EthIcon = ({ width, height, fill }: Props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 24 24">
      <path fill={fill} d="m12 1.75l-6.25 10.5L12 16l6.25-3.75zM5.75 13.5L12 22.25l6.25-8.75L12 17.25z"></path>
    </svg>
  );
};
