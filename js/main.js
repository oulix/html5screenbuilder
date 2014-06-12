//colsole.log defien for IE compatiable
if (!window.console) window.console = {};
if (!window.console.log) window.console.log = function () { };

//global config
var _sessionFolder = "_session/";
var _rootPath = getAbsolutePath().replace("file:///", "") + _sessionFolder;

var rootCellHeight ;
var rootCellWidth;

/** *Write text file*/
function WriteTextFile(filename, text) {
    var FSO = new ActiveXObject("Scripting.FileSystemObject");
    with (FSO.OpenTextFile(filename, 2, true)) {
        Write(text);
        Close();
    }
}
/***	Read text file */
function ReadTextFile(filename) {
    var text = '';
    var FSO = new ActiveXObject("Scripting.FileSystemObject");   
    if (FSO.FileExists(filename)) {
        if (FSO.GetFile(filename).Size > 0) {
            with (FSO.OpenTextFile(filename)) {
                text = ReadAll();
                Close();
            }
        }
    }
    return text;
}

//fetch html 's  absolute path
function getAbsolutePath() {
    var loc = window.location;
    var pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}



//get URL parameters
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

/***	 生成外层大框架表格 */
function generatorSketch() 
{
    var rows = $("#rows").val();
    var cols = $("#cols").val();
    console.log(rows);
    console.log(cols);
    
    var screenW = screen.availWidth; //获取屏幕宽度
    var screenH = screen.availHeight; //获取屏幕高度  

    // var screenW = document.body.clientWidth;
    // var screenH =  document.body.clientHeight;

    // var tableStyle = "style=\"position: absolute;	width: "+screenW+"px; height: "+screenH+"px; background: #eeeeee;\"";
    
    var tdWidth  = screenW / cols;
    var tdHeight = screenH / rows;
    var style ="\
    <style>\
        .sketchTable{\
            left:0;\
            position:absolute;\
            table-layout: fixed;\
            word-wrap:break-word;\
            overflow: hidden;\
            width: 100%;\
            height: 100%;\
            background:#eeeeee;\
            text-overflow: ellipsis;\
        }\
        .sketchTd {\
            min-height: "+tdHeight+"px;\
            max-height: "+tdHeight+"px;\
            min-width:  "+tdWidth+"px;\
            max-width:  "+tdWidth+"px;\
            table-layout: fixed;\
            word-wrap:break-word;\
            overflow: hidden;\
            border:solid;\
            border-width:2px;\
            border-color: white;\
            background-color: rgb(0,101,153);\
        }\
        .sketchTd:hover\
        {\
            background-color: #00cc99;\
        }\
    </style>\
    ";

    rootCellWidth = tdWidth;
    rootCellHeight = tdHeight;

    var html = style;
    html  += "<table  class='sketchTable' border='0' cellspacing='0' cellpadding='0' align='center'>\n"; 
    html  += "<tbody id='sketch'>\n" 	//约定外框架的tbody的ID为sketch
    for (var i = 0; i < rows; i++) {
        html += "<tr>"
        for (var j = 0; j < cols; j++) {
            var id = i + "x" + j;
            html += "<td  class='sketchTd' id=\"" + id + "\" ondblclick='editCell(\"" + id + "\");'>&nbsp;</td>\n"; 
        }
        html += "</tr>\n";
    }
    html += "</tbody>\n</table>\n";

    $("#workspace").html(html);
    
    initContextMenu("td");

}


function generatorFrameSketch(rows, cols, borderWidth)
{
    var htmlTxt = "<html>";
    
    var cellHeight = 100/rows + "%";
    var cellWidth = 100/cols + "%";
    
    var rowSetting ="" ;
    var colSetting = "";
   for (var i = 0; i < rows-1; i++) {
        rowSetting += cellHeight +",";
   }
   rowSetting += "*";
   
   for(var i = 0; i< cols-1; i++){
        colSetting +=  cellWidth +",";
    }
    colSetting += "*";
   
   htmlTxt  += "<frameset rows='" + rowSetting + "'  frameborder='1'  border='"+ borderWidth+"'  >";
    
    for (var r= 0; r< rows; r++) {
            htmlTxt += "<frameset cols='"+ colSetting+"'>";
        for (var c = 0; c < cols; c++) {
            htmlTxt += "<frame src='./_session/"+r+"x"+c+"-struct.html' scrolling='no' marginwidth='0' marginheight='0' framespacing='0' >";
        } 
            htmlTxt += "</frameset>";
    }
    
   
    htmlTxt += "</frameset></html>";   
   
    console.log(htmlTxt); 
    return htmlTxt;
    
}


