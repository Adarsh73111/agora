require("dotenv").config({ path: __dirname + "/../.env" });
const { runDailyDebate } = require("./dailyDebate");

exports.handler = async (event) => {
  console.log("⏰ EventBridge triggered daily debate");
  try {
    await runDailyDebate();
    return { statusCode: 200, body: "Daily debate complete!" };
  } catch (error) {
    console.error("❌ Daily debate failed:", error.message);
    return { statusCode: 500, body: error.message };
  }
};
