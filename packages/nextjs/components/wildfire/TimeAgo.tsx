import React from "react";

type Props = {
  timestamp: any;
};

export const TimeAgo = ({ timestamp }: Props) => {
  const currentTimestamp = new Date().getTime();
  const yourTimestampString = timestamp;
  const yourTimestamp = new Date(yourTimestampString).getTime();

  const timeDifference = currentTimestamp - yourTimestamp;

  const yearsAgo = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 365));
  const monthsAgo = Math.floor((timeDifference % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
  const daysAgo = Math.floor((timeDifference % (1000 * 60 * 60 * 24 * 30)) / (1000 * 60 * 60 * 24));
  const hoursAgo = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutesAgo = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  return (
    <div>
      {yearsAgo > 0 && `${yearsAgo}y `}
      {yearsAgo === 0 && monthsAgo > 0 && `${monthsAgo}mo`}
      {yearsAgo === 0 && monthsAgo === 0 && daysAgo > 0 && `${daysAgo}d`}
      {yearsAgo === 0 && monthsAgo === 0 && daysAgo === 0 && hoursAgo > 0 && `${hoursAgo}h`}
      {yearsAgo === 0 && monthsAgo === 0 && daysAgo === 0 && hoursAgo === 0 && `${minutesAgo}m`}
    </div>
  );
};

export const TimeAgoUnix = ({ timestamp }: Props) => {
  const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds
  const yourTimestamp = timestamp;

  const timeDifference = currentTimestamp - yourTimestamp;

  const yearsAgo = Math.floor(timeDifference / (60 * 60 * 24 * 365));
  const monthsAgo = Math.floor((timeDifference % (60 * 60 * 24 * 365)) / (60 * 60 * 24 * 30));
  const daysAgo = Math.floor((timeDifference % (60 * 60 * 24 * 30)) / (60 * 60 * 24));
  const hoursAgo = Math.floor((timeDifference % (60 * 60 * 24)) / (60 * 60));
  const minutesAgo = Math.floor((timeDifference % (60 * 60)) / 60);

  return (
    <div>
      {yearsAgo > 0 && `${yearsAgo}y `}
      {yearsAgo === 0 && monthsAgo > 0 && `${monthsAgo}mo `}
      {yearsAgo === 0 && monthsAgo === 0 && daysAgo > 0 && `${daysAgo}d `}
      {yearsAgo === 0 && monthsAgo === 0 && daysAgo === 0 && hoursAgo > 0 && `${hoursAgo}h `}
      {yearsAgo === 0 && monthsAgo === 0 && daysAgo === 0 && hoursAgo === 0 && `${minutesAgo}m`}
    </div>
  );
};
