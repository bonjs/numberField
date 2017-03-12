/**
 * author: spq
 * date: 二○一七年三月十二日
 */
/**
 * author: spq
 * date: 二○一七年三月十二日
 */
$.fn.numberField = function() {

	var isIE8 = !!window && /msie 8\.0/i.test(window.navigator.userAgent.toLowerCase());
	
	var inputNumberReg = /(?:[1-9]\d*|0|)/;		// 输入过程中的处理，只允许输入合法数字，点
	//var inputNumberReg = /(?:[1-9]\d*\.?\d*|0\.\d*|0|)/;		// 输入过程中的处理，只允许输入合法数字，点
	
	var numberValidateReg = /^(?:[1-9]\d*|0|)$/;	// 整数校验
	//var numberValidateReg = /^(?:[1-9]\d*(\.\d+)?|0\.\d*|0|)$/;	// 小数校验
	
	var tpl = [
		'<span class="numberField">',
			'<a class="minus" href="javascript:;">-</a>',
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
		maxValue: 1000,
		minValue: 0,
		value: 0
	};
	
	return function(opt) {
		var me = this;
		
		var config = $.extend({}, defaultConfig, opt);
		
		// 取属性
		me.each(function(i, inputField) {
			
			var input = $(inputField);
			
			var maxValue = function() {
				if(input.attr('maxValue')) {
					return input.attr('maxValue');
				} else {
					return typeof config.maxValue == 'function' ? config.maxValue.call(input) : config.maxValue;
				}
			}();
			var minValue = function() {
				if(input.attr('minValue')) {
					return input.attr('minValue');
				} else {
					return typeof config.minValue == 'function' ? config.minValue.call(input) : config.minValue;
				}
			}();
			
			var el = $(tpl);
			input.after(el);
			
			var minus 	= el.find('a.minus');
			minus.after(input);
			
			var plus 	= el.find('a.plus');
			
			input.val(input.val() || config.value);
			input.attr('style', config.style);
			
			el.find('a').click(function() {
				if(parseFloat(input.val()) <= parseFloat(maxValue) 
					&& parseFloat(input.val()) >= parseFloat(minValue)) {
					el.find('a.plus,a.minus').css({
						cursor:'pointer',
						backgroundColor: ''
					});
				}
			});
			
			minus.click(function() {
				if(parseFloat(input.val()) > parseFloat(minValue)) {
					input.val(parseFloat(input.val() || 0) - 1);
				}
				
				if(parseFloat(input.val()) <= parseFloat(minValue)) {
					//input[0].value = config.minValue;
					$(this).css({
						cursor:'not-allowed',
						backgroundColor: '#d2cdcd'
					});
				}
				input.trigger('minus', input, input.val());
			});
			plus.click(function() {
				
				if(parseFloat(input.val()) < parseFloat(maxValue)) {
					input.val(parseFloat(input.val() || 0) + 1);
				}
				
				if(parseFloat(input.val()) >= parseFloat(maxValue)) {
					//input[0].value = config.maxValue;
					$(this).css({
						cursor:'not-allowed',
						backgroundColor: '#d2cdcd'
					});
				}
				input.trigger('plus', input, input.val());
			});
			
			input.on('minus plus', function() {
				$(this).trigger('update', this, this.value);
			});
			
			input.on(isIE8 ? 'change keyup' : 'input', function() {
				inputFn.call(this);
				$(this).trigger('update', this, this.value);
			});
		});
	};
}();