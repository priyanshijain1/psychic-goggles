// Galaxy-themed Color Palettes
const colorPalettes = [
  {
    name: "Nebula Dreams",
    colors: ["#6b2d5cd1", "#a42e5bd6", "#d95f69dc", "#f2a65ad6", "#ffd83dd6"]
  },
  {
    name: "Deep Space",
    colors: ["#0d1b2a9a", "#1b263bd6", "#415a77d2", "#778da9d4", "#e0e1ddca"]
  },
  {
    name: "Aurora Borealis",
    colors: ["#05668ddc", "#028090dc", "#00a897dc", "#02c399dc", "#f0f3bddc"]
  },
  {
    name: "Cosmic Purple",
    colors: ["#240046", "#3C096C", "#5A189A", "#7209B7", "#B565D8"]
  },
  {
    name: "Supernova",
    colors: ["#ff0a53dc", "#ff477eda", "#ff5c8adf", "#ff7096df", "#ffa8b9db"]
  },
  {
    name: "Galaxy Night",
    colors: ["#090C9B", "#3C0F70", "#6A0572", "#A6026A", "#E60965"]
  },
  {
    name: "Starlight",
    colors: ["#F0E5CF", "#B8D4E8", "#7AA5C6", "#4876A4", "#2C4A7C"]
  },
  {
    name: "Meteor Shower",
    colors: ["#ee6452de", "#f79071e0", "#fac15edd", "#f3de8ae2", "#ddf3b5da"]
  }
];

function createColorPaletteWidget(x, y) {
  const widget = document.createElement("div");
  widget.className = "color-palette-widget widget";

  widget.innerHTML = `
    <div class="palette-header">
      <h3 class="palette-name">Loading...</h3>
      <div class="palette-controls">
        <button class="palette-btn prev" title="Previous Palette">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button class="palette-btn next" title="Next Palette">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>

    <div class="color-swatches"></div>
    <div class="hex-codes"></div>

    <div class="copy-notification">✓ Copied!</div>
  `;

  place(widget, x, y);
  document.getElementById("canvas").appendChild(widget);

  // State
  let currentPaletteIndex = 0;

  // Elements
  const nameEl = widget.querySelector(".palette-name");
  const swatchesContainer = widget.querySelector(".color-swatches");
  const hexCodesContainer = widget.querySelector(".hex-codes");
  const prevBtn = widget.querySelector(".prev");
  const nextBtn = widget.querySelector(".next");
  const notification = widget.querySelector(".copy-notification");

  // Render palette
  function renderPalette() {
    const palette = colorPalettes[currentPaletteIndex];

    // Update name with animation
    nameEl.style.opacity = "0";
    setTimeout(() => {
      nameEl.textContent = palette.name;
      nameEl.style.transition = "opacity 0.4s ease";
      nameEl.style.opacity = "1";
    }, 200);

    // Clear containers
    swatchesContainer.innerHTML = "";
    hexCodesContainer.innerHTML = "";

    // Create swatches
    palette.colors.forEach((color, index) => {
      // Create swatch
      const swatch = document.createElement("div");
      swatch.className = "color-swatch";
      swatch.style.backgroundColor = color;
      swatch.style.animationDelay = `${index * 0.05}s`;
      swatch.onclick = () => copyToClipboard(color);
      swatchesContainer.appendChild(swatch);

      // Create hex code
      const hexCode = document.createElement("div");
      hexCode.className = "hex-code";
      hexCode.textContent = color.toUpperCase();
      hexCode.onclick = () => copyToClipboard(color);
      hexCodesContainer.appendChild(hexCode);
    });
  }

  // Copy to clipboard
  function copyToClipboard(color) {
    navigator.clipboard.writeText(color).then(() => {
      showNotification();
    }).catch(err => {
      console.error("Failed to copy:", err);
    });
  }

  // Show copy notification
  function showNotification() {
    notification.classList.add("show");
    setTimeout(() => {
      notification.classList.remove("show");
    }, 1500);
  }

  // Navigation
  prevBtn.addEventListener("click", () => {
    currentPaletteIndex = (currentPaletteIndex - 1 + colorPalettes.length) % colorPalettes.length;
    renderPalette();
  });

  nextBtn.addEventListener("click", () => {
    currentPaletteIndex = (currentPaletteIndex + 1) % colorPalettes.length;
    renderPalette();
  });

  // Initialize
  renderPalette();

  // Auto-cycle through palettes (optional)
  // setInterval(() => {
  //   currentPaletteIndex = (currentPaletteIndex + 1) % colorPalettes.length;
  //   renderPalette();
  // }, 10000); // Change every 10 seconds
}