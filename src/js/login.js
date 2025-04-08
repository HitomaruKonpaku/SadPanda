$(async () => {
  console.log("logged in", await isLoggedIn());
  if (await isLoggedIn()) {
    if ($("body").html().length) {
      return;
    }

    await chrome.runtime.sendMessage({
      action: "RELOAD",
    });

    return;
  }
  exSignIn();
});

async function isLoggedIn() {
  return chrome.runtime.sendMessage({
    action: "IS_LOGGED_IN",
  });
}

function exSignIn() {
  $("body").load(chrome.runtime.getURL("src/html/login.html"), () => {
    $("body").css("background-color", "#4e4e4e");

    $("#button").on("click", async () => {
      await chrome.runtime.sendMessage({
        action: "LOGIN",
        originalUrl: window.location.href,
      });

      window.location.href =
        "https://forums.e-hentai.org/index.php?act=Login&CODE=00";
    });
  });
}
