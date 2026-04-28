const { inngest } = require("./inngest/client");

async function triggerTest() {
  await inngest.send({
    name: "test/hello.world",
    data: {
      name: "Vibio Developer",
    },
  });
  console.log("Event sent to Inngest!");
}

triggerTest();
