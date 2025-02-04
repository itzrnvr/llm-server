import dotenv from "dotenv";
dotenv.config();

import fs from "fs/promises"; // Use fs.promises for async/await
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import OpenAI from "openai";
import express from "express";
import cors from "cors";
import { processStream } from "./utils/streamProcessor.js";
import { generateCompletionConfig } from "./utils/chatUtils.js";
import { ResponseStreamer } from "./utils/streamUtils.js";
import { handleError } from "./middleware/errorHandler.js";

const openai = new OpenAI({
    apiKey: process.env.NV_API,
    baseURL: "https://integrate.api.nvidia.com/v1",
});

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all origins (adjust as needed for production)
app.use(cors());
app.use(express.json());




app.post("/nvidia/v1/chat/completions", async (req, res) => {
    try {
        const completionConfig = generateCompletionConfig(req.body);
        const streamer = new ResponseStreamer(res, completionConfig.model);
        const completion = await openai.chat.completions.create(
            completionConfig
        );

        processStream(completion, streamer);
    } catch (error) {
        handleError(res, error);
    }
});


app.get("/nvidia/v1/models", async (req, res) => {
    try {
        const filePath = path.join(__dirname, "models.json"); // Assuming data.json is in the same directory
        const data = await fs.readFile(filePath, "utf8");
        const jsonData = JSON.parse(data);
        res.json(jsonData);
    } catch (error) {
        console.error("Error reading or parsing JSON file:", error);
        res.status(500).send("Internal Server Error");
    }
});



app.get("/", (req, res) => {
    res.send("Hello from the OpenAI Express Server!");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});

