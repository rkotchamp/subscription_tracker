import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeEmail(emailContent) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "You are an AI trained to analyze email content for subscription and recurring payment information.",
        },
        {
          role: "user",
          content: `Analyze this email for subscription details: ${emailContent}`,
        },
      ],
      functions: [
        {
          name: "categorize_email",
          parameters: {
            type: "object",
            properties: {
              category: {
                type: "string",
                enum: [
                  "Software & SaaS",
                  "Media & Content",
                  "E-Commerce",
                  "IT Infrastructure",
                  "Unknown",
                ],
              },
              isSubscription: { type: "boolean" },
              amount: { type: "number" },
              billingFrequency: {
                type: "string",
                enum: ["monthly", "yearly", "quarterly", "one-time", "unknown"],
              },
              confidence: { type: "number" },
              serviceName: { type: "string" },
            },
            required: ["category", "isSubscription", "confidence"],
          },
        },
      ],
    });

    return completion.choices[0].message.function_call.arguments;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw new Error("Failed to analyze email content");
  }
}
