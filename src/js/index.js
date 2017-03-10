
$.fn.numberField = function() {

	var isIE8 = !!window && /msie 8\.0/i.test(window.navigator.userAgent.toLowerCase());
	
	var inputNumberReg = /(?:[1-9]\d*|0|)/;		// 输入过程中的处理，只允许输入合法数字，点
	//var inputNumberReg = /(?:[1-9]\d*\.?\d*|0\.\d*|0|)/;		// 输入过程中的处理，只允许输入合法数字，点
	
	var numberValidateReg = /^(?:[1-9]\d*|0|)$/;	// 整数校验
	//var numberValidateReg = /^(?:[1-9]\d*(\.\d+)?|0\.\d*|0|)$/;	// 小数校验
	
	var tpl = [
		'<span class="numberField">',
			'<a class="minus" href="javascript:;">-</a>',
			'<input value=0 style="width: 200px" />',
			'<a class="plus" href="javascript:;">+</a>',
		'</span>'
	].join('');
	
	function inputFn(e) {
		this.value = (this.value.match(inputNumberReg) || [])[0];
		if(numberValidateReg.test(this.value)) {
			$(this).removeClass('error');
		} else {
			$(this).addClass('error');
		}
	}
	
	var defaultConfig = {
		maxValue: 10,
		minValue: 1
	};
	
	return function(opt) {
		var me = this;
		
		var config = $.extend(defaultConfig, opt);
		
		// 取属性
		me.each(function(i, dom) {
			var el = $(tpl);
			$(dom).after(el);
			
			var minus 	= el.find('a.minus');
			var input 	= el.find('input');
			var plus 	= el.find('a.plus');
			
			var attrs = dom.attributes;
			
			Array.prototype.forEach.call(attrs, function(a) {
				if(a.nodeName != 'type' || a.nodeValue != 'number') {
					input.attr(a.nodeName, a.nodeValue);
				}
			});
			
			el.find('a').click(function() {
				if(input[0].value <= config.maxValue && input[0].value >= config.minValue) {
					el.find('a.plus,a.minus').css({
						cursor:'pointer',
						backgroundColor: ''
					});
				}
			});
			
			minus.click(function() {
				if(input[0].value <= config.minValue) {
					input[0].value = config.minValue;
					$(this).css({
						cursor:'not-allowed',
						backgroundColor: '#d2cdcd'
					});
				} else {
					input[0].value = parseInt(input[0].value || 0) - 1;
				}
			});
			plus.click(function() {
				if(input[0].value >= config.maxValue) {
					input[0].value = config.maxValue;
					$(this).css({
						cursor:'not-allowed',
						backgroundColor: '#d2cdcd'
					});
				} else {
					input[0].value = parseInt(input[0].value || 0) + 1;
				}
			});
			
			$(dom).remove();
			
			if(isIE8) {
				$(input).on({
					change: inputFn,
					keyup: inputFn
				});
			} else {
				$(input).on('input', inputFn);
			}
		});
		
	}
}();