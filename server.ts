import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Check API status endpoint
app.get("/api/health", (_req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.length > 5);
  res.json({
    status: "ok",
    hasApiKey: hasKey,
    timestamp: new Date().toISOString(),
  });
});

// Edit / Clean up product photo
app.post("/api/edit-product-image", async (req, res) => {
  try {
    const { image, prompt, options } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: "Image data is required" });
    }
    if (!prompt || typeof prompt !== "string") {
      return res.status(400).json({ success: false, error: "Instruction prompt is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.status(401).json({
        success: false,
        requiresKeySelection: true,
        error: "Gemini API key is not configured. Please select or add an API key in the AI Studio settings.",
      });
    }

    // Extract base64 and mime type
    let base64Data = image;
    let mimeType = "image/png";

    const match = image.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      mimeType = match[1];
      base64Data = match[2];
    }

    const requestedRatio = options?.aspectRatio || "1:1";
    const requestedSize = options?.imageSize || "1K";

    // Build focused instruction prompt for commercial product photography
    const refinedInstruction = `High-End Commercial Product Photo Editing Instruction:
${prompt.trim()}

Key Photographic Requirements:
- Preserve the exact product geometry, brand labels, textures, materials, and colors from the original photo with pin-sharp fidelity.
- If removing background: completely eliminate background clutter, artifacts, harsh distractions, and isolate the subject cleanly.
- If requested clean background (e.g. pure white #FFFFFF, transparent, or studio): render a uniform, immaculate backdrop with realistic contact shadows anchoring the product naturally to the surface.
- Clean up any dust, finger smudges, specular lens flares, or awkward cast shadows on the product surfaces while maintaining realistic product highlights.`;

    const candidateModels = [
      "gemini-3.1-flash-image",
      "gemini-3.1-flash-image-preview",
      "gemini-3.1-flash-lite-image",
    ];

    let lastError: any = null;
    let resultImageUrl: string | null = null;
    let explanationText: string = "";

    for (const modelName of candidateModels) {
      try {
        const response = await ai.models.generateContent({
          model: modelName,
          contents: {
            parts: [
              {
                inlineData: {
                  data: base64Data,
                  mimeType: mimeType,
                },
              },
              {
                text: refinedInstruction,
              },
            ],
          },
          config: {
            imageConfig: {
              aspectRatio: requestedRatio,
              imageSize: requestedSize,
            },
          },
        });

        const parts = response.candidates?.[0]?.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const outMime = part.inlineData.mimeType || "image/png";
            resultImageUrl = `data:${outMime};base64,${part.inlineData.data}`;
          } else if (part.text) {
            explanationText += part.text + " ";
          }
        }

        if (resultImageUrl) {
          return res.json({
            success: true,
            image: resultImageUrl,
            explanation: explanationText.trim(),
            modelUsed: modelName,
          });
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${modelName} failed:`, err?.message || err);
        // If error indicates invalid/leaked/unauthorized key, stop trying fallback models
        const msg = String(err?.message || "");
        if (msg.includes("API key") || msg.includes("leaked") || msg.includes("PERMISSION_DENIED")) {
          break;
        }
      }
    }

    const errorMessage = lastError?.message || "No image was returned by the AI model.";
    const isKeyError =
      errorMessage.includes("leaked") ||
      errorMessage.includes("API key") ||
      errorMessage.includes("PERMISSION_DENIED") ||
      errorMessage.includes("403");

    return res.status(isKeyError ? 403 : 500).json({
      success: false,
      error: errorMessage,
      requiresKeySelection: isKeyError,
    });
  } catch (error: any) {
    console.error("Error in /api/edit-product-image:", error);
    return res.status(500).json({
      success: false,
      error: error?.message || "Internal server error occurred while processing image.",
    });
  }
});

// Suggest smart instructions based on image preview
app.post("/api/suggest-instructions", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ success: false, error: "Image is required" });
    }

    const ai = getGeminiClient();
    if (!ai) {
      return res.json({
        success: true,
        suggestions: [
          "Remove background completely, transparent PNG cutout",
          "Clean pure white backdrop (#FFFFFF) with subtle contact shadow for Amazon",
          "Sleek minimalist stone podium with soft ambient studio lighting",
          "Clean up dust, surface glare, and harsh shadows on product",
        ],
      });
    }

    let base64Data = image;
    let mimeType = "image/png";
    const match = image.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      mimeType = match[1];
      base64Data = match[2];
    }

    const prompt = `Analyze this product photograph. Suggest 4 specific, actionable, professional photographic editing instructions that a merchant or photographer would want to apply to this specific item.
For example:
- Pure white studio background with soft contact shadow
- Remove cluttered background and keep only the product
- Fix specular glare and clean fingerprints/dust
- Place on a sleek marble or matte stage with warm rim light
Return strictly a JSON array of 4 concise strings, e.g. ["instruction 1", "instruction 2", "instruction 3", "instruction 4"].`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: prompt },
        ],
      },
      config: {
        responseMimeType: "application/json",
      },
    });

    let suggestions: string[] = [];
    try {
      const text = response.text || "[]";
      suggestions = JSON.parse(text);
      if (!Array.isArray(suggestions)) suggestions = [];
    } catch {
      suggestions = [];
    }

    if (suggestions.length === 0) {
      suggestions = [
        "Remove background completely and keep transparent alpha cutout",
        "Pure white Amazon-ready studio background with soft contact shadow",
        "Place product on a minimalist stone podium with soft lighting",
        "Clean up glare, reflections, and surface blemishes",
      ];
    }

    res.json({ success: true, suggestions });
  } catch (error: any) {
    // Return sensible defaults if suggestions API has error
    res.json({
      success: true,
      suggestions: [
        "Remove background completely and isolate subject",
        "Pure white e-commerce backdrop with soft contact shadow",
        "Place on a modern studio pedestal with soft ambient glow",
        "Clean up harsh glare, dust specks, and cast shadows",
      ],
    });
  }
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";

  if (!isProduction) {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        port: PORT,
        host: "0.0.0.0",
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve("dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve("dist/index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
