const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const { ethers } = require("ethers");

dotenv.config();

const app = express();
app.use(bodyParser.json());

const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Helper function to add timeout
async function callWithTimeout(promise, ms = 30000) {
  let timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Web3 request timed out")), ms)
  );
  return Promise.race([promise, timeout]);
}

app.post("/web3/verify-supply", async (req, res) => {
  try {
    const { token_address } = req.body;

    if (!token_address) {
      return res.status(400).json({ error: "token_address is required" });
    }

    const abi = ["function totalSupply() view returns (uint256)"];
    const contract = new ethers.Contract(token_address, abi, provider);

    // Call totalSupply with timeout
    const totalSupply = await callWithTimeout(contract.totalSupply(), 30000);

    res.json({ blockchain_count: totalSupply.toString() });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(process.env.PORT || 4000, () => {
  console.log(`Web3 service running on port ${process.env.PORT || 4000}`);
});
