const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const PLACE_ID = process.env.PLACE_ID;

app.get("/", (req, res) => {
  res.send("API online");
});

app.get("/google-reviews", async (req, res) => {
  try {
    if (!GOOGLE_API_KEY || !PLACE_ID) {
      return res.status(400).json({
        erro: "GOOGLE_API_KEY ou PLACE_ID não configurados na Vercel"
      });
    }

    const response = await fetch(
      `https://places.googleapis.com/v1/places/${PLACE_ID}`,
      {
        headers: {
          "X-Goog-Api-Key": GOOGLE_API_KEY,
          "X-Goog-FieldMask":
            "displayName,rating,userRatingCount,reviews"
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        erro: "Erro retornado pelo Google",
        status: response.status,
        detalhes: data
      });
    }

    res.json({
      empresa: data.displayName?.text || "Neocooler",
      nota: data.rating || 0,
      total: data.userRatingCount || 0,
      avaliacoes: data.reviews || [],
      googleOriginal: data
    });

  } catch (error) {
    res.status(500).json({
      erro: "Erro interno na API",
      detalhes: error.message
    });
  }
});

module.exports = app;
