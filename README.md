# Image Generator API using Hugging Face Stable Diffusion

A REST API service that generates images using the Hugging Face Stable Diffusion API. Provides both file-based storage and base64 data URLs for flexible image handling.

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
async function createImage() {
  try {
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: "A beautiful landscape with mountains and a lake",
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("Generated image URL:", data.imageUrl);
      console.log("Image file path:", data.filePath);
    } else {
      console.error("Error:", data.error);
    }
  } catch (error) {
    console.error("Error:", error.message);
  }
}
```

### Backend Implementation

To implement the `/api/generate-image` endpoint in your Express backend:

```javascript
const express = require("express");
const { generateImage } = require("./path/to/generateImage");

const app = express();
app.use(express.json()); // Parse JSON request bodies

app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required",
      });
    }

    const result = await generateImage(prompt);
    res.json({
      success: true,
      imageUrl: result.dataUrl,
      filePath: result.filePath,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
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

## API Endpoint

### `POST /api/generate-image`

Generates an image based on the provided text prompt.

**Request Body:**

```json
{
  "prompt": "A beautiful landscape with mountains and a lake"
}
```

**Response (Success):**

```json
{
  "success": true,
  "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "filePath": "/path/to/generated/image_1234567890_prompt.png"
}
```

**Response (Error):**

```json
{
  "success": false,
  "error": "Error message describing what went wrong"
}
```

**Parameters:**

- `prompt` (required): Text description of the image to generate

**Response Fields:**

- `success`: Boolean indicating if the request was successful
- `imageUrl`: Base64 data URL of the generated image (on success)
- `filePath`: Local file path where the image is saved (on success)
- `error`: Error message (on failure)

## Function Details

### `generateImage(prompt)`

Internal function used by the API endpoint (for reference when implementing the backend):

- **Parameters:**

  - `prompt` (string): Text description of the image to generate

- **Returns:**

  - `Promise<object>`: Object containing:
    - `filePath` (string): Path to the saved image file
    - `dataUrl` (string): Base64 data URL of the generated image

- **Throws:**
  - Error if API key is missing
  - Error if API request fails
  - Error if image generation fails

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
