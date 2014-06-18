var cardLineStyle = '2px solid #ffffff';
var cardLabelBGColor = '#f0f1f6';
var cardInputBGColor = 'rgb(0,101,153)';
var cardHighlightBGColor = "#e0e0e0";
// var headLineStyle = '1px solid #a0a0a0';

// var borderWidth = 2;

var selecting = false;
var curSelection = null;
var curCardTable = null;
var labelHolder = null;
var inputHolder = null;

var actionLog = new Array(); //保存操作历史
		
function CellSelection(r0,c0,r1,c1)
{
	this.row0 = r0;
	this.col0 = c0;
	this.row1 = r1;
	this.col1 = c1;
	this.logr0 = -1;
	this.logc0 = -1;
	this.logr1 = -1;
	this.logc1 = -1;
}

function ClearCellSelection()
{
	var tbody = curCardTable.tBodies[0];
	var i,j;
	var row;
	for (i=0;i<tbody.rows.length;i++){
		row = tbody.rows[i];
		for (j=0;j<row.cells.length;j++){
			row.cells[j].style.backgroundColor = row.cells[j].bgc;
		}
	}
	curSelection = null;
}

function IsCellSelected(cell)
{
	if (!IsCardCell(cell))
		return false;
	if (cell.logr<=curSelection.logr1 && cell.logr+cell.rowSpan-1>=curSelection.logr0 &&
		cell.logc<=curSelection.logc1 && cell.logc+cell.colSpan-1>=curSelection.logc0)
		return true;
	return false;
}

function DrawCellSelection()
{
	if (curSelection==null)
		return;

	var tbody = curCardTable.tBodies[0];
	var i,j;
	var row,cell;
	
	for (i=0;i<tbody.rows.length;i++){
		row = tbody.rows[i];
		for (j=0;j<row.cells.length;j++){
			cell = row.cells[j];
			if (IsCellSelected(cell)){
				cell.style.backgroundColor = cardHighlightBGColor;

				// cell.innerHTML  = cell.logr + "x" + cell.logc;
				//记录选中单元
				$("#selectedRW").val(  cell.logr + "x" + cell.logc );
			}
			else{
				cell.style.backgroundColor = cell.bgc;
			}
		}
	}
}

function ExpandCellSelection()
{
	if (curSelection==null)
		return;
	
	var tbody = curCardTable.tBodies[0];
	var cell0 = tbody.rows[curSelection.row0].cells[curSelection.col0];
	var cell1 = tbody.rows[curSelection.row1].cells[curSelection.col1];
	if (cell0==cell1){
		curSelection.logr0 = cell0.logr;
		curSelection.logr1 = cell0.logr+cell0.rowSpan-1;
		curSelection.logc0 = cell0.logc;
		curSelection.logc1 = cell0.logc+cell0.colSpan-1;
		return;
	}

	var lr0 = Math.min(cell0.logr,cell1.logr);
	var lr1 = Math.max(cell0.logr+cell0.rowSpan-1,cell1.logr+cell1.rowSpan-1);
	var lc0 = Math.min(cell0.logc,cell1.logc);
	var lc1 = Math.max(cell0.logc+cell0.colSpan-1,cell1.logc+cell1.colSpan-1);

	var changed = true;
	while ( changed ){
		changed = false;
		for (i=0;i<tbody.rows.length;i++){
			row = tbody.rows[i];
			for (j=0;j<row.cells.length;j++){
				cell = row.cells[j];
				if (cell.logr<=lr1 && cell.logr+cell.rowSpan-1>=lr0 &&
					cell.logc<=lc1 && cell.logc+cell.colSpan-1>=lc0){
					if (cell.logr<lr0){
						lr0 = cell.logr;
						changed = true;
					}
					if (cell.logr+cell.rowSpan-1>lr1){
						lr1 = cell.logr+cell.rowSpan-1;
						changed = true;
					}
					if (cell.logc<lc0){
						lc0 = cell.logc;
						changed = true;
					}
					if (cell.logc+cell.colSpan-1>lc1){
						lc1 = cell.logc+cell.colSpan-1;
						changed = true;
					}
				}
			}
		}
	}
	curSelection.logr0 = lr0;
	curSelection.logr1 = lr1;
	curSelection.logc0 = lc0;
	curSelection.logc1 = lc1;
}

