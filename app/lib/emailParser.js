import { z } from "zod";

// Enhanced schema for subscription emails
const subscriptionEmailSchema = z.object({
  subject: z.string(),
  from: z.string(),
  date: z.string(),
  amount: z.number().optional(),
  currency: z
    .object({
      symbol: z.string(),
      code: z.string(),
    })
    .optional(),
  renewalDate: z.date().optional(),
  invoiceUrl: z.string().url().optional(),
  requiresManualUpload: z.boolean().default(false),
  isLoginRequired: z.boolean().default(false),
  provider: z.string().optional(),
  invoiceNumber: z.string().optional(),
});

export async function parseEmailContent(email) {
  try {
    // Extract headers
    const headers = email.payload.headers.reduce((acc, header) => {
      acc[header.name.toLowerCase()] = header.value;
      return acc;
    }, {});

    // Get email body
    const body = getEmailBody(email.payload);

    // First check if this is a financial/subscription email
    const emailType = detectEmailType(body, headers.subject);

    if (!emailType.isRelevant) {
      return { isSubscription: false };
    }

    // Check if login is required or invoice needs to be downloaded
    const requiresManualAccess = checkRequiresManualAccess(body);

    if (requiresManualAccess) {
      return {
        isSubscription: true,
        requiresManualAccess: true,
        content: {
          subject: headers.subject,
          body: body,
          sender: headers.from,
          date: headers.date,
        },
      };
    }

    // Extract subscription details
    const details = extractSubscriptionDetails(body, headers);

    return {
      isSubscription: true,
      requiresManualAccess: false,
      ...details,
    };
  } catch (error) {
    console.error("Email parsing error:", error);
    return { isSubscription: false, error: error.message };
  }
}

function detectEmailType(body, subject) {
  const financialIndicators = {
    invoice: [
      "invoice",
      "billing statement",
      "payment receipt",
      "order confirmation",
    ],
    subscription: [
      "subscription",
      "recurring payment",
      "renewal notice",
      "your plan",
    ],
    payment: ["payment", "charged", "processed", "transaction", "receipt"],
    amount: ["$", "€", "£", "usd", "eur", "gbp", "total:", "amount:", "price:"],
  };

  const lowercaseBody = body.toLowerCase();
  const lowercaseSubject = subject.toLowerCase();
  const combinedText = `${lowercaseSubject} ${lowercaseBody}`;

  // Check for financial content
  const hasFinancialContent = Object.values(financialIndicators)
    .flat()
    .some((indicator) => combinedText.includes(indicator));

  return {
    isRelevant: hasFinancialContent,
    type: hasFinancialContent
      ? determineEmailType(combinedText, financialIndicators)
      : null,
  };
}

function determineEmailType(text, indicators) {
  if (indicators.subscription.some((term) => text.includes(term))) {
    return "subscription";
  }
  if (indicators.invoice.some((term) => text.includes(term))) {
    return "invoice";
  }
  if (indicators.payment.some((term) => text.includes(term))) {
    return "payment";
  }
  return "financial";
}

function checkLoginRequired(body) {
  const loginIndicators = [
    "login to view",
    "sign in to view",
    "view your invoice online",
    "access your account",
    "view billing details",
    "visit your account",
    "view invoice",
    "view receipt",
    "view details in your account",
    "click here to view",
  ];

  return loginIndicators.some((phrase) =>
    body.toLowerCase().includes(phrase.toLowerCase())
  );
}

