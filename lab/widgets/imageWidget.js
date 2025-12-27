function createImageWidget(src, x, y, width, z) {
  const el = document.createElement("div");
  el.className = "widget image-widget";
  el.style.width = width + "px";

  const img = document.createElement("img");
  img.src = src;

  el.appendChild(img);
  place(el, x, y, z);

  document.getElementById("canvas").appendChild(el);
}
