require("dotenv").config();
const mongoose = require("mongoose");

const isLocalDatabase = true;

const useMongoDB = async () => {
  try {
    await mongoose.connect(isLocalDatabase ? process.env.LOCAL_DB : process.env.CLOUD_DB);
    const playerSchema = new mongoose.Schema(
      {
        name: String,
        sport: String,
      },
      { collection: "players" }
    );
    const PlayerModel = new mongoose.model("PlayerModel", playerSchema);
    const players = await PlayerModel.find();
    console.log(players);
  } catch (err) {
    console.log(err);
  }
};

useMongoDB();
