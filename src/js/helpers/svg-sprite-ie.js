// svg sprite for IE browser
// need add lib to html before app.js
// <script src="vendor/svg4everybody/svg4everybody.min.js"></script>
function initSVGSpriteIE(){
  svg4everybody();
}
document.addEventListener("DOMContentLoaded", initSVGSpriteIE);
