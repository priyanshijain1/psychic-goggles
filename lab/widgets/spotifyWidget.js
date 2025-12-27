function createSpotifyWidget(x, y) {
  const widget = document.createElement("div");
  widget.className = "spotify-widget";

  widget.innerHTML = `
    <img class="album-art" />
    <div class="info">
      <p class="lp"></p>
      <p class="title">Loading...</p>
      <p class="artist"></p>
    </div>
    <div class="player">
      <span class="icon">⏮</span>
      <span class="icon">▶</span>
      <span class="icon">⏭</span>
    </div>
  `;

  place(widget, x, y);
  document.getElementById("canvas").appendChild(widget);

  async function update() {
    try {
      const res = await fetch("/api/spotify");
      const data = await res.json();
      if (!data?.items?.length) return;

      const track = data.items[0].track;

      widget.querySelector(".album-art").src =
        track.album.images[0].url;

      widget.querySelector(".title").textContent =
        track.name;

      widget.querySelector(".artist").textContent =
        track.artists.map(a => a.name).join(", ");

      widget.querySelector(".lp").textContent = "Last played..";
    } catch (e) {
      console.log(e);
      widget.querySelector(".title").textContent =
        "Spotify unavailable";
    }
  }

  update();
  setInterval(update, 15000);
}