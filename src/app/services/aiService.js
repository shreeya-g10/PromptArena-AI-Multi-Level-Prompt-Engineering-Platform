export async function generateCode(prompt) {
  const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": "http://localhost:5173",
      "X-Title": "PromptArena Project",
    },
    body: JSON.stringify({
      model: "openai/gpt-3.5-turbo", // ✅ FIXED
      messages: [
        { role: "user", content: prompt }
      ],
    }),
  });

  const data = await response.json();

  console.log("FULL RESPONSE:", data);

  return data?.choices?.[0]?.message?.content || "No response";
}