
const NodeHelper = require("node_helper");
const { exec } = require("child_process");

module.exports = NodeHelper.create({
  start: function () {
    console.log("[MMM-TerminalWeather] Node helper started.");
  },

  socketNotificationReceived: function (notification, payload) {
    console.log(`[MMM-TerminalWeather] Received socket notification: ${notification} with payload: ${payload}`);
    if (notification === "FETCH_COMMAND_OUTPUT") {
      this.executeCommand(payload);
    }
  },

  executeCommand: function (command) {
    console.log(`[MMM-TerminalWeather] Executing command: ${command}`);
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`[MMM-TerminalWeather] Error executing ${command}: ${stderr}`);
        this.sendSocketNotification("COMMAND_OUTPUT", `Error: ${stderr}`);
        return;
      }
      console.log(`[MMM-TerminalWeather] Command output: ${stdout}`);
      this.sendSocketNotification("COMMAND_OUTPUT", stdout);
    });
  }
});
