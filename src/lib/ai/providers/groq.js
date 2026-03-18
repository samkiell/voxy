import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const generateGroqResponse = async (messages, systemInstruction) => {
  const completion = await groq.chat.completions.create({
    messages: [
      { role: "system", content: systemInstruction },
      ...messages.map(m => ({
        role: m.role === 'model' ? 'assistant' : 'user',
        content: m.parts[0].text
      }))
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
  });

  return {
    text: completion.choices[0]?.message?.content || "",
    provider: "groq",
    tokensUsed: completion.usage?.total_tokens || 0
  };
};
