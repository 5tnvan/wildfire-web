import { Livepeer } from "livepeer";

export const livepeerClient = new Livepeer({
  apiKey: process.env.NEXT_PUBLIC_LIVEPEER_API_KEY, // Your API key
});