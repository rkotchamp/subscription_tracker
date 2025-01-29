import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeEmail(emailContent) {
  try {
    console.log("AI Analysis - Starting with content:", emailContent);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: `You are an AI assistant specialized in analyzing email content to detect subscription and recurring payment details. 
          
Your task is to extract relevant details, including:
- **Service Name:** The company or platform providing the service.
- **Subscription Status:** Whether the email mentions a recurring subscription or not.
- **Billing Amount:** The amount being charged.
- **Billing Frequency:** Monthly, yearly, quarterly, one-time, or unknown.
- **Category:** The type of service (Software & SaaS, Media & Content, E-Commerce, IT Infrastructure, or Unknown).

Use keywords such as **"monthly payment," "recurring charge," "subscription renewal,"** or similar terms to ensure accurate classification.

If no subscription-related details are found, classify it as "Unknown." Your response should be structured in JSON format.
`,
        },
        {
          role: "user",
          content: `Analyze the following email and extract details related to subscriptions. Your response should include:
- **Service Name**
- **Subscription Status (true/false)**
- **Billing Amount**
- **Billing Frequency**
- **Category**
- **Confidence Score** (a number between 0-1 indicating the accuracy of the classification)

If no subscription-related details are found, classify it as "Unknown."

Email Content: ${emailContent}
`,
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
      function_call: { name: "categorize_email" },
    });

    console.log("AI Analysis - Raw completion:", completion.choices[0]);

    let result;
    const message = completion.choices[0].message;

    if (message.function_call?.arguments) {
      // Parse from function_call arguments
      try {
        result = JSON.parse(message.function_call.arguments);
      } catch (parseError) {
        console.error(
          "AI Analysis - Failed to parse function arguments:",
          parseError
        );
        result = extractJSONFromString(message.function_call.arguments);
      }
    } else if (message.content) {
      // Try to extract JSON from content
      result = extractJSONFromString(message.content);
    }

    // Validate and provide fallback
    if (
      !result ||
      !result.category ||
      !result.isSubscription ||
      typeof result.confidence !== "number"
    ) {
      console.warn("AI Analysis - Invalid result format, using fallback");
      result = {
        category: "Unknown",
        isSubscription: false,
        confidence: 0.5,
      };
    }

    console.log("AI Analysis - Parsed result:", result);
    return result;
  } catch (error) {
    console.error("AI Analysis Error:", error);
    throw error;
  }
}

// Helper function to extract JSON from string content
function extractJSONFromString(content) {
  try {
    // Try to find JSON object in the string
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (error) {
    console.error("Failed to extract JSON from string:", error);
  }

  // Fallback result
  return {
    category: "Unknown",
    isSubscription: false,
    confidence: 0.5,
  };
}
