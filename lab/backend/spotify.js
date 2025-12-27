const axios = require("axios");

const {
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_REFRESH_TOKEN
} = process.env;

async function getAccessToken() {
  try {
    const res = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: SPOTIFY_REFRESH_TOKEN
      }),
      {
        headers: {
          Authorization:
            "Basic " +
            Buffer.from(
              SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
            ).toString("base64"),
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    return res.data.access_token;
  } catch (err) {
    console.error("ACCESS TOKEN ERROR:", err.response?.data || err.message);
    throw err;
  }
}

async function getRecentlyPlayed() {
  try {
    const token = await getAccessToken();

    const res = await axios.get(
      "https://api.spotify.com/v1/me/player/recently-played?limit=1",
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const item = res.data.items[0];
    if (!item) return null;

    return {
      title: item.track.name,
      artist: item.track.artists.map(a => a.name).join(", "),
      albumArt: item.track.album.images[0].url,
      playedAt: item.played_at,
      songUrl: item.track.external_urls.spotify
    };
  } catch (err) {
    console.error("RECENTLY PLAYED ERROR:", err.response?.data || err.message);
    throw err;
  }
}

module.exports = { getRecentlyPlayed };
