// vision-client.ts
import { ImageAnnotatorClient } from "@google-cloud/vision";
import crypto from "crypto";

let client: ImageAnnotatorClient | null = null;

export function getVisionClient() {
  if (!client) {
    const json = process.env.VISION_CREDENTIALS_JSON;
    if (!json) {
      throw new Error("VISION_CREDENTIALS_JSON is not set");
    }

    let credentials: any;
    try {
      credentials = JSON.parse(json);
    } catch (err) {
      throw new Error("Failed to parse VISION_CREDENTIALS_JSON: " + err);
    }

    // 🔹 Normalize the private key newlines
    if (typeof credentials.private_key === "string") {
      const normalizedKey = credentials.private_key.replace(/\\n/g, "\n");

      // Optional safety check (good for debugging)
      try {
        crypto.createPrivateKey({ key: normalizedKey, format: "pem" });
        console.log("Vision client: private key OK ✔️");
      } catch (err) {
        console.error("Vision client: private key rejected ❌");
        console.error(err);
        throw new Error(
          "Invalid private key format in VISION_CREDENTIALS_JSON"
        );
      }

      credentials.private_key = normalizedKey;
    } else {
      throw new Error("private_key is missing or not a string");
    }

    // Create the Vision client
    client = new ImageAnnotatorClient({ credentials });
  }

  return client;
}
