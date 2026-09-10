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

  const requestMessages = request.body?.messages;
  const messages = Array.isArray(requestMessages)
    ? requestMessages
    : typeof request.body?.prompt === "string"
      ? [{ role: "user", content: request.body.prompt.trim() }]
      : [];

  if (
    !messages.length ||
    messages.some(
      (message) =>
        !["user", "assistant"].includes(message.role) ||
        typeof message.content !== "string" ||
        !message.content.trim()
    )
  ) {
    return response.status(400).json({ error: "A valid message list is required" });
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
            ...messages,
          ],
          stream: true,
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

    if (!groqResponse.ok) {
      const data = await groqResponse.json();
      return response.status(groqResponse.status).json({
        error: data.error?.message || "The AI request failed",
      });
    }

    response.statusCode = 200;
    response.setHeader("Content-Type", "text/event-stream");
    response.setHeader("Cache-Control", "no-cache, no-transform");
    response.setHeader("Connection", "keep-alive");
    response.flushHeaders?.();

    const reader = groqResponse.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6).trim();
        if (payload === "[DONE]") continue;

        const chunk = JSON.parse(payload).choices?.[0]?.delta?.content;
        if (chunk) response.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      }

      if (done) break;
    }

    response.write("data: {\"done\":true}\n\n");
    return response.end();
  } catch (error) {
    console.error(error);
    return response.status(500).json({ error: "The AI request failed" });
  }
}
