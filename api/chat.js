export default async function handler(req, res) {
  try {
    console.log("Request body:", req.body);

    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ reply: "Messaggio vuoto" });
    }

    const response = await fetch(
      "https://router.huggingface.co/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "HuggingFaceH4/zephyr-7b-beta",
          messages: [
            { role: "system", content: "Sei un assistente utile." },
            { role: "user", content: message }
          ]
        })
      }
    );

    console.log("Status HF:", response.status);

    // 🔒 parsing sicuro (evita crash)
    const text = await response.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("Invalid JSON:", text);
      return res.status(500).json({
        reply: "Errore: risposta non valida dal server AI"
      });
    }

    console.log("HF response:", data);

    // ❌ errore API
    if (!response.ok) {
      const errorMsg =
        data?.error?.message ||
        data?.error ||
        JSON.stringify(data);

      return res.status(500).json({
        reply: "Errore HF: " + errorMsg
      });
    }

    // ✅ risposta normale
    const reply =
      data?.choices?.[0]?.message?.content ||
      "Nessuna risposta";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);

    return res.status(500).json({
      reply: "Errore server: " + err.message
    });
  }
}