function MergeCell( rwArr )
{
	Arow    =   rwArr[0];
	Acol     =   rwArr[1];
	Brow    =   rwArr[2];
	Bcol     =    rwArr[3];
	
	var tbody = curCardTable.tBodies[0];
	var cell0 = tbody.rows[Arow].cells[Acol];
	var cell1 = tbody.rows[Brow].cells[Bcol];
	if (cell0==cell1)
		return;
	
	var i,j;
	var row,cell;
	
	for (i=tbody.rows.length-1;i>0;i--){
		row = tbody.rows[i];
		for (j=row.cells.length-1;j>=0;j--){
			cell = row.cells[j];
			if ( cell.logr==Arow && cell.logc==Acol ){
				cell.rowSpan = Brow-Arow+1;
				cell.colSpan = Bcol - Acol+1;
			}
			
			if ( Arow == Brow && cell.logr==Arow && cell.logc>Acol && cell.logc <= Bcol) {		
				row.deleteCell(j);
			}
			if ( Acol == Bcol && cell.logc == Acol && cell.logr>Arow && cell.logr <= Brow){		
				row.deleteCell(j);
			}
		}
	}
}


function MergeCellSelection()
{
	if (curSelection==null)
		return;
		
	var record = [curSelection.logr0, curSelection.logc0, curSelection.logr1, curSelection.logc1];	
	actionLog.push(record);	//  放入历史记录	
	var json_text = JSON.stringify(actionLog);// alert(json_text)	
	$("#actionLog").html (json_text); 	//序列化成文本存入html代码，便于下次恢复回来
	
	var tbody = curCardTable.tBodies[0];
	var cell0 = tbody.rows[curSelection.row0].cells[curSelection.col0];
	var cell1 = tbody.rows[curSelection.row1].cells[curSelection.col1];
	if (cell0==cell1)
		return;
	
	var i,j;
	var row,cell;
	
	for (i=tbody.rows.length-1;i>=0;i--){
		row = tbody.rows[i];
		for (j=row.cells.length-1;j>=0;j--){
			cell = row.cells[j];
			if (cell.logr==curSelection.logr0 && cell.logc==curSelection.logc0){
				cell.rowSpan = curSelection.logr1-curSelection.logr0+1;
				cell.colSpan = curSelection.logc1-curSelection.logc0+1;
			}
			else if (IsCellSelected(cell)){
				if (IsCardItem(cell.firstChild))
					ReturnItem2Holder(cell.firstChild);
				row.deleteCell(j);
			}
		}
	}
	ClearCellSelection();

}

function ExplodeCellSelection()
{
	if (curSelection==null)
		return;
	
	var tbody = curCardTable.tBodies[0];
	var cell0 = tbody.rows[curSelection.row0].cells[curSelection.col0];
	var cell1 = tbody.rows[curSelection.row1].cells[curSelection.col1];
	if (cell0!=cell1 || (cell0.rowSpan<=1 && cell0.colSpan<=1))
		return;

	var i,j,r,c;
	var td;
	var row = tbody.rows[curSelection.row0];
	var tgt = null;
	if (curSelection.col1<row.cells.length-1)
		tgt = row.cells[curSelection.col1+1];
	for (j=0;j<cell0.colSpan-1;j++){
		
		td = CreateCardCell(cell0.logr,cell0.logc+j+1);
		CreateDIVforTD(td);
		
		row.insertBefore(td,tgt);
	}

	for (i=0;i<cell0.rowSpan-1;i++){
		r = curSelection.row0+i+1;
		row = tbody.rows[r];
		tgt = null;
		for (c=0;c<row.cells.length;c++){
			if (row.cells[c].logc>curSelection.logc1){
				tgt = row.cells[c];
				break;
			}
		}
		for (j=0;j<cell0.colSpan;j++){
			
			td = CreateCardCell(cell0.logr+i+1,cell0.logc+j);
			CreateDIVforTD(td);
			
			row.insertBefore(td,tgt);
		}
	}
	
	cell0.rowSpan = 1;
	cell0.colSpan = 1;

	ClearCellSelection();
}

