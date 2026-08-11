const API_KEY = process.env.GROQ_API;

async function run(prompt) {
  try {
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          temperature: 0.7,
          max_tokens: 1024,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(data);
      return "Error: " + (data.error?.message || "Request failed");
    }

    return data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    return "Something went wrong!";
  }
}

export default run;
