async function run(prompt) {
  try {
    const apiUrl = import.meta.env.VITE_API_URL || "/api/chat";
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Request failed");
    }

    return data.content;
  } catch (error) {
    console.error(error);
    return `Error: ${error.message || "Something went wrong"}`;
  }
}

export default run;