function extractFinancialDetails(body, headers) {
  // Dynamic currency pattern
  const currencyPattern = /(?:[\p{Sc}]|[A-Z]{3})\s*(\d+(?:[.,]\d{1,2})?)/gu;
  const numericPattern = /(\d+(?:[.,]\d{1,2})?)\s*(?:[\p{Sc}]|[A-Z]{3})/gu;

  let amount;
  let currency;

  // Try to find amount with currency
  const matches = [
    ...body.matchAll(currencyPattern),
    ...body.matchAll(numericPattern),
  ];

  for (const match of matches) {
    const potentialAmount = match[1].replace(",", ".");
    const numericAmount = parseFloat(potentialAmount);

    if (!isNaN(numericAmount)) {
      // Get the full match to extract currency info
      const fullMatch = match[0];
      const currencyInfo = detectCurrency(fullMatch);

      if (currencyInfo) {
        amount = numericAmount;
        currency = currencyInfo;
        break;
      }
    }
  }

  // Try to find dates
  const datePatterns = [
    /(?:renewal|next payment|due|billing) date:\s*([^<\n]+)/i,
    /next charge on:\s*([^<\n]+)/i,
    /will renew on:\s*([^<\n]+)/i,
  ];

  let renewalDate;
  for (const pattern of datePatterns) {
    const match = body.match(pattern);
    if (match) {
      const parsedDate = new Date(match[1]);
      if (!isNaN(parsedDate.getTime())) {
        renewalDate = parsedDate;
        break;
      }
    }
  }

  return {
    amount,
    currency,
    renewalDate,
    requiresManualUpload: checkLoginRequired(body),
  };
}

function detectCurrency(text) {
  // Common currency patterns
  const currencyPatterns = [
    // Symbols followed by amount
    { regex: /^([\p{Sc}])/, type: "symbol" },
    // ISO codes followed by amount
    { regex: /^([A-Z]{3})\s*/, type: "code" },
    // Amount followed by ISO codes
    { regex: /\s*([A-Z]{3})$/, type: "code" },
  ];

  for (const pattern of currencyPatterns) {
    const match = text.match(pattern.regex);
    if (match) {
      const value = match[1];
      if (pattern.type === "symbol") {
        return normalizeCurrencySymbol(value);
      } else {
        return normalizeCurrencyCode(value);
      }
    }
  }

  return null;
}

function normalizeCurrencySymbol(symbol) {
  // Map of common currency symbols to their details
  const symbolMap = new Map([
    ["$", { symbol: "$", code: "USD" }],
    ["€", { symbol: "€", code: "EUR" }],
    ["£", { symbol: "£", code: "GBP" }],
    ["¥", { symbol: "¥", code: "JPY" }],
    ["₹", { symbol: "₹", code: "INR" }],
    // Add more as needed
  ]);

  return symbolMap.get(symbol) || { symbol, code: "UNKNOWN" };
}

function normalizeCurrencyCode(code) {
  // Validate if it's a real currency code
  const validCodes = new Set([
    "USD",
    "EUR",
    "GBP",
    "JPY",
    "INR",
    "AUD",
    "CAD",
    "CHF",
    "CNY",
    "NZD",
  ]);

  if (validCodes.has(code)) {
    const symbols = {
      USD: "$",
      EUR: "€",
      GBP: "£",
      JPY: "¥",
      INR: "₹",
      AUD: "A$",
      CAD: "C$",
      CHF: "Fr",
      CNY: "¥",
      NZD: "NZ$",
    };

    return {
      symbol: symbols[code] || code,
      code: code,
    };
  }

  return {
    symbol: code,
    code: code,
  };
}

function getEmailBody(payload) {
  if (payload.body.data) {
    return Buffer.from(payload.body.data, "base64").toString();
  }

  if (payload.parts) {
    for (const part of payload.parts) {
      if (part.mimeType === "text/plain" || part.mimeType === "text/html") {
        return Buffer.from(part.body.data, "base64").toString();
      }
    }
  }

  return "";
}

function checkRequiresManualAccess(body) {
  const patterns = [
    /view.*invoice.*online/i,
    /download.*invoice/i,
    /login.*to.*view/i,
    /click.*to.*view.*bill/i,
    /view.*your.*statement/i,
  ];

  return patterns.some((pattern) => pattern.test(body));
}

function extractSubscriptionDetails(body, headers) {
  // Enhanced extraction logic
  const amount = extractAmount(body);
  const subscriptionName = extractSubscriptionName(body, headers.from);
  const billingFrequency = detectBillingFrequency(body);

  return {
    subscriptionName,
    amount,
    date: new Date(headers.date),
    statement: headers.subject,
    billingFrequency,
    from: headers.from,
  };
}
