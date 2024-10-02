import { Livepeer } from "livepeer";

export const getLivepeerClient = () => {
  const livepeer = new Livepeer({ apiKey: process.env.NEXT_PUBLIC_LIVEPEER_API_KEY });

  return livepeer;
};