/* 依赖 jquery.contextmenu.r2.js */
function initContextMenu( bundleTarget)
{
        if( typeof(bundleTarget)=="undefined") bundleTarget="td";
        $( bundleTarget ).contextMenu('myMenu', 
		 {
			  bindings: 
			  {
                  //_generator.html
				'btnClearCell': function(el) {
                    console.log('Trigger element id '+el.id+'\t 清空'); 
                    clearCell(el.id);
				},
				'btnEditCell': function(el) {
                    console.log('Trigger element id '+el.id+'\t 编辑');
                    editCell(el.id);
				},
                'btnSaveSketch': function(el) {
                    console.log('Trigger element id '+el.id+'\t 保存到文件');
                   saveSketch();
				},
                'btnLoadSketch': function(el) {
                    console.log('Trigger element id '+el.id+'\t 从文件载入');
                   loadSession();
				},
                'btnPreview': function(el) {
                    console.log('Trigger element id '+el.id+'\t 用frameset预览');
                    preView();
				},
                
                //_tablebuilder.html
                'btnMerge': function(el) {
                    console.log('Trigger element id '+el.id+'\t 合并'); 
                    MergeCellSelection();
                    ResizeTable();
				},
				'btnSplit': function(el) {
                    console.log('Trigger element id '+el.id+'\t 拆分');
                    ExplodeCellSelection();
				},
                'btnEditingCell': function(el) {
                    console.log('Trigger element id '+el.id+'\t 编辑单元格');
                    overlay();
				},
			   'btnSaveMe': function(el) {
                    console.log('Trigger element id '+el.id+'\t 保存');
                    SaveMe();
				},
			  }
		});
}


/***	打开新窗口编辑各单元 */
function editCell(id) 
{
    var w = screen.availWidth-100;
    var h = screen.availHeight -60;
    var url = "_tablebuilder.html?id=" + id + "&tblH="+rootCellHeight+"&tblW="+rootCellWidth;
    console.log(url);
    
    mywindow = window.open( url , "_blank","menubar=1,resizable=1,width=" +  (w/5*4) +",height=" + h  );
    mywindow.moveTo( w/5/2,  0);
}

function preView()
{
    var w = screen.availWidth;
    var h = screen.availHeight ;
    var url = "frameset.html";
    previewW = window.open( url , "_blank","menubar=0,resizable=1,width=200, height=200, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no" );
    previewW.moveTo( 0,  0);
    previewW.resizeTo(w, h);
    
    console.log("w + h:" + w + " ," +h);
}

/*清空单元 */
function clearCell(id)
{
    var filename = _rootPath + id + "-struct.html";
    console.log(filename);
    console.log(id);
    WriteTextFile(filename, "");
    
    $("#"+id).html("");
}

/***	保存外框架 到文件*/
function saveSketch() 
{
    var filename = _rootPath + "sketch.html";
    var filecontent = $("#workspace").html();
    WriteTextFile(filename, filecontent);
}

