const serverless = require("serverless-http");
const app = require("./api/server");
const { runDailyDebate } = require("./autonomous/dailyDebate");

const serverlessApp = serverless(app);

exports.handler = async (event, context) => {
  console.log("Event received:", JSON.stringify(event));
  
  // EventBridge trigger — run daily debate
  if (event.source === "eventbridge" || event.action === "daily-debate") {
    console.log("⏰ Running daily debate...");
    await runDailyDebate();
    return { statusCode: 200, body: "Daily debate complete!" };
  }
  
  // Regular API request
  return serverlessApp(event, context);
};