function InsertCardRow()
{
		 
	if (curSelection==null)
		return;

	var logr = curSelection.logr0;
	var i,j,k;
	var tbody = curCardTable.tBodies[0];
	var tr = document.createElement("TR");
	var td = document.createElement("TD");
	td.innerHTML = "&nbsp;";
	td.style.borderRight = cardLineStyle;
	td.style.borderBottom = cardLineStyle;
	td.style.borderLeft = cardLineStyle;
	td.style.borderTop = cardLineStyle;
	td.style.cursor = "default";
	tr.appendChild(td);

	var row,cell;

	for (i=0;i<tbody.rows.length;i++){
		row = tbody.rows[i];
		for (j=0;j<row.cells.length;j++){
			cell = row.cells[j];
			if (!IsCardCell(cell))
				continue;
			if (cell.logr>logr){
				cell.logr++;
			}
			else if (cell.logr==logr){
				cell.logr++;
				for (k=0;k<cell.colSpan;k++){
					
					td = CreateCardCell(logr,cell.logc+k);
					CreateDIVforTD(td);
					
					tr.appendChild(td);
				}
			}
			else if (cell.logr+cell.rowSpan>logr){
				cell.rowSpan++;
			}
		}
	}
	tbody.insertBefore(tr,tbody.rows[logr+1]);
	curCardTable.nRows++;

//	ClearCellSelection();
	curSelection.row0++;
	curSelection.row1++;
	curSelection.logr0++;
	curSelection.logr1++;
}

function DeleteCardRow()
{
	if (curSelection==null)
		return;

	if (isDefined(gblAskDeleteRow)){
		if (!confirm(gblAskDeleteRow))
			return;
	}
	var tbody = curCardTable.tBodies[0];
	var i,j,k,n,logr0,logr1;
	var row,cell;
	logr0 = curSelection.logr0;
	logr1 = curSelection.logr1;
	n = logr1-logr0+1;
	for (i=tbody.rows.length-1;i>0;i--){
		row = tbody.rows[i];
		for (j=row.cells.length-1;j>=0;j--){
			cell = row.cells[j];
			if (!IsCardCell(cell))
				continue;
			if (cell.logr>logr1){
				cell.logr -= n;
			}
			else if (cell.logr>=logr0 && cell.logr+cell.rowSpan-1<=logr1){
				if (IsCardItem(cell.firstChild))
					ReturnItem2Holder(cell.firstChild);
				cell.parentNode.removeChild(cell);
			}
			else if (cell.logr>=logr0 && cell.logr+cell.rowSpan-1>logr1){
				var x = cell.logr-logr0;
				cell.logr -= x;
				cell.rowSpan -= (n-x);
				cell.parentNode.removeChild(cell);
				var dest = tbody.rows[logr1+2];
				for (k=0;k<dest.cells.length;k++){
					if (IsCardCell(dest.cells[k]) && dest.cells[k].logc>cell.logc){
						dest.insertBefore(cell,dest.cells[k]);
						break;
					}
				}
				if (k>=dest.cells.length){
						dest.insertBefore(cell,null);
				}
			}
			else if (cell.logr<logr0 && cell.logr+cell.rowSpan-1>=logr0){
				cell.rowSpan -= Math.min(n,cell.logr+cell.rowSpan-logr0);
			}
		}
	}
	for (i=0;i<n;i++){
		tbody.removeChild(tbody.rows[logr0+1]);
	}

	curCardTable.nRows -= n;
	if (curCardTable.nRows<=0){
		tr = document.createElement("TR");
		tbody.appendChild(tr);
		
		td = document.createElement("TD");
		td.innerHTML = "&nbsp;";
		td.style.borderRight = cardLineStyle;
		td.style.borderBottom = cardLineStyle;
		td.style.borderLeft = cardLineStyle;
		td.style.borderTop = cardLineStyle;
		td.style.cursor = "default";
		tr.appendChild(td);
		
		for (j=0;j<curCardTable.nCols;j++){
			
			td = CreateCardCell(0,j);
			CreateDIVforTD(td);
			
			tr.appendChild(td);
		}
		curCardTable.nRows = 1;
	}
	ClearCellSelection();
}

function InsertCardCol()
{
	if (curSelection==null)
		return;

	var tbody = curCardTable.tBodies[0];
	var i,j,k,l;
	var logc = curSelection.logc0;
	var td,row,cell,dest;
	
	for (i=tbody.rows.length-1;i>0;i--){
		row = tbody.rows[i];
		for (j=row.cells.length-1;j>=0;j--){
			cell = row.cells[j];
			if (!IsCardCell(cell))
				continue;
			if (cell.logc>logc){
				cell.logc++;
			}
			else if (cell.logc==logc){
				cell.logc++;
				for (k=0;k<cell.rowSpan;k++){
					dest = tbody.rows[i+k];
					for (l=0;l<dest.cells.length;l++){
						if (IsCardCell(dest.cells[l]) && dest.cells[l].logc>logc)
							break;
					}
					
					td = CreateCardCell(cell.logr+k,logc);
					CreateDIVforTD(td);
					
					if (l<dest.cells.length)
						dest.insertBefore(td,dest.cells[l]);
					else
						dest.insertBefore(td,null);
				}
			}
			else if (cell.logc<logc && cell.logc+cell.colSpan>logc){
				cell.colSpan++;
			}
		}
	}

	td = document.createElement("TD");
	td.innerHTML = "&nbsp;";
	td.style.borderRight = cardLineStyle;
	td.style.borderBottom = cardLineStyle;
	td.style.borderLeft = cardLineStyle;
	td.style.borderTop = cardLineStyle;
	td.style.cursor = "default";
	// td.style.lineHeight = '1px';
	tbody.rows[0].insertBefore(td,null);

	curCardTable.nCols++;
//	ClearCellSelection();
	curSelection.col0++;
	curSelection.col1++;
	curSelection.logc0++;
	curSelection.logc1++;
}

