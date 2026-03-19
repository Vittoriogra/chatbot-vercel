let interval;

async function send() {
  const input = document.getElementById("input");
  const box = document.getElementById("box");

  const message = input.value;

  if (!message) return;

  // ⏳ loading iniziale
  box.innerHTML = `<div class="loading" id="loading">Attendi</div>`;

  let dots = 0;

  // animazione puntini
  interval = setInterval(() => {
    dots = (dots + 1) % 4;
    const el = document.getElementById("loading");
    if (el) {
      el.innerText = "Attendi" + ".".repeat(dots);
    }
  }, 500);

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await res.json();

    clearInterval(interval);

    // 🔁 mostra risposta
    box.innerHTML = `
      <div class="response">${data.reply}</div>
      <button class="reset-btn" onclick="reset()">Nuova richiesta</button>
    `;

  } catch (err) {
    clearInterval(interval);

    box.innerHTML = `
      <div class="response">Errore, riprova.</div>
      <button class="reset-btn" onclick="reset()">Riprova</button>
    `;
  }
}

function reset() {
  const box = document.getElementById("box");

  box.innerHTML = `
    <textarea id="input" placeholder="Scrivi la tua richiesta di preghiera"></textarea>
  `;
}
