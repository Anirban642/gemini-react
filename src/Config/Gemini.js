async function run(messages, onChunk, model, mode, instructions, signal) {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || "/api/chat";
    const response = await fetch(apiUrl, {
      method: "POST",
      signal,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, model, mode, instructions }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Request failed");
    }

    if (!response.body) throw new Error("The response stream is unavailable");

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    let content = "";

    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6).trim();
        if (!payload) continue;

        const chunk = JSON.parse(payload);
        if (chunk.error) throw new Error(chunk.error);
        if (chunk.content) {
          content += chunk.content;
          onChunk?.(chunk.content);
        }
      }

      if (done) break;
    }

    return content || "No response was returned";
  } catch (error) {
    if (error.name === "AbortError") throw error;
    console.error(error);
    throw new Error(error.message || "Something went wrong");
  }
}

export default run;