function DeleteCardCol()
{
	if (curSelection==null)
		return;

	if (isDefined(gblAskDeleteCol)){
		if (!confirm(gblAskDeleteCol))
			return;
	}
	var tbody = curCardTable.tBodies[0];
	var i,j,k,n;
	var logc0 = curSelection.logc0;
	var logc1 = curSelection.logc1;
	var td,row,cell;

	n = logc1-logc0+1;	
	for (i=tbody.rows.length-1;i>0;i--){
		row = tbody.rows[i];
		for (j=row.cells.length-1;j>=0;j--){
			cell = row.cells[j];
			if (!IsCardCell(cell))
				continue;
			if (cell.logc>logc1){
				cell.logc -= n;
			}
			else if (cell.logc>=logc0 && cell.logc+cell.colSpan-1<=logc1){
				if (IsCardItem(cell.firstChild))
					ReturnItem2Holder(cell.firstChild);
				cell.parentNode.removeChild(cell);
			}
			else if (cell.logc>=logc0 && cell.logc+cell.colSpan-1>logc1){
				var x = cell.logc-logc0;
				cell.logc -= x;
				cell.colSpan -= (n-x);
			}
			else if (cell.logc<logc0 && cell.logc+cell.colSpan-1>=logc0){
				cell.colSpan -= Math.min(n,cell.logc+cell.colSpan-logc0);
			}
		}
	}
	
	row = tbody.rows[0];
	for (j=0;j<n;j++)
		row.removeChild(row.cells[logc0+1]);

	curCardTable.nCols -= n;
	ClearCellSelection();
}

function CreateCardItem(fld,txt,type)
{
	 
	var div = document.createElement("DIV");
	div.style.left = 0;
	div.style.top = 0;
	div.style.cursor = "default";
	// div.style.fontSize = "12px";
	div.style.marginLeft = "3px";
	div.style.marginRight = "5px";
	div.innerHTML = txt;
	div.itemType = type;
	div.fieldName = fld;
	if (type=="INPUT"){
		div.className = 'editAreaCSS';
		/*
		div.style.border = "1px solid #777";
		div.style.textAlign = "left";
		div.style.margin = "3px";
		div.style.backgroundColor = 'white';
		*/
	}
	else{
		div.className = 'txtLabelCSS';
		div.style.marginTop = "3px";
		/*
		div.style.fontWeight = 'bold';
		*/
	}

	 

	div.dragStartFunc = ItemDragStartFunc;
	div.dragFunc = ItemDragFunc;
	div.dropFunc = ItemDropFunc;
	return div;
}

function CreateCardCell(r,c)
{
	var td = document.createElement("TD");
	td.id="u"+r+"u"+c;
	td.innerHTML = "&nbsp;";
	td.style.borderRight = cardLineStyle;
	td.style.borderBottom = cardLineStyle;
	td.style.borderLeft = cardLineStyle;
	td.style.borderTop = cardLineStyle;
	td.style.backgroundColor = cardInputBGColor;
	td.bgc = cardInputBGColor;
	td.style.cursor = "default";
	// td.style.fontSize = "12px";
	td.align = "left";
	td.vAlign = "top";
	td.logr = r;
	td.logc = c;
	td.dragStartFunc = CellDragStartFunc;
	td.dragFunc = CellDragFunc;
	td.dropFunc = CellDropFunc;
	
	return td;
}

function SetCardCell( td, r, c )
{
	// var td = document.createElement("TD");
	// td.innerHTML = "&nbsp;";
	td.style.borderRight = cardLineStyle;
	td.style.borderBottom = cardLineStyle;
	td.style.borderLeft = cardLineStyle;
	td.style.borderTop = cardLineStyle;
	td.style.backgroundColor = cardInputBGColor;
	td.bgc = cardInputBGColor;
	td.style.cursor = "default";
	// td.style.fontSize = "12px";
	td.align = "left";
	td.vAlign = "top";
	td.logr = r;
	td.logc = c;
	td.dragStartFunc = CellDragStartFunc;
	td.dragFunc = CellDragFunc;
	td.dropFunc = CellDropFunc;	
}

