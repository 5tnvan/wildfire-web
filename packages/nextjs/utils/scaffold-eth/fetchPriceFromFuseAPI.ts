/**
 * Fetch the Fuse token price using the Fuse Trade API with the fetch API.
 * @param targetNetwork - The network configuration (e.g., mainnet, testnet)
 * @returns {Promise<number>} - The price of the Fuse token in USD
 */
export const fetchPriceFromFuseAPI = async (): Promise<number> => {
  try {
    const myHeaders = new Headers();
    myHeaders.append("Accept", "application/json");

    const requestOptions: RequestInit = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/simple/price?ids=fuse-network-token&vs_currencies=usd",
        requestOptions,
      );

      if (!response.ok) {
        console.error("HTTP error, status =", response.status);
        return 0; // Return 0 if there's an error in fetching
      }

      const result = await response.json();
      const price = result["fuse-network-token"]?.usd || 0;
      console.log("price", price);
      return price;
    } catch (error) {
      console.error("Error fetching Fuse price:", error);
      return 0; // Return 0 if there's an error
    }
  } catch (error) {
    console.error(`Error fetching Fuse price from Fuse API:`, error);
    return 0;
  }
};
