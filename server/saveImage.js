const fs = require("fs").promises;
const path = require("path");

async function saveImage(imageBuffer, prompt) {
  try {
    // Create images folder if it doesn't exist
    const imagesDir = path.join(__dirname, "../images");
    try {
      await fs.access(imagesDir);
    } catch {
      await fs.mkdir(imagesDir, { recursive: true });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const sanitizedPrompt = prompt
      .replace(/[^a-zA-Z0-9]/g, "_")
      .substring(0, 50);
    const filename = `image_${timestamp}_${sanitizedPrompt}.png`;
    const filePath = path.join(imagesDir, filename);

    // Write image buffer to file
    await fs.writeFile(filePath, imageBuffer);

    // Return relative file path
    return path.relative(process.cwd(), filePath);
  } catch (error) {
    console.error("Error saving image:", error);
    throw new Error(`Failed to save image: ${error.message}`);
  }
}

module.exports = { saveImage };
