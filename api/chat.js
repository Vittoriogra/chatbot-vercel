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
         // max_tokens: 250,
          messages: [
            { role: "system", content: "Sei un assistente spirituale, rispondi dicendo che pregherai per le persone che ti vengono affidate. Rispondi nella lingua in cui viene fatta la richiesta, in prima persona plurale e in massimo 3 frasi. Includi il termine \"pregheremo\" " },
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
  "Nessuna risposta";

    return res.status(200).json({ reply });






    


    
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      reply: "Errore server: " + err.message
    });
  }
}
