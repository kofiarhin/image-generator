# Image Generator using Hugging Face Stable Diffusion API

A Node.js function that generates images using the Hugging Face Stable Diffusion API.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Make sure your `.env` file contains your Hugging Face API key:

```
HUGGING_FACE_API_KEY=your_api_key_here
```

### Important Notes

**Free Account Limitations:**

- The current implementation uses the Hugging Face Inference API which requires a Pro subscription for image generation models
- Free accounts will receive 404 errors when trying to use Stable Diffusion models
- To use this application, you need to upgrade to a Hugging Face Pro account

**Alternative Solutions:**

1. **Upgrade to Hugging Face Pro** (recommended): Get access to all models including Stable Diffusion
2. **Use Local Models**: Run models locally using transformers.js or similar libraries
3. **Use Alternative APIs**: Consider services like Replicate, OpenAI DALL-E, or Stability AI's API

## Usage

### Basic Usage

```javascript
const { generateImage } = require("./generateImage");

async function createImage() {
  try {
    const imageUrl = await generateImage(
      "A beautiful landscape with mountains and a lake"
    );
    console.log("Generated image URL:", imageUrl);
  } catch (error) {
    console.error("Error:", error.message);
  }
}
```

### Integration with MERN Stack

In your Express backend, you can use this function in a route:

```javascript
const express = require("express");
const { generateImage } = require("./path/to/generateImage");

const app = express();

app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;
    const imageUrl = await generateImage(prompt);
    res.json({ success: true, imageUrl });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

### Frontend Integration

In your React frontend, you can call the backend endpoint:

```javascript
const generateImage = async (prompt) => {
  const response = await fetch("/api/generate-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  const data = await response.json();
  return data.imageUrl;
};
```

## Function Details

### `generateImage(prompt)`

- **Parameters:**

  - `prompt` (string): Text description of the image to generate

- **Returns:**

  - `Promise<string>`: Base64 data URL of the generated image

- **Throws:**
  - Error if API key is missing
  - Error if API request fails
  - Error if image generation fails

## API Response

The function returns a base64 data URL that can be:

- Used directly in HTML `<img>` tags
- Saved to a file
- Uploaded to cloud storage
- Served directly to clients

## Error Handling

The function includes comprehensive error handling for:

- Missing API key
- Network failures
- API rate limits
- Invalid responses

## Dependencies

- `node-fetch`: For making HTTP requests
- `dotenv`: For loading environment variables

## Notes

- Image generation may take 10-30 seconds depending on server load
- The Hugging Face API has rate limits depending on your plan
- Generated images are returned as PNG format in base64 encoding
