require("dotenv").config({ path: __dirname + "/../.env" });
const { runDailyDebate } = require("./dailyDebate");

console.log("🚀 Running full autonomous debate test...\n");
runDailyDebate()
  .then(() => process.exit(0))
  .catch(err => { console.error(err); process.exit(1); });
