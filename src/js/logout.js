$(() => {
  exSignOut();
});

function exSignOut() {
  const menu = $("#nb");
  if (!menu) {
    return;
  }

  const img = $($("img", menu)[0]).clone();
  const a = $($("a", menu)[0])
    .clone()
    .html("Sign out")
    .attr("href", "#")
    .attr("style", "color: #DDD;")
    .on("click", async () => {
      console.log("Sign out...");
      await chrome.runtime.sendMessage({ action: "LOGOUT" });
    });

  menu.append(img, a);
}
