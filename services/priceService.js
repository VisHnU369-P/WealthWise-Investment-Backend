const axios = require("axios");

const getCryptoPrice = async (symbol) => {
  const res = await axios.get(
    `https://api.coingecko.com/api/v3/simple/price`,
    {
      params: {
        ids: symbol.toLowerCase(),
        vs_currencies: "usd"
      }
    }
  );
  return res.data[symbol.toLowerCase()].usd;
};

module.exports = { getCryptoPrice };

