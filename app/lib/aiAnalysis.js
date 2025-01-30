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

PRIORITY CATEGORIZATION:
1. First check if the email contains financial documents:
- Invoice, receipt, billing statement
- Payment confirmation
- Subscription renewal notice
- Purchase confirmation
These should be analyzed for subscription details, NOT marked as advertisements.

Only categorize as "Advertisement" if the email:
- Is purely job-related (job alerts, recruitment)
- Is purely marketing/promotional without any payment info
- Contains only social media notifications
- Is a newsletter without any billing/payment information

For valid financial emails, extract:
- Service Name: The company sending the invoice/receipt
- Amount: The payment amount (required for invoices/receipts)
- Billing Frequency: Check for recurring payment terms
- Category based on the service type:
  * Software & SaaS: Software services, digital tools
  * Media & Content: Streaming, content subscriptions
  * E-Commerce: Online shopping, retail
  * IT Infrastructure: Hosting, domains
  * Unknown: If service type is unclear`,
        },
        {
          role: "user",
          content: `Analyze this email: ${emailContent}`,
        },
      ],
      tools: [
        {
          type: "function",
          function: {
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
                    "Advertisement",
                  ],
                },
                isSubscription: { type: "boolean" },
                amount: { type: "number" },
                billingFrequency: {
                  type: "string",
                  enum: [
                    "monthly",
                    "yearly",
                    "quarterly",
                    "one-time",
                    "unknown",
                  ],
                },
                confidence: { type: "number" },
                serviceName: { type: "string" },
              },
              required: ["category", "isSubscription", "confidence"],
            },
          },
        },
      ],
      tool_choice: { type: "function", function: { name: "categorize_email" } },
    });

    let result;
    const message = completion.choices[0].message;

    if (message.tool_calls?.[0]?.function?.arguments) {
      try {
        result = JSON.parse(message.tool_calls[0].function.arguments);
      } catch (parseError) {
        console.error(
          "AI Analysis - Failed to parse function arguments:",
          parseError
        );
        result = extractJSONFromString(
          message.tool_calls[0].function.arguments
        );
      }
    } else if (message.content) {
      result = extractJSONFromString(message.content);
    }

    // Skip advertisements and non-subscription content
    if (result?.category === "Advertisement") {
      console.log("AI Analysis - Skipping advertisement email");
      return null;
    }

    // Validate and provide defaults for subscription emails
    if (!result || typeof result !== "object") {
      result = {
        category: "Unknown",
        isSubscription: false,
        confidence: 0.5,
      };
    }

    result = {
      category: result.category || "Unknown",
      isSubscription: !!result.isSubscription,
      confidence:
        typeof result.confidence === "number" ? result.confidence : 0.5,
      serviceName: result.serviceName || "Unknown",
      amount: result.amount || 0,
      billingFrequency: result.billingFrequency || "unknown",
    };

    console.log("AI Analysis - Final result:", result);
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
