const timer = setInterval(() => {
  const home = $("#userlinks > p.home > b");

  console.log("home", home);

  if (home.html()?.includes("")) {
    chrome.runtime.sendMessage(
      {
        action: "LOGIN_SUCCESS",
      },
      (result) => {
        console.log("login success");

        if (typeof result === "string") {
          clearInterval(timer);
          window.location.href = result;
        }

        if (result === true) {
          clearInterval(timer);
        }
      }
    );
  }
}, 1000);
