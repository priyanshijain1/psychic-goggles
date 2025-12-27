function createJSONWidget(x, y, z, a, b, c) {
  const el = document.createElement("div");
  el.className = "widget json-widget";

  el.innerHTML = `
    <div class="json-block">
      <div class="json-line">
        <span class="brace">{</span>
      </div>

      <div class="json-line indent">
        <span class="key">"framework"</span><span class="colon">:</span>
        <span class="value">"${a}"</span><span class="comma">,</span>
      </div>

      
      <div class="json-line indent">
      <span class="key">"inspiration"</span><span class="colon">:</span>
      <span class="value">"${b}"</span>
      </div>
      
      <div class="json-line indent">
        <span class="key">"current_status"</span><span class="colon">:</span>
        <span class="value">"${c}"</span><span class="comma">,</span>
      </div>
      <div class="json-line">
        <span class="brace">}</span>
      </div>
    </div>
  `;

  place(el, x, y, z);
  document.getElementById("canvas").appendChild(el);
}