/***	保存外框架单元格内的可编辑表格到文件 */
function saveTableforCell()
{
    var rootRw = getRootCellRW(); // in _tablebuilder.html
    
    var filename = _rootPath + rootRw +  "-struct.html";
    console.log("saveTableforCell: " + filename);
    
    //保存前清除掉表格的背景色
   /* var tbody = $("tbody")[0];  
    for (var i = 0; i < tbody.rows.length; i++) {
        var row = tbody.rows[i];
        for (var j = 0; j < row.cells.length; j++) {
           row.cells[j]. style.backgroundColor = "";
        }
    }*/
    
    var resizeCode = "<script src='../js/jquery-1.6.2.min.js'></script>\n" +
                                    "<script src='../js/main.js'></script>\n" +
                                    "<script> window.addEventListener('resize', ResizeTable);  window.onload=ResizeTable;</script>\n " +
                                    "<style > html body{   margin-top:0;  margin-left:0;  margin-bottom:0;  margin-right:0;} </style>\n" ;
                                    
    var filecontent = $("#editSet").html();
    filecontent  = resizeCode + filecontent;
    WriteTextFile(filename, filecontent);
}

          
//  保存自身文件
function SaveMe()
{
    var doctype =    '<!DOCTYPE ' 
                                +  document.doctype.name 
                                +   (document.doctype.publicId?' PUBLIC "' 
                                +  document.doctype.publicId + '"':'') 
                                +  (document.doctype.systemId?' "' 
                                + document.doctype.systemId + '"':'') 
                                + '>';
    var html = document.documentElement.outerHTML;
    html = doctype +  "\n" + html;
    console.log( html );
    // WriteTextFile(_rootPath + "../a.html", html);
    return html;
}

/***	从文件载入 外框架单元格内的可编辑表格 */
function loadTableforCell(){
    var rootRw = getRootCellRW(); // in _tablebuilder.html
    var rtblHeight = getRootCellHeight();
    var rtblWidth = getRootCellWidth();
    
    var filename = _rootPath + rootRw  +  "-struct.html";   
    console.log( "loadTableforCell:" + filename);
    
    var filecontent = ReadTextFile(filename);  
    $("#editSet").html(filecontent);   

    initContextMenu("tbody");    
    RestoreCardBuilder(rtblWidth, rtblHeight);    
}


/*** based in bdeditor.html, which is load by iframe */
function saveContentToFile()
{
    var rw = parent.getSelCellRowCol();
    var child_id = "u"+rw.replace("x", "u");
    var parent_id = parent.getRootCellRW();
    var filepath = _rootPath + parent_id + "-" + child_id + ".html"; 
    console.log("saveContentToFile" + filepath);
    
    var filecontent = UE.getEditor('editor').getContent();
    
    WriteTextFile(filepath, filecontent);
    // alert("已经保存到"+filepath);
}

/***	  based in bdeditor.html, which is load by iframe */
function fillContentToTD()
{
    var rw = parent.getSelCellRowCol();
    var child_id = "u"+rw.replace("x", "u");        
    var filecontent = UE.getEditor('editor').getContent();  
    
    var div = parent.$("#"+child_id).children("DIV")[0];
    div.innerHTML = filecontent;
}

function ResizeTable()
{
	console.log("ResizeTable:");
	var tbls = document.getElementsByTagName("TABLE"); // 假定只在#editSet 里有一个表格
	var tbl = tbls[0];
	var rows = 0;
	var cols = 0; 
    
    borderWidth = getBorderWidth();

	var tds =tbl.getElementsByTagName('td');
	for (i = 0; i < tds.length; i++) 
	{
		var tid = tds[i].id;    // id = u3u5
		var arrRC =tid.split("u");  // arrRC = ["0", "3","5"]
		var r = parseInt( arrRC[1] ) ;
		var c = parseInt( arrRC[2] ) ;
        
        // borderWidth = tds[i].border; 
        // console.log(borderWidth);

		//得到表格的真实行列数
		if (rows < r)  rows = r;  
		if (cols < c )  cols = c; 
	}
	
    // var borderWidth = 2 ;
    // var w = getRootCellWidth();
    // var h = getRootCellHeight();
    var w = document.documentElement.clientWidth;
    var h  = document.documentElement.clientHeight;
    
	var tblWidth = w;               console.log(tblWidth);
	var tblHeight = h;              console.log(tblHeight);
    
	var tdWidth = (tblWidth - (cols +1) * borderWidth*2)/(cols +1)  ;              console.log(tdWidth);
	var tdHeight = (tblHeight -  (rows +1) * borderWidth*2)/(rows+1)  ;         console.log(tdHeight);
	
	for (i = 0; i < tds.length; i++) 
	{
		var td = tds[i];
		var tid = tds[i].id;
		td.style.width = tdWidth * td.colSpan +"px" ;
		td.style.height = tdHeight * td.rowSpan +"px";
		
		var div = $("#"+tid).children("DIV")[0];
		div.style.overflow="hidden";
		div.style.padding="2px";
		div.style.marginTop = "0px"; 
		div.style.marginBottom = "0px";
		div.style.maxWidth = tdWidth * td.colSpan - 5 +"px" ;
		div.style.maxHeight = tdHeight * td.rowSpan -5  +"px";
	}
		
}


