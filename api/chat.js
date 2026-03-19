export default async function handler(req, res) {
  try {
    const { message } = req.body || {};

    if (!message) {
      return res.status(400).json({ reply: "Messaggio vuoto" });
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://tuo-sito.com", // opzionale
          "X-Title": "Chatbot Test" // opzionale
        },
        body: JSON.stringify({
          model: "nvidia/nemotron-3-super-120b-a12b:free",
          max_tokens: 50,
          messages: [
            { role: "system", content: "Devi rispondere a richieste di preghiera. Devi essere incoraggiante. Rispondi in massimo 3 frasi." },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();

    console.log("OpenRouter:", data);

    if (!response.ok) {
      return res.status(500).json({
        reply: "Errore API: " + JSON.stringify(data)
      });
    }

    
  const choice = data?.choices?.[0];

    
    const reply =
  choice?.message?.content ||
  choice?.text ||
  JSON.stringify(choice) ||
  "Nessuna risposta";

    return res.status(200).json({ reply });






    


    
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      reply: "Errore server: " + err.message
    });
  }
}
