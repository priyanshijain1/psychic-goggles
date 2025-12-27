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
      const res = await fetch("http://127.0.0.1:3001/spotify/recently-played");
      const data = await res.json();
      if (!data) return;

      widget.querySelector(".album-art").src = data.albumArt;
      widget.querySelector(".title").textContent = data.title;
      widget.querySelector(".artist").textContent = data.artist;
      widget.querySelector(".lp").textContent = "Last played..";
    } catch {
      widget.querySelector(".title").textContent = "Spotify unavailable";
    }
  }

  update();
  setInterval(update, 15000);
}