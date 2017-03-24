/**
 * author: alex
 * date: ����һ��������ʮ����
 */
 /**
 * author: spq
 * date: ����һ��������ʮ����
 */
$.fn.numberField = function() {

	var isIE8 = !!window && /msie 8\.0/i.test(window.navigator.userAgent.toLowerCase());
	
	var inputNumberReg = /(?:[1-9]\d*|0|)/;
	//var inputNumberReg = /(?:[1-9]\d*\.?\d*|0\.\d*|0|)/;		// ��������еĴ���ֻ��������Ϸ����֣���
	
	var numberValidateReg = /^(?:[1-9]\d*|0|)$/;	// ����У��
	//var numberValidateReg = /^(?:[1-9]\d*(\.\d+)?|0\.\d*|0|)$/;	// С��У��
	
	var tpl = [
		'<span class="numberField">',
			'<a class="minus" href="javascript:;">-</a>',
			'<a class="plus" href="javascript:;">+</a>',
			'<div class="error-tips width-200"></div>',
		'</span>'
	].join('');
	
	function inputFn(opts, tips) {
		
		var minValue = opts.minValue;
		var maxValue = opts.maxValue;
		var maxLength = opts.maxLength;
		
		this.value = this.value.match(new RegExp('^.{1,' + maxLength + '}'));	// ����ʱ���ܳ���maxLengh
		
		this.value = (this.value.match(inputNumberReg) || [])[0];
		var value = this.value * 1;
		if(numberValidateReg.test(value)) {
			$(this).removeClass('error');
			tips.html('').hide();
		} else {
			$(this).addClass('error');
			tips.html('������Ϸ�������').show();
		}
		
		if(minValue === undefined || value >= minValue) {
			$(this).removeClass('error');
			tips.html('').hide();
		} else {
			$(this).addClass('error');
			tips.html('��������ڵ���' + minValue + '������').show();
		}
		if(maxValue === undefined || value <= maxValue) {
			$(this).removeClass('error');
			tips.html('').hide();
		} else {
			$(this).addClass('error');
			tips.html('������С�ڵ���' + maxValue + '������').show();
		}
	}
	
	var defaultConfig = {
		maxValue: 1000,	// ���ڴ�ֵʱ���к����ʾ
		minValue: 0,
		maxLengh: 6,	// ����ʱ���ܳ�����ֵ
		value: 0
	};
	
	
	return function(opt) {
		var me = this;
		
		var config = $.extend({}, defaultConfig, opt);
		
		// ȡ����
		me.each(function(i, inputField) {
			
			var input = $(inputField);
			
			var maxValue = function() {
				if(input.attr('maxValue')) {
					return input.attr('maxValue') * 1;
				} else {
					return typeof config.maxValue == 'function' ? config.maxValue.call(input) * 1 : config.maxValue * 1;
				}
			};
			var minValue = function() {
				if(input.attr('minValue')) {
					return input.attr('minValue') * 1;
				} else {
					return typeof config.minValue == 'function' ? config.minValue.call(input) * 1 : config.minValue * 1;
				}
			};
			
			
			var el = $(tpl);
			input.after(el);
			
			var minus 	= el.find('a.minus');
			minus.after(input);
			
			var plus 	= el.find('a.plus');
			var tips 	= el.find('.error-tips');
			
			input.val(input.val() || config.value);
			input.attr('style', config.style);
			
			el.find('a').click(function() {
				if(parseFloat(input.val()) <= parseFloat(maxValue()) 
					&& parseFloat(input.val()) >= parseFloat(minValue())) {
					el.find('a.plus,a.minus').removeClass('disabled');
				}
			});
			
			minus.click(function() {
				if(parseFloat(input.val()) > parseFloat(minValue())) {
					input.val(parseFloat(input.val() || 0) - 1);
				}
				
				if(parseFloat(input.val()) <= parseFloat(minValue())) {
					//input[0].value = config.minValue;
					$(this).addClass('disabled');
				}
				input.trigger('minus', input, input.val());
			});
			plus.click(function() {
				
				if(parseFloat(input.val()) < parseFloat(maxValue())) {
					input.val(parseFloat(input.val() || 0) + 1);
				}
				
				if(parseFloat(input.val()) >= parseFloat(maxValue())) {
					//input[0].value = config.maxValue;
					$(this).addClass('disabled');
				}
				input.trigger('plus', input, input.val());
			});
			
			input.on('minus plus', function() {
				
				inputFn.call(this, {
					minValue: minValue(),
					maxValue: maxValue(),
					maxLength: config.maxLength || config.maxlength
				}, tips);
				$(this).trigger('update', this, this.value);
			});
			
			input.on(isIE8 ? 'change keyup' : 'input', function() {
				
				inputFn.call(this, {
					minValue: minValue(),
					maxValue: maxValue(),
					maxLength: config.maxLength || config.maxlength
				}, tips);
				$(this).trigger('update', this, this.value);
			});
			

		});
	};
}();