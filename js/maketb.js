﻿//the generated tb.html files with this function should be saved to _session folder
function make_tbfile( rows, cols, bdwidth,  rootRW )
{ 
	return   html =  ""
+ '<!DOCTYPE html> ' + "\n"
+ '<html lang="en"> ' + "\n"
+ '<head> ' + "\n"
    + '<meta charset="gb2312"> ' + "\n"
    + '<meta http-equiv="X-UA-Compatible" content="IE=edge"> ' + "\n"
    + '<meta name="viewport" content="width=device-width, initial-scale=1"> ' + "\n"
    + '<title>Table Builder</title> ' + "\n"
    + '<link href="../css/main.css" rel="stylesheet"> ' + "\n"
    + '<style > html body{ margin-top:0;  padding:0;} </style>     ' + "\n"
    + '<script src="../js/jquery-1.6.2.min.js" type="text/javascript"> </script> ' + "\n"
    + '<script src="../js/Position.js" type = "text/javascript"> </script> ' + "\n"
	+ '<script src="../js/common.js" type="text/javascript"> </script> ' + "\n"
    + '<script src="../js/tablebuilder.js" type="text/javascript"> </script> ' + "\n"
    + '<script src="../js/main.js" type="text/javascript"></script> ' + "\n"
    + '<script src="../js/jquery.contextmenu.r2.js"></script> ' + "\n"
	+ '<script >function 	savetable() { return SaveMe(); }	</script> ' + "\n"
    + '<script >function 	getelementidbyposition(x,y) { var elem=  FindElementFromPoint(x,y); return elem.id; }</script>' + "\n"
    + '<script >function 	cancelselection() { ClearCellSelection(); }</script>' + "\n"
+ '	 ' + "\n"
    + '<script type="text/javascript"> ' + "\n"
        + '$(function () { ' + "\n"
+ ' ' + "\n"
                + 'if ( $("#editSet").html() == "") ' + "\n"
                + '{ ' + "\n"
                    + 'console.log("Call tableCreater to new a table."); ' + "\n"
                    + 'tableCreater(); ' + "\n"
                + '} ' + "\n"
                + 'else { // restore dynamic merge/combine table ' + "\n"
                     + 'initContextMenu("tbody");  ' + "\n"
+ '					  ' + "\n"
					+ 'var borderWidth = getBorderWidth(); ' + "\n"
                    + 'RestoreCardBuilder(400, 400, borderWidth); ' + "\n"
                + '} ' + "\n"
+ '                 ' + "\n"
                + '// window.addEventListener("resize", ResizeTable); ' + "\n"
                + 'if (window.addEventListener) { ' + "\n"
                    + 'window.addEventListener("resize", ResizeTable); ' + "\n"
                + '} else if (window.attachEvent) { ' + "\n"
                    + 'window.attachEvent("resize", ResizeTable); ' + "\n"
                + '} ' + "\n"
                + '                 ' + "\n"
                + 'window.onload = ResizeTable; ' + "\n"
            +    ' $(document).keyup(function(e) {' + "\n"
            +     '     if (e.keyCode == 27) { cancelselection();  }   // esc' + "\n"
            +    ' });' + "\n"
        + '});	 ' + "\n"
    + '</script> ' + "\n"
+ ' ' + "\n"
+ '</head> ' + "\n"
+ '<body > ' + "\n"
+ '     ' + "\n"
+ '<input type="text" id="selectedRW"     placeholder="行x列"           value=""  hidden /> ' + "\n"
+ '<input type="text" id="rootRW"           placeholder="父单元编号"   value="' + rootRW + '"  hidden /> ' + "\n"
+ '<input type="text" id="tblWidth"         placeholder="表格宽"        value="1024"  hidden  /> ' + "\n"
+ '<input type="text" id="tblHight"          placeholder="表格高"        value="768"  hidden  /> ' + "\n"
+ '<input type="text" id="tblBdWidth"     placeholder="表格边宽"  value="' + bdwidth + '"  hidden  /> ' + "\n"
+ '<input type="text" id="rows" placeholder="行" value="' + rows + '" hidden /> ' + "\n"
+ '<input type="text" id="cols" placeholder="列"  value="' + cols + '"  hidden /> ' + "\n"
+ '<script type="text/javascript" > ' + "\n"
    + 'function getSelCellRowCol() { return $("#selectedRW").val();} ' + "\n"
    + 'function getRootCellRW() {  return $("#rootRW").val();  } ' + "\n"
    + 'function getRootCellWidth() {  return $("#tblWidth").val();  } ' + "\n"
    + 'function getRootCellHeight() {  return $("#tblHight").val();  } ' + "\n"
    + 'function getBorderWidth() { return $("#tblBdWidth").val();  } ' + "\n"
    + 'function overlay()  ' + "\n"
    + '{ ' + "\n"
        + 'el = document.getElementById("overlay"); ' + "\n"
        + 'el.style.visibility = (el.style.visibility == "visible") ? "hidden" : "visible"; ' + "\n"
    + '} ' + "\n"
+ '</script> ' + "\n"
+ '     ' + "\n"
+ ' ' + "\n"
 + '<div id="editSet" style="padding:0; margin:0; align:center;" ></div> ' + "\n"
+ ' ' + "\n"
+ ' ' + "\n"
+ '<!-- <div id="overlay"  > ' + "\n"
    + '<iframe src="../bdeditor.html" style="height:1024px; width:1024px; border:0px;" id="bd"></iframe> ' + "\n"
+ '</div>--> ' + "\n"
+ ' ' + "\n"
+ '<!--右键菜单--> ' + "\n"
+ ' <div class="contextMenu" id="myMenu" hidden > ' + "\n"
+ ' <ul style="border-radius:5px; "> ' + "\n"
+ '   <li id="btnMerge"><img src="./img/Save.png" >合并</li> ' + "\n"
+ '   <li id="btnSplit"><img src="./img/Save.png" >拆分</li> ' + "\n"
+ '   <li id="btnClearSel"><img src="./img/Save.png" >撤销选择</li> ' + "\n"
+ '    <hr style="padding:0; margin:0;"> ' + "\n"
+ '    <li id="btnClear"><img src="./img/Save.png" >清除</li> ' + "\n"
+ '   <li id="btnEditingCell"><img src="./img/Save.png" >编辑</li> ' + "\n"
+ '   <hr style="padding:0; margin:0;"> ' + "\n"
+ '  <li id="btnSaveMe"><img src="./img/Save.png" >保存</li> ' + "\n"
+ ' </ul> ' + "\n"
+ '</div> ' + "\n"
+ '     ' + "\n"
+ '</body> ' + "\n"
+ '</html> ' + "\n";

} 