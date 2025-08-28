# 🎨 Image Generator API

A powerful REST API service for generating high-quality images using Hugging Face's Stable Diffusion models. Built with Node.js and Express, this service provides both file-based storage and base64 data URLs for maximum flexibility in image handling.

## ✨ Features

- 🚀 **Fast Image Generation**: Generate images using state-of-the-art Stable Diffusion models
- 💾 **Dual Output Formats**: Get images as base64 data URLs or saved files
- 🔧 **Easy Integration**: Simple REST API with comprehensive error handling
- 🛡️ **Production Ready**: Built with Express.js and proper middleware
- 📱 **Cross-Platform**: Works with any frontend framework or backend system
- 🎯 **Flexible Deployment**: Run locally or deploy to any cloud platform

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** package manager
- **Hugging Face Pro Account** (required for Stable Diffusion models)

### Hugging Face Account Setup

**Important:** This application requires a Hugging Face Pro subscription because:

- Free accounts have limited access to image generation models
- Stable Diffusion models require Pro subscription for API access
- Without Pro, you'll receive 404 errors when making requests

## 🚀 Quick Start

1. **Clone and Install**

   ```bash
   git clone <your-repo-url>
   cd image-generator
   npm install
   ```

2. **Environment Setup**

   ```bash
   # Create .env file
   echo "HUGGING_FACE_API_KEY=your_api_key_here" > .env
   ```

3. **Start the Server**

   ```bash
   npm run server
   ```

4. **Generate Your First Image**
   ```bash
   curl -X POST http://localhost:3000/api/generate-image \
     -H "Content-Type: application/json" \
     -d '{"prompt": "A beautiful sunset over mountains"}'
   ```

## 📖 API Documentation

### Endpoint: `POST /api/generate-image`

Generate an image based on a text prompt.

#### Request

```http
POST /api/generate-image
Content-Type: application/json

{
  "prompt": "A serene landscape with mountains and a lake at sunset"
}
```

#### Response (Success)

```json
{
  "success": true,
  "imageUrl": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "filePath": "/path/to/generated/image_1234567890_prompt.png"
}
```

#### Response (Error)

```json
{
  "success": false,
  "error": "Detailed error message"
}
```

#### Parameters

| Parameter | Type   | Required | Description                                                    |
| --------- | ------ | -------- | -------------------------------------------------------------- |
| `prompt`  | string | Yes      | Text description of the image to generate (max 500 characters) |

#### Response Fields

| Field      | Type    | Description                          |
| ---------- | ------- | ------------------------------------ |
| `success`  | boolean | Request status                       |
| `imageUrl` | string  | Base64 data URL of generated image   |
| `filePath` | string  | Local file path where image is saved |
| `error`    | string  | Error message (only on failure)      |

## 💻 Usage Examples

### JavaScript/Node.js

```javascript
// Basic usage with fetch
async function generateImage(prompt) {
  try {
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("Image generated successfully!");
      console.log("File path:", data.filePath);
      return data.imageUrl;
    } else {
      throw new Error(data.error);
    }
  } catch (error) {
    console.error("Generation failed:", error.message);
  }
}

// Usage
const imageUrl = await generateImage("A futuristic city at night");
```

### React Frontend

```jsx
import React, { useState } from "react";

function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      if (data.success) {
        setImageUrl(data.imageUrl);
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Describe your image..."
      />
      <button onClick={handleGenerate} disabled={loading}>
        {loading ? "Generating..." : "Generate Image"}
      </button>
      {imageUrl && <img src={imageUrl} alt="Generated" />}
    </div>
  );
}
```

### Express Backend Integration

```javascript
const express = require("express");
const cors = require("cors");
const { generateImage } = require("./server/generateImage");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Image generation endpoint
app.post("/api/generate-image", async (req, res) => {
  try {
    const { prompt } = req.body;

    // Validation
    if (!prompt || typeof prompt !== "string" || prompt.length > 500) {
      return res.status(400).json({
        success: false,
        error: "Prompt is required and must be less than 500 characters",
      });
    }

    // Generate image
    const result = await generateImage(prompt);

    res.json({
      success: true,
      imageUrl: result.dataUrl,
      filePath: result.filePath,
    });
  } catch (error) {
    console.error("Image generation error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
```

## ⚙️ Configuration

### Environment Variables

| Variable               | Description                 | Required |
| ---------------------- | --------------------------- | -------- |
| `HUGGING_FACE_API_KEY` | Your Hugging Face API token | Yes      |

### Server Configuration

The server can be configured by modifying the files in the `server/` directory:

- `server/server.js` - Main Express server setup
- `server/generateImage.js` - Image generation logic
- `server/saveImage.js` - File saving utilities

## 🔧 Troubleshooting

### Common Issues

#### 404 Errors

**Problem:** Getting 404 errors when making API requests.

**Solution:** Ensure you have a Hugging Face Pro account. Free accounts don't have access to Stable Diffusion models.

#### API Key Issues

**Problem:** "Missing API key" error.

**Solution:** Check that your `.env` file exists and contains:

```
HUGGING_FACE_API_KEY=your_actual_api_key_here
```

#### Slow Generation

**Problem:** Image generation takes too long.

**Solution:** This is normal. Generation typically takes 10-30 seconds depending on server load and model complexity.

#### Rate Limiting

**Problem:** Getting rate limit errors.

**Solution:** Hugging Face has rate limits based on your plan. Consider upgrading your plan for higher limits.

### Error Codes

| Error Code | Description                              |
| ---------- | ---------------------------------------- |
| `400`      | Bad request (missing/invalid prompt)     |
| `401`      | Unauthorized (invalid API key)           |
| `404`      | Model not found (check Pro subscription) |
| `429`      | Rate limit exceeded                      |
| `500`      | Internal server error                    |

## 📦 Dependencies

### Runtime Dependencies

- `express` - Web framework
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `node-fetch` - HTTP client for API calls

### Development Dependencies

- `nodemon` - Development server with auto-restart

## 🚀 Deployment

### Local Development

```bash
npm run server
# Server starts on http://localhost:3000
```

### Production Deployment

1. Set environment variables
2. Run: `node server/server.js`
3. Consider using PM2 for process management

### Docker (Optional)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["node", "server/server.js"]
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co/) for providing the Stable Diffusion models
- [Stability AI](https://stability.ai/) for the original Stable Diffusion model
- The open-source community for the amazing tools and libraries

---

**Made with ❤️ using Stable Diffusion and Node.js**
