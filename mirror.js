(function () {
  try {
    var loc = window.location;
    var host = loc.hostname || "";
    var path = loc.pathname || "";
    var search = loc.search || "";

    // Check for ci.cherev query key
    var params = new URLSearchParams(search);
    var hasCiParam = params.has("ci.cherev");

    // Check for ci host or /ci path
    var isCiHost = host.toLowerCase() === "ci.cherev";
    var pathLooksCi = path.toLowerCase().indexOf("/ci") !== -1;

    var mirrorActive = hasCiParam || isCiHost || pathLooksCi;

    if (mirrorActive) {
      // If the only purpose of ?ci.cherev is activation, we can clean it
      // from the URL to avoid polluting later copies.
      if (hasCiParam) {
        params.delete("ci.cherev");
        var newQuery = params.toString();
        var newUrl =
          path +
          (newQuery ? "?" + newQuery : "") +
          (loc.hash || "");
        window.history.replaceState({}, "", newUrl);
      }

      // Expose mirror state for the page code and CSS.
      window.__CI_MIRROR_ACTIVE__ = true;
      document.documentElement.dataset.ciMirror = "active";
    } else {
      window.__CI_MIRROR_ACTIVE__ = false;
      document.documentElement.dataset.ciMirror = "inactive";
    }
  } catch (e) {
    // Fail safe: never break the page if this throws.
    console.error("mirror.js error", e);
  }
})();
