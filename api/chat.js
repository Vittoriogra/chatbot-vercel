export default async function handler(req, res) {
  const { message } = req.body;

  try {
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

    const data = await response.json();

    console.log("HF response:", data);

    let reply = "Errore";

    if (Array.isArray(data)) {
      reply = data[0]?.generated_text || "Nessuna risposta";
    } else if (data.error) {
      reply = "Errore API: " + data.error;
    }

    res.status(200).json({ reply });

  } catch (err) {
    res.status(500).json({ reply: "Errore server" });
  }
}
