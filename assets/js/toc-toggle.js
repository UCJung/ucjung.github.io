document.addEventListener("DOMContentLoaded", function () {
  var toggleBtn = document.getElementById("toc-toggle");
  var tocCol = document.getElementById("toc-col");
  if (!toggleBtn || !tocCol) return;

  // Restore saved state
  if (localStorage.getItem("toc-collapsed") === "true") {
    tocCol.classList.add("collapsed");
    toggleBtn.textContent = "\u25B6";
    toggleBtn.title = "목차 펼치기";
  }

  toggleBtn.addEventListener("click", function () {
    var isCollapsed = tocCol.classList.toggle("collapsed");
    toggleBtn.textContent = isCollapsed ? "\u25B6" : "\u25C0";
    toggleBtn.title = isCollapsed ? "목차 펼치기" : "목차 숨기기";
    localStorage.setItem("toc-collapsed", isCollapsed);
  });
});
