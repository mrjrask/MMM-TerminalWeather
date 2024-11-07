Module.register("MMM-TerminalWeather", {
  defaults: {
    displayDuration: 20000, // 20 seconds
    commands: ["curl wttr.in", "clear", "curl v2.wttr.in", "clear", "pyphoon", "clear", "htop", "clear"]
  },

  start: function () {
    console.log("[MMM-TerminalWeather] Module started.");
    this.currentCommandIndex = 0;
    this.output = "pi@mirror:~$ ";
    this.typing = false;
    console.log(`[MMM-TerminalWeather] Initial command: ${this.defaults.commands[this.currentCommandIndex]}`);
    this.sendSocketNotification("FETCH_COMMAND_OUTPUT", this.defaults.commands[this.currentCommandIndex]);
  },

  socketNotificationReceived: function (notification, payload) {
    console.log(`[MMM-TerminalWeather] Received socket notification: ${notification} with payload:`, payload);
    if (notification === "COMMAND_OUTPUT") {
      this.output += payload + "\npi@mirror:~$ ";
      console.log(`[MMM-TerminalWeather] Updated output: ${this.output}`);
      this.updateDom();
      this.currentCommandIndex = (this.currentCommandIndex + 1) % this.defaults.commands.length;
      console.log(`[MMM-TerminalWeather] Next command: ${this.defaults.commands[this.currentCommandIndex]}`);
      setTimeout(() => {
        this.sendSocketNotification("FETCH_COMMAND_OUTPUT", this.defaults.commands[this.currentCommandIndex]);
      }, this.config.displayDuration);
    }
  },

  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.style.width = "128ch"; // 128 characters wide
    wrapper.style.height = "46em"; // 46 lines of text
    wrapper.style.backgroundColor = "darkgray"; // Dark gray background for differentiation
    wrapper.style.color = "green";
    wrapper.style.fontFamily = "monospace";
    wrapper.style.fontSize = "12px"; // Adjust for terminal-like appearance
    wrapper.style.padding = "10px";
    wrapper.style.whiteSpace = "pre-wrap";
    wrapper.style.overflow = "hidden";
    wrapper.style.textAlign = "left"; // Left-justify the text
    wrapper.innerHTML = this.output;
    console.log("[MMM-TerminalWeather] Rendering DOM element.");
    return wrapper;
  }
});
