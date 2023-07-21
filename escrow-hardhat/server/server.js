const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(express.json());

app.use(cors());

mongoose.connect("mongodb://localhost:27017/escrowDB", {
  useNewUrlParser: true,
});

const contractSchema = new mongoose.Schema({
  contractAddress: {
    type: String,
    required: true,
    unique: true,
  },
  arbiter: {
    type: String,
    required: true,
  },
  beneficiary: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  isApproved: {
    type: Boolean,
    required: true,
  },
});

const contract = mongoose.model("Contract", contractSchema);

app.get("/", async (req, res) => {
  try {
    const data = await contract.find();
    console.log(data);
    res.send(data);
  } catch (error) {
    console.log(error);
  }
});

app.post("/", async (req, res) => {
  console.log("this is data :", req.body);

  const { arbiter, contractAddress, beneficiary, value, isApproved } = req.body;

  const cont = new contract({
    contractAddress,
    arbiter,
    beneficiary,
    value,
    isApproved,
  });
  await cont.save();
  res.send("saved successfully");
});

app.put("/", async (req, res) => {
  const { contractAddress } = req.body;

  await contract.updateOne(
    { contractAddress: contractAddress },
    { isApproved: true }
  );
});

app.listen(8080, () => {
  console.log("listening on port 8080");
});
