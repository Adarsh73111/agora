const { runDebate } = require("./debateEngine");

const topic = "Is artificial intelligence more of a threat or an opportunity for humanity?";

runDebate(topic, 1)
  .then(() => process.exit(0))
  .catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
  });
