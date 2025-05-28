import axios from "axios";
import { writeFile, readFile, unlink, rename } from "fs/promises";
import http from "http";
import ngrok from "ngrok";
import { readFileSync, existsSync } from "fs";

interface WebhookEvent {
  hash: string;
  status: string;
  result?: {
    url: string;
    proxy_url: string;
    filename: string;
    content_type: string;
    width: number;
    height: number;
    size: number;
  };
}

// Initialize UserAPI client
const userApiClient = axios.create({
  baseURL: "https://api.userapi.com/v1",
  headers: {
    "Content-Type": "application/json",
    "Api-Key": process.env.USERAPI_API_KEY,
  },
});

async function handleWebhook(event: WebhookEvent) {
  // Only process completed images

  try {
    console.log(`\n==========================================`);
    console.log(`Processing webhook for hash: ${event.hash}`);
    console.log(`==========================================`);

    // Download the image
    const response = await userApiClient.get(event.result?.url || "", {
      responseType: "arraybuffer",
    });

    // Check if the response indicates an error
    if (event.status === "error") {
      throw new Error(`API Error: ${response.data.error || "Unknown error"}`);
    }

    // Save the image to the script directory with .png extension
    const imagePath = `./${event.hash}.png`;
    await writeFile(imagePath, response.data);

    console.log(`\n✅ Successfully saved image to ${imagePath}`);

    // Check if the original empty file exists and delete it
    const emptyFilePath = `./${event.hash}`;
    if (existsSync(emptyFilePath)) {
      await unlink(emptyFilePath);
      console.log(`\n✅ Deleted empty file ${emptyFilePath}`);
    }

    // Note: We no longer delete the image file here, it will be deleted in the generateImages script
    console.log(`\n✅ Webhook processing completed for ${event.hash}`);
    console.log(`\n------------------------------------------\n`);
  } catch (error: any) {
    console.error(
      `\n❌ Error processing webhook for hash ${event.hash}:`,
      error,
    );

    // Rename the image file to .error
    const imagePath = `./${event.hash}`;
    const errorFilePath = `./${event.hash}.error`;
    if (existsSync(imagePath)) {
      await rename(imagePath, errorFilePath);
      console.log(`\nRenamed image file to error file: ${errorFilePath}`);
    }

    // Delete the empty file if it exists
    const emptyFilePath = `./${event.hash}`;
    if (existsSync(emptyFilePath)) {
      await unlink(emptyFilePath);
      console.log(`\n✅ Deleted empty file ${emptyFilePath}`);
    }

    throw error;
  }
}

const server = http.createServer(async (req, res) => {
  // Only handle POST requests
  if (req.method !== "POST") {
    res.writeHead(405);
    res.end("Method not allowed");
    return;
  }

  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      const webhookData = JSON.parse(body) as WebhookEvent;
      await handleWebhook(webhookData);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ success: true }));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Internal server error" }));
    }
  });
});

const PORT = parseInt(process.env.PORT || "3000", 10);

// Start the server and ngrok tunnel
async function startServer() {
  server.listen(PORT, async () => {
    console.log(`\n==========================================`);
    console.log(`Webhook server listening on port ${PORT}`);
    console.log(`==========================================\n`);

    try {
      // Start ngrok tunnel
      const url = await ngrok.connect(PORT);
      console.log(`\n✅ Ngrok tunnel established at: ${url}\n`);

      // Read existing .env content
      let envContent = "";
      try {
        envContent = await readFile(".env", "utf-8");
      } catch (error) {
        // File doesn't exist yet, that's okay
      }

      // Update or add WEBHOOK_URL
      const envLines = envContent.split("\n");
      const webhookLineIndex = envLines.findIndex((line) =>
        line.startsWith("WEBHOOK_URL="),
      );

      if (webhookLineIndex >= 0) {
        envLines[webhookLineIndex] = `WEBHOOK_URL=${url}`;
      } else {
        envLines.push(`WEBHOOK_URL=${url}`);
      }

      // Write back to .env
      await writeFile(".env", envLines.join("\n") + "\n");
      console.log(`\n✅ Updated WEBHOOK_URL in .env file\n`);
    } catch (error) {
      console.error("\n❌ Failed to start ngrok tunnel:", error);
      process.exit(1);
    }
  });
}

startServer();
