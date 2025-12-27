function createTechFactWidget(x, y, z) {
  const techFacts = [
    "Computers are fast at arithmetic but slow at memory access.",
    "Cache misses can cost more time than inefficient algorithms.",
    "GPUs became AI accelerators due to massive parallelism.",
    "Zero-based indexing comes from low-level memory addressing.",
    "The OS scheduler switches tasks every few milliseconds.",
    "Floating-point math cannot represent many decimals exactly.",
    "Browsers are among the most complex software systems.",
    "Concurrency bugs can exist even on single-core CPUs.",
    "Most performance bugs are memory-related, not CPU-related."
  ];

  const el = document.createElement("div");
  el.className = "widget tech-fact-widget";

  el.innerHTML = `
    <div class="antenna">
      <img src="assets/images/antenna.png" alt="antenna" />
      <span class="pulse"></span>
    </div>

    <div class="fact-content">
      <p class="fact-text"></p>
    </div>
  `;

  const factText = el.querySelector(".fact-text");

  place(el, x, y, z);
  document.getElementById("canvas").appendChild(el);

  let currentFact = "";

  function setNewFact() {
    let next;
    do {
      next = techFacts[Math.floor(Math.random() * techFacts.length)];
    } while (next === currentFact);

    currentFact = next;

    factText.classList.remove("show");
    setTimeout(() => {
      factText.textContent = currentFact;
      factText.classList.add("show");
    }, 300);
  }

  setNewFact();
  setInterval(setNewFact, 15000);

  // manual override
  el.addEventListener("click", setNewFact);
}
