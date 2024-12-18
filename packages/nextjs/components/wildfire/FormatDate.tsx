import React from "react";

type Props = {
  timestamp: any; // Accepts a valid date input
};

export const FormatDate = ({ timestamp }: Props) => {
  const formatDate = (timestamp: any) => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      month: "short", // Abbreviated month (e.g., "Sep")
      day: "numeric", // Numeric day (e.g., "10")
      year: "numeric", // Full year (e.g., "2023")
    };

    return date.toLocaleDateString("en-US", options); // Format based on locale
  };

  return <span>{formatDate(timestamp)}</span>;
};
