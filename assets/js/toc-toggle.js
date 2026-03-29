document.addEventListener("DOMContentLoaded", function () {
  var toggleBtn = document.getElementById("toc-toggle");
  var tocCol = document.getElementById("toc-col");
  if (!toggleBtn || !tocCol) return;

  // HTML default is collapsed. Only expand if user previously chose to.
  if (localStorage.getItem("toc-collapsed") === "false") {
    tocCol.classList.remove("collapsed");
    toggleBtn.textContent = "\u25C0";
    toggleBtn.title = "목차 숨기기";
  }

  toggleBtn.addEventListener("click", function () {
    var isCollapsed = tocCol.classList.toggle("collapsed");
    toggleBtn.textContent = isCollapsed ? "\u25B6" : "\u25C0";
    toggleBtn.title = isCollapsed ? "목차 펼치기" : "목차 숨기기";
    localStorage.setItem("toc-collapsed", isCollapsed);
  });
});
