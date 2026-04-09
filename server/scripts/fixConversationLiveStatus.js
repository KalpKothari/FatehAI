require("dotenv").config({ path: "./server/.env" });
const mongoose = require("mongoose");
const Conversation = require("../models/Conversation");

async function run() {
  await mongoose.connect(process.env.MONGO_URI);

  await Conversation.updateMany(
    { channel: { $exists: false } },
    { $set: { channel: "chat" } }
  );

  await Conversation.updateMany(
    { liveStatus: { $exists: false } },
    { $set: { liveStatus: "idle" } }
  );

  await Conversation.updateMany(
    { channel: "voice", status: "completed" },
    { $set: { liveStatus: "ended" } }
  );

  await Conversation.updateMany(
    { channel: "chat", status: "active" },
    { $set: { liveStatus: "idle" } }
  );

  console.log("Conversation live status cleanup done");
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});