function IsCardCell(elem)
{
	return (elem!=null && elem.tagName=="TD" && isDefined(elem.logr));
}

function IsCardItem(elem)
{
	return (elem!=null && elem.tagName=="DIV" && isDefined(elem.fieldName));
}

function CreateItemHolder(type)
{
	
	var div = document.createElement("DIV");
	div.style.height = 420;
	div.style.width=150;
	div.style.whiteSpace = 'nowrap';
	div.style.border = "1px solid #999";
	div.style.overflowX = "auto";
	div.style.overflowY = "auto";
	if (type=="LABEL")
		labelHolder = div;
	else{
		inputHolder = div;
		div.style.display = 'none';
	}
	return div;
}

function CreateDIVforTD(td)
{
	var div = document.createElement("DIV");
	div.style.overflow="hidden";
	div.style.padding="2px";
	div.style.marginTop = "0px"; 
	div.style.marginBottom = "0px";
	td.appendChild(div);	
}

function ReturnItem2Holder(elem)
{
	var pelem = elem.parentNode;
	if (pelem){
		pelem.removeChild(elem);
		if (IsCardCell(pelem)){
			pelem.style.backgroundColor = cardInputBGColor;
			pelem.bgc = cardInputBGColor;
			pelem.innerHTML = "&nbsp;";
		}
	}
	elem.style.position = "";
	if (elem.itemType=="LABEL"){
		labelHolder.appendChild(elem);
		elem.scrollIntoView(false);
		//elem.onmouseover = SetTooltip;
		//elem.onmouseout = HideTooltip;
	}
	else{
		elem.isRequired = false;
		inputHolder.appendChild(elem);
	}

	var tbody=curCardTable.tBodies[0];
	for (var i=1;i<tbody.rows.length;i++){
		var row = tbody.rows[i];
		for (var j=1;j<row.cells.length;j++){
			var cell = row.cells[j];
			if (IsCardItem(cell.firstChild) && cell.firstChild.fieldName==elem.fieldName){
				var pear = cell.firstChild;
				cell.removeChild(pear);
				cell.style.backgroundColor = cardInputBGColor;
				cell.bgc = cardInputBGColor;
				cell.innerHTML = '&nbsp;';
				pear.style.position = '';
				if (pear.itemType=='INPUT'){
					pear.isRequired = false;
					inputHolder.appendChild(pear);
				}
				else{
					labelHolder.appendChild(pear);
					pear.scrollIntoView(false);
					//pear.onmouseover = SetTooltip;
					//pear.onmouseout = HideTooltip;
				}
				return;
			}
		}
	}
}

function AlignCellSelection(dir,align)
{
	if (curSelection==null)
		return;
		
	var i,j,row;
	var tbody=curCardTable.tBodies[0];
	for (i=0;i<tbody.rows.length;i++){
		row = tbody.rows[i];
		for (j=0;j<row.cells.length;j++){
			if (IsCellSelected(row.cells[j])){
				if (dir=="H")
					row.cells[j].align = align;
				else
					row.cells[j].vAlign = align;
			}
		}
	}
}

function SetRequired()
{
	if (curSelection==null)
		return;
		
	var i,j,row,cell;
	var tbody=curCardTable.tBodies[0];
	for (i=0;i<tbody.rows.length;i++){
		row = tbody.rows[i];
		for (j=0;j<row.cells.length;j++){
			cell = row.cells[j];
			if (IsCellSelected(cell)){
				if (IsCardItem(cell.firstChild) && cell.firstChild.itemType=='INPUT'){
					cell.firstChild.isRequired = true;
					cell.firstChild.style.borderLeft = '3px solid red';
				}
			}
		}
	}
}

function UnsetRequired()
{
	if (curSelection==null)
		return;
		
	var i,j,row,cell;
	var tbody=curCardTable.tBodies[0];
	var errflds = '';
	for (i=0;i<tbody.rows.length;i++){
		row = tbody.rows[i];
		for (j=0;j<row.cells.length;j++){
			cell = row.cells[j];
			if (IsCellSelected(cell)){
				if (IsCardItem(cell.firstChild) && cell.firstChild.itemType=='INPUT'){
					if (!cell.firstChild.sysRequired){
						cell.firstChild.isRequired = false;
						cell.firstChild.style.borderLeft = '1px solid #777';
					}else{
						errflds += cell.firstChild.innerHTML+"\n";
					}
				}
			}
		}
	}
	if (errflds!=''){
		alert(errFieldRequired+"\n\n"+errflds);
	}
}

