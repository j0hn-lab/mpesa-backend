const express = require("express");
const axios = require("axios");
const router = express.Router();
require("dotenv").config();

// Function to get access token
const getAccessToken = async () => {
  const credentials = Buffer.from(
    `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`
  ).toString("base64");

  try {
    const response = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${credentials}`,
        },
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error("Error getting access token:", error);
  }
};

// Register C2B URL
router.get("/register-url", async (req, res) => {
  const accessToken = await getAccessToken();
  const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";

  const payload = {
    ShortCode: process.env.SHORTCODE,
    ResponseType: "Completed",
    ConfirmationURL: `${process.env.CALLBACK_URL}`,
    ValidationURL: `${process.env.CALLBACK_URL}`,
  };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: "Error registering C2B URL" });
  }
});

// Handle M-Pesa Payment Callback
router.post("/callback", async (req, res) => {
  console.log("M-Pesa Callback Received:", req.body);
  res.status(200).send("Callback received");
});

module.exports = router;
