const fetch = require("node-fetch");
const path = require("path");
const { saveImage } = require("./saveImage");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function generateImage(prompt) {
  const API_URL =
    "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";
  const API_KEY = process.env.HUGGING_FACE_API_KEY;

  if (!API_KEY) {
    throw new Error("Hugging Face API key not found in environment variables");
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        options: {
          wait_for_model: true,
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Full error response:", errorData);
      throw new Error(
        `API request failed: ${response.status} ${response.statusText} - ${errorData}`
      );
    }

    // Get the image as a buffer
    const imageBuffer = await response.buffer();

    // Save image to file
    const filePath = await saveImage(imageBuffer, prompt);

    // Convert to base64 data URL (optional, for backward compatibility)
    const base64Image = imageBuffer.toString("base64");
    const dataUrl = `data:image/png;base64,${base64Image}`;

    // Return both file path and data URL
    return {
      filePath: filePath,
      dataUrl: dataUrl,
    };
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
}

module.exports = { generateImage };
