﻿function make_tbfile( rows, cols, bdwidth,  rootRW )
{ 
	return   html =  ""
+ '<!DOCTYPE html>'  + "\n"
+ '<html lang="en">' + "\n"
+ '<head>' + "\n"
+ '    <meta charset="gb2312">' + "\n"
+ '    <meta http-equiv="X-UA-Compatible" content="IE=edge">' + "\n"
+ '    <meta name="viewport" content="width=device-width, initial-scale=1">' + "\n"
+ '   <title>Table Builder</title>' + "\n"
+ '   <link href="./css/main.css" rel="stylesheet">' + "\n"
+ '   <style > html body{ margin:0;  padding:0;} </style>'     + "\n"
+ '   <script src="./js/jquery-1.6.2.min.js" type="text/javascript"> </script>' + "\n"
+ '   <script src="./js/Position.js" type = "text/javascript"> </script>' + "\n"
+ ' 	<script src="./js/common.js" type="text/javascript"> </script>' + "\n"
+ '     <script src="./js/tablebuilder.js" type="text/javascript"> </script>' + "\n"
+ '     <script src="./js/main.js" type="text/javascript"></script>' + "\n"
+ '     <script src="./js/jquery.contextmenu.r2.js"></script>' + "\n"
+ '' + "\n"
+ '   <script type="text/javascript">' + "\n"
+ '         $(function () {' + "\n"
+ ''  + "\n"
+ '                if ( $("#editSet").html() == "")' + "\n"
+ '                 {' + "\n"
+ '                     console.log("Call tableCreater to new a table.");' + "\n"
+ '                     tableCreater();' + "\n"
+ '                 }' + "\n"
+ '                 else { // restore dynamic merge/combine table' + "\n"
+ '                      initContextMenu("tbody"); ' + "\n"
+ '                     RestoreCardBuilder(400, 400);' + "\n"
+ '                 }' + "\n"
+ ''                  + "\n"
+ '                ResizeTable();' + "\n"
+ ''                  + "\n"
+ '                window.addEventListener("resize", ResizeTable);' + "\n"
+ '                 window.onload = ResizeTable;' + "\n"
+ '         });	' + "\n"
+ '     </script>' + "\n"
+ '' + "\n"
+ '</head>' + "\n"
+ ' <body >' + "\n"
+ ''      + "\n"
+ '<input type="text" id="selectedRW"     placeholder="行x列"            value=""  hidden />' + "\n"
+ ' <input type="text" id="rootRW"           placeholder="父单元编号"    value="'+rootRW+'"  hidden />' + "\n"
+ ' <input type="text" id="tblWidth"         placeholder="表格宽"        value="1024"  hidden  />' + "\n"
+ ' <input type="text" id="tblHight"          placeholder="表格高"        value="768"  hidden  />' + "\n"
+ ' <input type="text" id="tblBdWidth"     placeholder="表格边宽"  value="'+ bdwidth +'"  hidden  />' + "\n"
+ ' <input type="text" id="rows" placeholder="行" value="'+ rows +'" hidden />' + "\n"
+ ' <input type="text" id="cols" placeholder="列"  value="'+ cols +'"  hidden />' + "\n"
+ ' <script type="text/javascript" >' + "\n"
+ '     function getSelCellRowCol() { return $("#selectedRW").val();}' + "\n"
+ '     function getRootCellRW() {  return $("#rootRW").val();  }' + "\n"
+ '     function getRootCellWidth() {  return $("#tblWidth").val();  }' + "\n"
+ '     function getRootCellHeight() {  return $("#tblHight").val();  }' + "\n"
+ '     function getBorderWidth() { return $("#tblBdWidth").val();  }' + "\n"
+ '     function overlay() ' + "\n"
+ '     {' + "\n"
+ '         el = document.getElementById("overlay");' + "\n"
+ '         el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible";' + "\n"
+ '     }' + "\n"
+ ' </script>' + "\n"
+  ''    + "\n"
// + '<div  style="padding:0; margin:0;" align="center">' + "\n"
+ '      <div id="editSet" style="padding:0; margin:0; align:center;" ></div>' + "\n"
// + '</div>' + "\n"
+ '' + "\n"
+ '<!--<div id="overlay"  >' + "\n"
+ '    <iframe src="./bdeditor.html" style="height:1024px; width:1024px; border:0px;" id="bd"></iframe>' + "\n"
+ ' </div>-->' + "\n"
+ '' + "\n"
+ ' <!--右键菜单-->' + "\n"
+ ' <div class="contextMenu" id="myMenu"  hidden >' + "\n"
+ '  <ul>' + "\n"
+ '  <li id="btnMerge">合并</li>' + "\n"
+ '   <li id="btnSplit">拆分</li>' + "\n"
+ '    <!--<li id="btnEditingCell">编辑</li>-->' + "\n"
+ '   <li id="btnSaveMe">保存</li>' + "\n"
+ '  </ul>' + "\n"
+ ' </div>' + "\n"
+ ''     + "\n"
+ '</body>' + "\n"
+ ' </html>'; 
} 