function CellDragStartFunc(evt)
{
	GetWindowEvent(evt);
	var elem = window.event.srcElement;
	if (elem.tagName!="TD")
		return false;

	if (selecting)
		ClearCellSelection();
	selecting = true;
	var r0 = elem.parentNode.rowIndex;
	var c0 = elem.cellIndex;
	curSelection = new CellSelection(r0,c0,r0,c0);
	ExpandCellSelection();
	DrawCellSelection();
}

function CellDropFunc(evt)
{
	GetWindowEvent(evt);
	var elem = window.event.srcElement;
	if (selecting)
		selecting = false;
}

function CellDragFunc(evt)
{
	GetWindowEvent(evt);
	var elem = window.event.srcElement;
	if (elem.tagName!="TD")
		return false;

	if (selecting){
		r1 = elem.parentNode.rowIndex;
		c1 = elem.cellIndex;
		if (r1==curSelection.row1 && c1==curSelection.col1)
			return false;
		curSelection.row1 = r1;
		curSelection.col1 = c1;
		ExpandCellSelection();
		DrawCellSelection();
	}
}

function ItemDragStartFunc(evt)
{
	HideTooltip();
	
	GetWindowEvent(evt);
	var elem = window.event.srcElement;
	if (elem.tagName!="DIV")
		return false;

	elem.onmouseover = null;
	elem.onmouseout = null;
	var pelem = elem.parentNode;
	var pos = Position.getLocation(elem);
	elem.style.position = "absolute";
	Position.setLocation(elem,pos);
	if (IsCardCell(pelem)){
		pelem.style.backgroundColor = cardInputBGColor;
		pelem.bgc = cardInputBGColor;
		
		if (selecting)
			ClearCellSelection();
		selecting=true;
		var r0 = pelem.parentNode.rowIndex;
		var c0 = pelem.cellIndex;
		elem.fromRow = r0;
		elem.fromCol = c0;
		curSelection = new CellSelection(r0,c0,r0,c0);
		 
		ExpandCellSelection();
		DrawCellSelection();
	}
	else{
		elem.fromRow = -1;
		elem.fromCol = -1;
	}
}

function ItemDragFunc(evt)
{
	GetWindowEvent(evt);
	var draggedObj = gblDrag.dragObj;
	
	var y = window.event.clientY+document.body.scrollTop-draggedObj.offsetHeight/2;
	Position.setLocation(draggedObj, new Position.Point(window.event.clientX+document.body.scrollLeft-draggedObj.offsetWidth/2,y));
	if (y+10>document.body.scrollTop+document.body.clientHeight)
		draggedObj.scrollIntoView(false);
	else if (y-10<document.body.scrollTop)
		draggedObj.scrollIntoView(true);
}

var gblElemFromPoint=null;
function elemFromPoint(elem,x,y)
{
	var i,node;
	for (i=0;i<elem.childNodes.length;i++){
		node = elem.childNodes[i];
		if (node.nodeType != Node.TEXT_NODE && node.style.display != 'none' && node.style.position!='absolute'){
			if (PointWithinElement(x,y,node)){
				gblElemFromPoint = node;
				elemFromPoint(node,x,y);
				break;
			}
		}
	}
}

function FindElementFromPoint(x,y)
{
	return $.elementFromPoint(x, y);	
}

(function ($){
  var check=false, isRelative=true;
  $.elementFromPoint = function(x,y)  {
    if(!document.elementFromPoint) return null;
    if(!check)
    {
      var sl;
      if((sl = $(document).scrollTop()) >0)
      {
       isRelative = (document.elementFromPoint(0, sl + $(window).height() -1) == null);
      }
      else if((sl = $(document).scrollLeft()) >0)
      {
       isRelative = (document.elementFromPoint(sl + $(window).width() -1, 0) == null);
      }
      check = (sl>0);
    }
    if(!isRelative)
    {
      x += $(document).scrollLeft();
      y += $(document).scrollTop();
    }
    return document.elementFromPoint(x,y);
  }
})(jQuery);

