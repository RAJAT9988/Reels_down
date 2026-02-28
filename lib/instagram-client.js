// Set browser-like headers so Instagram is less likely to return 401/403.
const axios = require("axios");
axios.defaults.headers.common["User-Agent"] =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
axios.defaults.headers.common["Accept-Language"] = "en-US,en;q=0.9";
axios.defaults.headers.common["Accept"] =
  "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8";

const { instagramGetUrl } = require("instagram-url-direct");
module.exports = { instagramGetUrl };
