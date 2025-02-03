const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

// Root route to confirm backend is running
app.get("/", (req, res) => {
  res.send("M-Pesa C2B API Backend is Running!");
});

// Your payment route (already defined earlier)
app.post("/mpesa/payment", async (req, res) => {
  const paymentDetails = req.body;

  try {
    const payload = {
      Shortcode: process.env.M_PESA_SHORTCODE,
      LipaNaMpesaOnlineShortcode: process.env.M_PESA_SHORTCODE,
      LipaNaMpesaOnlineShortcodePassword: process.env.M_PESA_LIPA_PASSWORD,
      LipaNaMpesaOnlineSecurityCredential: process.env.M_PESA_SECURITY_CREDENTIAL,
      PhoneNumber: paymentDetails.phoneNumber,
      Amount: paymentDetails.amount,
      TransactionId: paymentDetails.transactionId,
    };

    const url = "https://api.safaricom.co.ke/mpesa/express/v1/submitpayment";

    const response = await axios.post(url, payload, {
      headers: {
        Authorization: `Bearer ${process.env.M_PESA_ACCESS_TOKEN}`,
        "Content-Type": "application/json",
      },
    });

    res.status(200).json({
      status: "Payment received",
      paymentResponse: response.data,
    });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ status: "Error", message: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
