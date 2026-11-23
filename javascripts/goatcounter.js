console.log("goatcounter.js loaded");

(function () {
  var endpoint = "https://operam.goatcounter.com/count";

  // Load GoatCounter once, with auto-counting turned off
  window.goatcounter = { no_onload: true };
  var s = document.createElement("script");
  s.async = true;
  s.src = "//gc.zgo.at/count.js";
  s.setAttribute("data-goatcounter", endpoint);
  s.onload = function () { track(); };
  document.head.appendChild(s);

  function track() {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: location.pathname + location.search });
    }
  }

  function loadVisitorCount() {
    var views = document.getElementById("gc-views");
    var visitors = document.getElementById("gc-visitors");
    if (!views) return; // not on the home page

    fetch("https://operam.goatcounter.com/counter/TOTAL.json")
      .then(function (r) { return r.json(); })
      .then(function (d) {
        views.textContent = d.count;
        visitors.textContent = d.count_unique;
      })
      .catch(function () {
        views.textContent = "n/a";
        visitors.textContent = "n/a";
      });
  }

  // Run once on first load
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadVisitorCount);
  } else {
    loadVisitorCount();
  }

  // Run again after each instant-navigation page change
  var first = true;
  function onPageChange() {
    if (first) { first = false; return; } // first load already handled above
    track();
    loadVisitorCount();
  }

  if (window.document$) {
    window.document$.subscribe(onPageChange);
  } else {
    window.addEventListener("load", function () {
      if (window.document$) window.document$.subscribe(onPageChange);
    });
  }
})();