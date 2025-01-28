import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { parseEmailContent } from "@/lib/emailParser"; // We'll create this

export function useGoogleApi() {
  const { data: session } = useSession();
  const [gapiInited, setGapiInited] = useState(false);
  const [gisInited, setGisInited] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const initGmail = useCallback(async () => {
    if (isInitializing) return false;
    if (gapiInited) return true;

    try {
      setIsInitializing(true);
      console.log("Starting Gmail initialization...");

      // Load the Google API client library
      await loadGapiScript();
      console.log("GAPI script loaded");

      await loadGisScript();
      console.log("GIS script loaded");

      await initializeGapiClient();
      console.log("GAPI client initialized");

      // Set the access token for API calls
      if (session?.accessToken) {
        window.gapi.client.setToken({
          access_token: session.accessToken,
        });
        setGapiInited(true);
        console.log("Gmail API initialized successfully");
        return true;
      } else {
        throw new Error("No access token available");
      }
    } catch (error) {
      console.error("Error initializing Gmail:", error);
      setGapiInited(false);
      return false;
    } finally {
      setIsInitializing(false);
    }
  }, [session, isInitializing, gapiInited]);

  // Auto-initialize when session is available
  useEffect(() => {
    if (session?.accessToken && !gapiInited && !isInitializing) {
      console.log("Attempting auto-initialization of Gmail API");
      initGmail().catch(console.error);
    }
  }, [session, gapiInited, isInitializing, initGmail]);

  const loadGapiScript = () => {
    return new Promise((resolve) => {
      if (typeof window.gapi !== "undefined") {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://apis.google.com/js/api.js";
      script.onload = () => {
        window.gapi.load("client", resolve);
      };
      document.body.appendChild(script);
    });
  };

  const loadGisScript = () => {
    return new Promise((resolve) => {
      if (typeof window.google !== "undefined") {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.onload = resolve;
      document.body.appendChild(script);
    });
  };

  const initializeGapiClient = async () => {
    await window.gapi.client.init({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
      discoveryDocs: [
        "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
      ],
    });
  };

  const fetchAndParseEmails = async () => {
    try {
      if (!gapiInited) {
        console.log("Gmail API not initialized, attempting initialization...");
        const initialized = await initGmail();
        if (!initialized) {
          console.error("Failed to initialize Gmail API");
          return [];
        }
      }

      console.log("Fetching emails...");
      const response = await window.gapi.client.gmail.users.messages.list({
        userId: "me",
        q: "subject:(subscription OR invoice OR receipt OR billing)",
        maxResults: 50,
      });

      if (!response.result.messages) {
        console.log("No messages found");
        return [];
      }

      console.log(`Found ${response.result.messages.length} messages`);
      const emailPromises = response.result.messages.map(async (message) => {
        const fullEmail = await window.gapi.client.gmail.users.messages.get({
          userId: "me",
          id: message.id,
          format: "full",
        });

        const parsedContent = await parseEmailContent(fullEmail.result);
        return parsedContent;
      });

      const emails = await Promise.all(emailPromises);
      const subscriptionEmails = emails.filter((email) => email.isSubscription);
      console.log(`Found ${subscriptionEmails.length} subscription emails`);
      return subscriptionEmails;
    } catch (error) {
      console.error("Error fetching and parsing emails:", error);
      return [];
    }
  };

  return {
    gapiInited,
    gisInited,
    isInitializing,
    initGmail,
    fetchAndParseEmails,
  };
}