/***动态创建可合并和拆分的表格*/
function tableCreater( )
{    
    console.log("tableCreater");
    var rows = $("#rows").val();
    var cols = $("#cols").val();
    var parent_id = getRootCellRW();  
    var borderWidth = getBorderWidth(); console.log(borderWidth);
    
    // var tblWidth = getRootCellWidth(); console.log(tblWidth);
    // var tblHeight = getRootCellHeight(); console.log(tblHeight);
    
    var tblWidth =  document.documentElement.clientWidth;  //window.screen.availWidth ;
    // var tblWidth = document.body.offsetWidth;
    var tblHeight =  document.documentElement.clientHeight; //window.screen.availHeight;
    // var tblHeight = document.body.offsetHeight;
   
    
    if (rows > 0 && cols > 0)
    {
        var tbl = CreateCardBuilder(rows,cols, parent_id, tblWidth, tblHeight, borderWidth);
        
        //clear child nodes first
        var node = document.getElementById("editSet");
        while (node.firstChild) {
            node.removeChild(node.firstChild);
        }

        node.appendChild(tbl); 		
        InitGlobal();
        
        initContextMenu("tbody");
    }
}

function loadSession() 
{ 
    // sketch.html - 外框架文件
    // 0x0-struct.html -外框架的单元格内的内容文件
    // 0x0-u1u2.html  -每个合并和拆分后格子内的内容，暂未使用
 
    var sketch = ReadTextFile(_rootPath + "sketch.html");
    $("#workspace").html(sketch);
    
    if( sketch.length === 0 ) { 
        console.log("loadSession: No existed sketch.html or is empty.  execute generatorSketch() first." );
        generatorSketch(); 
        // return;
    }
    
    initContextMenu("td");

    var tbody = $("#sketch")[0]; //找到外框架的tbody
    for (var i = 0; i < tbody.rows.length; i++) {
        var row = tbody.rows[i];
        for (var j = 0; j < row.cells.length; j++) {
            // row.cells[j].style.backgroundColor = "red";
            var id = row.cells[j].id;

            // loadCell(id);  //06.06.14 20:22 

            console.log(id);
            // console.log ( $("#"+id).html() );			
            // $("#"+id).html( i + " cell " + j );
        }
    }
}


function loadCell(parent_id) {
    var structfile = _rootPath + parent_id + "-struct.html";
    console.log("loadCell:" +structfile);

    var struct = ReadTextFile(structfile);
    $("#" + parent_id).html(struct);

    /* 各个子单元的内容已经存入 0x0-struct.html 文件中，此部分不再需要 */
    // var tbody = $("#cellx" + parent_id)[0];  //找到单元格的tbody. 格式为  cellx0x0, cellx0x1 
    // for (var i = 0; i < tbody.rows.length; i++) {
        // var row = tbody.rows[i];
        // for (var j = 0; j < row.cells.length; j++) {
            // var child_id = row.cells[j].id;
            // loadContent(parent_id, child_id);
        // }
    // }
}


function loadContent(parent_id, child_id) {
    
    var id = child_id.match(/\d+x\d+/)  ?  ( "u" + child_id.replace("x","u") )  :  child_id;
    
    var contentfile = _rootPath + parent_id + "-" + id + ".html";

    var content = ReadTextFile(contentfile);

    $("#" + id).html(content);
}



