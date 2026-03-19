export default async function handler(req, res) {
  try {
    console.log("Request body:", req.body);

    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Messaggio vuoto" });
    }

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/mistralai/Mistral-7B-Instruct-v0.2",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          inputs: `<s>[INST] ${message} [/INST]`
        })
      }
    );

    console.log("Status HF:", response.status);

    const data = await response.json();

    console.log("HF response:", data);

    if (!response.ok) {
      return res.status(500).json({
        reply: "Errore HF: " + (data.error || "unknown")
      });
    }

    let reply = "Nessuna risposta";

    if (Array.isArray(data)) {
      reply = data[0]?.generated_text || reply;
    }

    return res.status(200).json({ reply });

  } catch (err) {
    console.error("SERVER ERROR:", err);

    return res.status(500).json({
      reply: "Errore server: " + err.message
    });
  }
}
