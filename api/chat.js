export default async function handler(request, response) {
  response.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");
  response.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");

  if (request.method === "OPTIONS") {
    return response.status(204).end();
  }

  if (request.method !== "POST") {
    return response.status(405).json({ error: "Method not allowed" });
  }

  const prompt = request.body?.prompt;
  if (typeof prompt !== "string" || !prompt.trim()) {
    return response.status(400).json({ error: "A prompt is required" });
  }

  if (!process.env.GROQ_API) {
    return response.status(500).json({ error: "The server API key is not configured" });
  }

  try {
    const groqResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: process.env.GROQ_MODEL || "openai/gpt-oss-20b",
          messages: [
            {
              role: "system",
              content:
                "Answer clearly using Markdown. Use short paragraphs, headings when useful, bullet or numbered lists for steps, bold for key terms, and fenced code blocks with the correct language tag for all code. Preserve indentation and explain code outside the code block.",
            },
            { role: "user", content: prompt.trim() },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

    const data = await groqResponse.json();
    if (!groqResponse.ok) {
      return response.status(groqResponse.status).json({
        error: data.error?.message || "The AI request failed",
      });
    }

    return response.status(200).json({
      content: data.choices?.[0]?.message?.content || "No response was returned",
    });
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "The AI request failed" });
  }
}