function ItemDropFunc(evt)
{
	GetWindowEvent(evt);
	var draggedObj = gblDrag.dragObj;

	var elem = window.event.srcElement;
	elem.style.position = "";
	draggedObj.style.visibility = "hidden"; 
	var elem = FindElementFromPoint(window.event.clientX,window.event.clientY);
	if (IsCardItem(elem)){
		elem = elem.parentNode;
	}
	var tbody = curCardTable.tBodies[0];
	if (IsCardCell(elem)){
		var tgt=null;
		//document.body.removeChild(draggedObj);
		$(draggedObj).remove();
		if (draggedObj.itemType=='INPUT' && elem.cellIndex>1){
			tgt = elem.parentNode.cells[elem.cellIndex-1];
		}
		if (draggedObj.itemType!='INPUT' && elem.cellIndex<elem.parentNode.cells.length-1){
			tgt = elem.parentNode.cells[elem.cellIndex+1];
		}
		if (tgt==null || tgt!=null && IsCardItem(tgt.firstChild) && tgt.firstChild.fieldName!=draggedObj.fieldName || IsCardItem(elem.firstChild) && elem.firstChild.fieldName!=draggedObj.fieldName){
			if (draggedObj.fromRow>=0){
				var cell = tbody.rows[draggedObj.fromRow].cells[draggedObj.fromCol];
				if (draggedObj.itemType=='LABEL'){
					cell.style.backgroundColor = cardLabelBGColor;
					cell.bgc = cardLabelBGColor;
				}
				cell.innerHTML = '';
				cell.appendChild(draggedObj);
			}
			else{
				ReturnItem2Holder(draggedObj);
			}
			draggedObj.style.position='';
			draggedObj.style.visibility = "visible"; 
			return;
		}

		if (IsCardItem(elem.firstChild))
			ReturnItem2Holder(elem.firstChild);
		if (draggedObj.itemType=='LABEL'){
			elem.style.backgroundColor = cardLabelBGColor;
			elem.bgc = cardLabelBGColor;
		}
		elem.innerHTML = "";
		elem.appendChild(draggedObj);
		draggedObj.style.position = "";
		Position.setLocation(draggedObj,new Position.Point(0,0));
		
		if (tgt!=null && (!IsCardItem(tgt.firstChild) || IsCardItem(tgt.firstChild) && tgt.firstChild.fieldName!=draggedObj.fieldName)){
			var holder;
			var done=false;
			var i,j,row,cell;
			var pearitem;
			if (IsCardItem(tgt.firstChild))
				ReturnItem2Holder(tgt.firstChild);
			if (draggedObj.itemType=='INPUT')
				holder=labelHolder;
			else
				holder=inputHolder;
			for (i=0;i<holder.childNodes.length;i++){
				if (holder.childNodes[i].fieldName==draggedObj.fieldName){
					pearitem = holder.childNodes[i];
					holder.removeChild(pearitem);
					tgt.innerHTML = '';
					if (pearitem.itemType=='LABEL'){
						tgt.style.backgroundColor = cardLabelBGColor;
						tgt.bgc = cardLabelBGColor;
					}
					tgt.appendChild(pearitem);
					pearitem.style.position = "";
					Position.setLocation(pearitem,new Position.Point(0,0));
					done = true;
					break;
				}
			}
			if (!done){
				for (i=1;i<tbody.rows.length;i++){
					row = tbody.rows[i];
					for (j=1;j<row.cells.length;j++){
						cell = row.cells[j];
						if (IsCardItem(cell.firstChild) && cell.firstChild.fieldName==draggedObj.fieldName && cell.firstChild.itemType!=draggedObj.itemType){
							pearitem = cell.firstChild;
							cell.removeChild(pearitem);
							cell.style.backgroundColor = cardInputBGColor;
							cell.bgc = cardInputBGColor;
							cell.innerHTML= '&nbsp;';
							if (pearitem.itemType=='LABEL'){
								tgt.style.backgroundColor = cardLabelBGColor;
								tgt.bgc = cardLabelBGColor;
							}
							tgt.innerHTML = '';
							tgt.appendChild(pearitem);
							done = true;
							break;
						}
					}
					if (done)
						break;
				}
			}
		}
	}
	else{
		//if (isEditing && draggedObj.sysRequired && draggedObj.fromRow>=0){
		if (draggedObj && draggedObj.sysRequired && draggedObj.fromRow>=0){
			//document.body.removeChild(draggedObj);
			var cell = tbody.rows[draggedObj.fromRow].cells[draggedObj.fromCol];
			if (draggedObj.itemType=='LABEL'){
				cell.style.backgroundColor = cardLabelBGColor;
				cell.bgc = cardLabelBGColor;
			}
			cell.innerHTML = '';
			cell.appendChild(draggedObj);
			draggedObj.style.position='';
			draggedObj.style.visibility = "visible"; 
			
			alert(errFieldRequired+"\n\n"+draggedObj.innerHTML);
		}
		else
			ReturnItem2Holder(draggedObj);
	}
	draggedObj.style.visibility = "visible"; 
}

