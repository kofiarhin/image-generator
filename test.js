const { generateImage } = require("./server/generateImage");

async function testImageGeneration() {
  try {
    console.log(
      'Generating image with prompt: "A beautiful sunset over mountains"...'
    );

    const imageUrl = await generateImage(
      "A beautiful sunset over mountains with vibrant colors"
    );

    console.log("Image generated successfully!");
    console.log("Image URL:", imageUrl);

    // In a real application, you could save this to a file or serve it
    // For demonstration, we'll just log the first 100 characters
    console.log("Image data preview:", imageUrl.substring(0, 100) + "...");
  } catch (error) {
    console.error("Error in test:", error.message);
  }
}

// Run the test
testImageGeneration();
