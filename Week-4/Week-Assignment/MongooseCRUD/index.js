require("dotenv").config();
const mongoose = require("mongoose");

const isLocalDatabase = false;

const newRecords = [
  {
    name: "Akshat Mathur",
    sport: "Snooker",
  },
  {
    name: "Piyush Dave",
    sport: "Table Tennis, BodyBuilding",
  },
];

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
    const playersBeforeWrite = await PlayerModel.find();
    console.log("Before Create New Records: \n" + playersBeforeWrite);
    await PlayerModel.insertMany(newRecords);
    const playersAfterWrite = await PlayerModel.find();
    console.log("\n\n\nAfter Create New Records: \n" + playersAfterWrite);
    await PlayerModel.updateOne(
      { name: "Akshat Mathur" },
      {
        sport: "Snooker, Foosball",
      }
    );
    const playersAfterUpdate = await PlayerModel.find();
    console.log("\n\n\nAfter Update New Records: \n" + playersAfterUpdate);
    await PlayerModel.deleteMany({ name: { $in: ["Akshat Mathur", "Piyush Dave"] } });
    const playersAfterDelete = await PlayerModel.find();
    console.log("\n\n\nAfter Delete New Records: \n" + playersAfterDelete);
  } catch (err) {
    console.log(err);
  }
};

useMongoDB();
