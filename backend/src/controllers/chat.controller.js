import { GROQ_API_KEY, GROQ_MODEL } from "../config/index.js";
import ErrorResponse from "../utils/ApiError.util.js";

const SYSTEM_PROMPT = `You are OrderKaro Assistant, a helpful guide for the OrderKaro food ordering web app.
Users can browse shops by city, add items to cart, place orders (COD/online), and shop owners can manage menus.
Keep answers concise, friendly, and practical. If asked for anything unrelated to food ordering or the app, politely redirect.
Do not invent API keys, passwords, or private user data. Never claim you can charge cards or access real orders.`;

function buildOpenAIMessages(messages) {
  const chat = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role, content: m.content }));

  return [{ role: "system", content: SYSTEM_PROMPT }, ...chat];
}

export const chatCompletion = async (req, res, next) => {
  try {
    if (!GROQ_API_KEY) {
      return next(
        new ErrorResponse(
          "Chat is not configured. Add GROQ_API_KEY to backend/.env (Groq Cloud key from console.groq.com), then restart the API.",
          503,
        ),
      );
    }

    const { messages } = req.body;
    const openaiMessages = buildOpenAIMessages(messages);

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: openaiMessages,
          max_tokens: 1024,
          temperature: 0.7,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      const msg =
        data?.error?.message ||
        "The assistant could not complete your request.";
      return next(new ErrorResponse(msg, response.status >= 400 ? 502 : 500));
    }

    const text = data?.choices?.[0]?.message?.content?.trim();
    if (!text) {
      return next(
        new ErrorResponse("Empty response from the assistant.", 502),
      );
    }

    return res.status(200).json({
      success: true,
      message: text,
    });
  } catch (error) {
    next(error);
  }
};
