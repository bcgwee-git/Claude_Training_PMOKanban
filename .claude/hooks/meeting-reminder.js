/* IT meeting reminder: after 10 seconds on the page, show a modal dialog.
   Self-contained (injects its own CSS + dialog). Inlined into index.html, v2/ and v3/. */
(function () {
  var DELAY_MS = 10000;
  var MESSAGE = "There is an IT meeting next Wednesday at 10:00 AM in Room 111.";

  var css =
    ".itm-dialog{border:0;border-radius:12px;padding:0;max-width:min(92vw,420px);box-shadow:0 20px 60px rgba(0,0,0,.35);font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;color:#1b2a41}" +
    ".itm-dialog::backdrop{background:rgba(10,25,50,.55)}" +
    ".itm-head{background:#1f5fbf;color:#fff;padding:14px 20px;font-weight:600;font-size:16px}" +
    ".itm-body{padding:20px;font-size:15px;line-height:1.5}" +
    ".itm-foot{padding:0 20px 18px;text-align:right}" +
    ".itm-ok{background:#1f5fbf;color:#fff;border:0;border-radius:8px;padding:8px 22px;font-size:14px;cursor:pointer}" +
    ".itm-ok:hover{background:#174a96}.itm-ok:focus-visible{outline:3px solid #8db6f2;outline-offset:2px}";

  function show() {
    if (typeof HTMLDialogElement === "undefined") { return; }
    var style = document.createElement("style");
    style.textContent = css;
    document.head.appendChild(style);

    var dlg = document.createElement("dialog");
    dlg.className = "itm-dialog";
    dlg.setAttribute("aria-labelledby", "itm-title");

    var head = document.createElement("div");
    head.className = "itm-head";
    head.id = "itm-title";
    head.textContent = "\uD83D\uDCC5 IT Meeting Reminder";

    var body = document.createElement("div");
    body.className = "itm-body";
    body.textContent = MESSAGE;

    var foot = document.createElement("div");
    foot.className = "itm-foot";
    var ok = document.createElement("button");
    ok.type = "button";
    ok.className = "itm-ok";
    ok.textContent = "Got it";
    ok.addEventListener("click", function () { dlg.close(); });
    foot.appendChild(ok);

    dlg.appendChild(head);
    dlg.appendChild(body);
    dlg.appendChild(foot);
    dlg.addEventListener("close", function () { dlg.remove(); style.remove(); });
    document.body.appendChild(dlg);
    dlg.showModal();
    ok.focus();
  }

  setTimeout(show, DELAY_MS);
})();