function CheckCardBreak(breakAt)
{
	var i,j;
	var row,cell;
	var tbody = curCardTable.tBodies[0];
	for (i=1;i<tbody.rows.length;i++){
		row = tbody.rows[i];
		for (j=0;j<row.cells.length;j++){
			cell = row.cells[j];
			if (!IsCardCell(cell))
				continue;
			if (cell.logr<breakAt && cell.logr+cell.rowSpan-1>=breakAt){
				return false;
			}
		}
	}
	return true;
}


function CreateCardBuilder(rows,cols, parent_id, tblWidth, tblHeight, borderWidth )
{
	console.log("CreateCardBuilder:");
	var tbl= document.createElement("TABLE");
	curCardTable = tbl;
	tbl.cellSpacing = 0;
	tbl.cellPadding = 0;
	tbl.nRows = rows;
	tbl.nCols = cols;
	tbl.border = 0;
	tbl.style.marginTop = "0";
	tbl.style.tableLayout = "fixed";
	tbl.style.marginBottom = '0px';
	tbl.style.wordWrap = "break-word";
	tbl.style.overflow=  "hidden";
	tbl.style.textOverflow = "ellipsis";
	
	//reset cardLineStyle
	cardLineStyle = borderWidth + 'px solid #ffffff';
	
	// tbl.width =  tblWidth;
	// tbl.height = tblHeight;
	// console.log(tblWidth);
	// console.log(tblHeight);
	
	var tdWidth  = (tblWidth - cols * borderWidth * 2)/cols + "px"; console.log(tdWidth);
	var tdHeight = (tblHeight - rows * borderWidth *2)/rows  + "px"; console.log(tdHeight);

	var i,j;
	var tbody = document.createElement("TBODY");
	
	if(typeof(parent_id) != 'undefined' ) { tbody.id = "cellx"+parent_id; }
	
	tbl.appendChild(tbody);

	for (i=0;i<rows;i++){
		tr = document.createElement("TR");
		tbody.appendChild(tr);	

		for (j=0;j<cols;j++){
			
			td = CreateCardCell(i,j);
			CreateDIVforTD(td);
			
			td.style.tableLlayout= "fixed";
			td.style.borderColor="white";
			td.border= borderWidth + "px";
			td.style.wordWrap = "break-word";
			td.style.overflow=  "hidden";
			td.style.textOverflow = "ellipsis";
			td.style.width = tdWidth;
			td.style.height = tdHeight;

			tr.appendChild(td);
		}
	}
	
	return tbl;
}


/*** 对html 里已经存在的表格改造成可合并和拆分的表格 */
function RestoreCardBuilder(tblWidth, tblHeight, borderWidth)
{ 
	var tbls = document.getElementsByTagName("TABLE"); // 假定只在#editSet 里有一个表格
	var tbl = tbls[0];
	var rows = 0;
	var cols = 0; 
	
	//reset cardLineStyle
	cardLineStyle = borderWidth + 'px solid #ffffff';

	var td =tbl.getElementsByTagName('td');
	for (i = 0; i < td.length; i++) 
	{
		var tid = td[i].id; // id = u3u5
		var arrRC =tid.split("u");  // arrRC = ["0", "3","5"]
		var r = parseInt( arrRC[1] ) ;
		var c = parseInt( arrRC[2] ) ;
		
		//设置td属性，增加自定义项目
		SetCardCell( td[i],  r, c ); 

		//得到表格的真实行列数
		if (rows < r)  rows = r;  
		if (cols < c )  cols = c; 
	}

	// tbl.width =  tblWidth;
	// tbl.height = tblHeight;
	
	curCardTable = tbl;
	tbl.cellSpacing = 0;
	tbl.cellPadding = 0;
	tbl.nRows = rows;
	tbl.nCols = cols;
	tbl.border = 0;
	tbl.style.marginTop = "0";
	tbl.style.tableLayout = "fixed";
	tbl.style.marginBottom = '0px';
	tbl.style.wordWrap = "break-word";
	tbl.style.textOverflow = "ellipsis";

	InitGlobal();	
}



function PointWithinElement(x,y,elem)
{
	var rect = Position.getBounds(elem);
	return (x>=rect.x && x<rect.x+rect.width && y>=rect.y && y<rect.y+rect.height);
}


function isDefined(val){
	return (val!=null && typeof(val)!="undefined");
}
