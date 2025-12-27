function createQuoteWidget(text, x, y, z) {
  const el = document.createElement("div");
  el.className = "widget quote-widget";
  el.textContent = text;

  place(el, x, y, z);
  document.getElementById("canvas").appendChild(el);
}
