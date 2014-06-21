var gblTooltipDiv = null;
var gblTipTimeout = null;

function ShowTooltip()
{
	if (gblTooltipDiv)
		gblTooltipDiv.style.visibility = "visible";
	if (gblTipTimeout)
		gblTipTimeout = null;
}
function HideTooltip()
{
	if (gblTipTimeout){
		clearTimeout(gblTipTimeout);
		gblTipTimeout = null;
	}
	if (gblTooltipDiv!=null)
		gblTooltipDiv.style.visibility = "hidden";
}

function GetWindowEvent(evt)
{
	if (!document.all) {
		evt.srcElement = evt.target;
		window.event = evt;
	}
}


function CaptureWindowEvents(){
   	if (document.all) {
		document.documentElement.setCapture();
	}
	else {
		
		window.addEventListener(Event.MOUSEDOWN | Event.MOUSEMOVE | Event.MOUSEUP);
	}    
}
function ReleaseWindowEvents(){
    if (document.all) {
		document.documentElement.releaseCapture();
	}
	else {
		
		window.releaseEvents(Event.MOUSEDOWN|Event.MOUSEMOVE|Event.MOUSEUP);
		window.onmousedown = null;
		window.onmousemove = null;
		window.onmouseup = null;
	}
}
function _startDrag(elem,evt)
{
	GetWindowEvent(evt);
	this.dragObj = elem;
	this.dragType = elem.dragType;
	this.originX = window.event.clientX+document.documentElement.scrollLeft;
	this.originY = window.event.clientY+document.documentElement.scrollTop;
	this.dragging = true;
	this.dragFunc = elem.dragFunc;
	this.dropFunc = elem.dropFunc;

	this.bodySelectStart = document.documentElement.onselectstart;
	document.documentElement.onselectstart = CancelEvent;

}

function _endDrag(elem,evt)
{
	GetWindowEvent(evt);
	this.dragObj = null;
	this.dragType = '';
	this.originX = 0;
	this.originY = 0;
	this.dragging = false;
	this.dragFunc = null;
	this.dropFunc = null;

	document.documentElement.onselectstart = this.bodySelectStart;
	ReleaseWindowEvents();
	this.bodySelectStart = null;
}

function DragControl()
{
	this.dragObj = null;
	this.originX = 0;
	this.originY = 0;
	this.dragType = "";
	this.dragging = false;
	this.dragFunc = null;
	this.dropFunc = null;
	this.bodySelectStart = null;

	this.StartDrag = _startDrag;
	this.EndDrag = _endDrag;
}

function isLeftMouseClick(evt)
{
	if (document.all) {
		return !!evt.button == 1;
	}
	else {
		return !!evt.button == 0;
	}
}
function DefaultMouseDown(evt)
{
	if (gblDrag.dragging || gblMouseStarted) {
		DefaultMouseUp(evt);
		return;
	}
	(gblMouseHandled && DefaultMouseUp(evt));
	gblMouseDownEvent = evt;
	gblMouseStarted = true;

	GetWindowEvent(evt);
	var elem = window.event.srcElement;
	if (elem && elem.dragStartFunc!=null && typeof(elem.dragStartFunc) == "function"){
		$(document).bind('mousemove.'+gblNameSpace, function(e) {
			DefaultMouseMove(e);
		})
		.bind('mouseup.'+gblNameSpace, function(e) {
			DefaultMouseUp(e);
		});
	}
	evt.preventDefault();
	gblMouseHandled = true;
	return true;
}

function DefaultMouseMove(evt)
{
	if ($.browser.msie && !(document.documentMode >= 9) && !evt.button) {
		return DefaultMouseUp(evt);
	}
	if (gblMouseStarted) {
		DefaultStartDrag(evt);
		return evt.preventDefault();
	}
	return ! gblMouseStarted;
}
function DefaultStartDrag(evt) {
	GetWindowEvent(evt);
	var elem = window.event.srcElement;
	if (!gblDrag.dragging && elem && elem.dragStartFunc!=null && typeof(elem.dragStartFunc) == "function"){
		if (! gblDrag.dragging) {
			elem.dragStartFunc(evt);
		}
		gblDrag.StartDrag(elem,evt);
	}
	if (gblDrag.dragObj != null){
		gblDrag.dragging = true;
		gblDrag.dragFunc(evt);
	}
}

