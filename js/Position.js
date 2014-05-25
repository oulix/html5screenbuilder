Position = {
	Point: function(x,y) {
		this.x = x;
		this.y = y;
	},
	Rectangle: function(x, y, w, h) {
		this.x = x;
		this.y = y;
		this.width = w;
		this.height = h;
	},
	getLocation: function(elem) {
		var left = 0;
		var top = 0;
		
		$ele_ofs = $(elem).offset();
		var point = new Position.Point($ele_ofs['left'], $ele_ofs['top']);
		return point;
	},
	setLocation: function(elem, point) {
		if (document.all){
			elem.style.pixelLeft = point.x;
			elem.style.pixelTop = point.y;
		}
		else{
			elem.style.left = point.x+'px';
			elem.style.top = point.y+'px';
		}
	},
	getBounds: function(elem){
		var p = Position.getLocation(elem);
		//var rect = new Position.Rectangle(p.x, p.y, elem.offsetWidth, elem.offsetHeight);
		var rect = new Position.Rectangle(p.x, p.y, $(elem).outerWidth(), $(elem).outerHeight());
		return rect;
	},
	setBounds: function(elem, rect) {
		var x = rect.x;
		var y = rect.y;
		if (document.all){
			elem.style.pixelLeft = x;
			elem.style.pixelTop = y;
			elem.style.pixelWidth = rect.width;
			elem.style.pixelHeight = rect.height;
		}
		else{
			elem.style.left = x + 'px';
			elem.style.top = y + 'px';
			elem.style.width = rect.width + 'px';
			elem.style.height = rect.height + 'px';
		}
	},
	constrainRange: function(x, min, max){
        if (x < min) {
			x = min;
		}
		else if (x > max) {
			x = max;
		}
        return x;
	},
	positionCenter: function(el){
		var thisWindow = $(window);
		var widthspace = (thisWindow.width() - el.width());
        var heightspace = (thisWindow.height() - el.height());
		el.css({
            top: (thisWindow.scrollTop() + heightspace / 2 - 2),
            left: (widthspace / 2 - 2)
        });
	},
    pointWithinElement: function(x, y, elem){
        var rect = Position.getBounds(elem);
        return (x >= rect.x && x < rect.x + rect.width && y >= rect.y && y < rect.y + rect.height);
    },
    rectangleOverlap: function(r1, r2){
        var x1 = (r1.x > r2.x ? r2.x : r1.x);
        var y1 = (r1.y > r2.y ? r2.y : r1.y);
        var x2 = (r1.x + r1.width < r2.x + r2.width ? r2.x + r2.width : r1.x + r1.width);
        var y2 = (r1.y + r1.height < r2.y + r2.height ? r2.y + r2.height : r1.y + r1.height);
        if (x2 - x1 < r1.width + r2.width && y2 - y1 < r1.height + r2.height) {
			return true;
		}
        return false;
    }
};
