export default async function handler(req, res) {
  try {
    const { message } = req.body;

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
          model: "mistralai/Mistral-7B-Instruct-v0.2",
          messages: [
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("HF response:", data);

    if (!response.ok) {
      return res.status(500).json({
        reply: "Errore HF: " + (data.error || "unknown")
      });
    }

    const reply =
      data.choices?.[0]?.message?.content || "Nessuna risposta";

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);

    return res.status(500).json({
      reply: "Errore server: " + err.message
    });
  }
}