function DefaultMouseClick(evt)
{
	return;
}
function DefaultMouseUp(evt)
{
	$(document).unbind('mousemove.'+gblNameSpace).unbind('mouseup.'+gblNameSpace);
	gblMouseStarted = false;
	DefaultMouseStop(evt);
	return false;
}
function DefaultMouseStop(evt) {
	GetWindowEvent(evt);
	if (gblDrag.dragging && gblDrag.dragObj!=null){
		gblDrag.dropFunc(evt);
		gblDrag.EndDrag(gblDrag.dragObj,evt);
	}
	gblMouseHandled  = false;
	gblDrag.dragging = false;
};

function GenericDragStart(evt)
{
	GetWindowEvent(evt);
	var elem = window.event.srcElement;
	var x = window.event.clientX+document.documentElement.scrollLeft;
	var y = window.event.clientY+document.documentElement.scrollTop;
	
	if (document.all){
		this.xoffset = x-elem.style.pixelLeft;
		this.yoffset = y-elem.style.pixelTop;
	}else{
		this.xoffset = x-elem.style.left;
		this.yoffset = y-elem.style.top;
	}
}
function GenericDrag(evt)
{
	GetWindowEvent(evt);
	var elem = gblDrag.dragObj;
	var x = window.event.clientX+document.documentElement.scrollLeft;
	var y = window.event.clientY+document.documentElement.scrollTop;

	setLocation(elem,newPoint(Math.max(0,x-elem.xoffset),Math.max(0,y-elem.yoffset)));
}

function GenericDrop(evt)
{
	return;
}

function CancelEvent(evt)
{
	if (evt.stopPropagation) {
		evt.stopPropagation();
	} else  {
		evt.cancelBubble = true;
	}

	if (document.all){
		window.event.cancelBubble=true;
		evt.cancelBubble 
		window.event.returnValue=false;
		return false;
	}
	else if(evt){
		if (evt.stopPropagation)	evt.stopPropagation();
		if (evt.preventDefault)		evt.preventDefault();
		return false;
	}
}
function InitGlobal()
{

	$(gblElementIds).die('mousedown.'+gblNameSpace).live(
		'mousedown.'+gblNameSpace, function(e){
			if ( e.which == 1 ) //left mouse key
			{	DefaultMouseDown(e); }
	})
	.die('click').live('click', function(evt){
		if ( evt.which == 1 ){ //left mouse key
			GetWindowEvent(evt);
			var elem = window.event.srcElement;
			if (!gblDrag.dragging && elem && elem.dragStartFunc!=null && typeof(elem.dragStartFunc) == "function"){
				if (! gblDrag.dragging) {
					DefaultStartDrag(evt);
					DefaultMouseStop(evt);
				}
			}
		}
	});
	$(document).bind('mouseup.'+gblNameSpace, function(e) {
		if ( e.which == 1 ) //left mouse key
		{	DefaultMouseUp(e); }
	});
}

function resetGlobal() {
	document.documentElement.onmousedown = gblOnElMouseDown;
	document.documentElement.onmousemove = gblOnElMouseMove;
	document.documentElement.onmouseup = gblOnElMouseUp;
}

var gblDrag = new DragControl()
,   gblOnElMouseDown = null
,	gblOnElMouseMove = null
,	gblOnElMouseUp = null
,	gblMouseHandled = false
,	gblMouseStarted = false
,	gblMouseDownEvent = null
,	gblElementIds = "#editSet:visible, #viewSet:visible"
, 	gblNameSpace = 'layoutSet';
