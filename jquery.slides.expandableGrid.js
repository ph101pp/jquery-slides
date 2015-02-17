/*! 
 * expandableGrid: Extension for the jQuery Slides plugin
 * http://www.philippadrian.com
 * 
 * Copyright (c) 2011 Philipp C. Adrian
 * MIT License (http://www.opensource.org/licenses/mit-license.php)
 */
 
(function($) {
////////////////////////////////////////////////////////////////////////////////
var expandableGrid = $.fn.expandableGrid = function (method){
	if(typeof $().slides !== "function") throw "Error: jQuery Slides not found! - Expandable Grid requires the jQuery Slides Plugin to work.";
	var context=$(this),
		data, call, args, givenArgs, i, opts;
	if(typeof(method) === 'object' || !method) {
		givenArgs=arguments;
		call="_init";
	}
	else if(expandableGrid[method]) {
		givenArgs=Array.prototype.slice.call(arguments,1);
		call=method;
	}
	else throw "Error: The method \""+method+"\" doesn't exist in jQuery Slides - Expandable Grid";
	
	for(i=0; i<context.length; i++) {
		args=givenArgs;
		data=$(context[i]).data("expandableGridData") || $(context[i]).closest(".expandableGrid").data("expandableGridData");
		if(data && call=="_init") {
			expandableGrid._init(data, method=="_init"?Array.prototype.slice.call(arguments,1):method, true);
			continue;
		}
		data = data || {
			context : $(context[i]),
			callbacks : {}
		}

		if(call=="_init") {
			opts = expandableGrid._extendOpts(data, (method=="_init" ? Array.prototype.slice.call(arguments,1):method));
			args=[data, opts];
		}
		else args=[data].concat(args);
		$(context[i]).data("expandableGridData",data);

//  Call method and catch "callbackReturnedFalse" error from Callback. 
		if(call=="_triggerCallback") return expandableGrid[call].apply(context[i], args);
		else try { 
				expandableGrid[call].apply(context[i], args);
			}
			catch(err){
				if(err!="callbackReturnedFalse") throw err;
			}
	}
	return this;
};
////////////////////////////////////////////////////////////////////////////////
$.extend(expandableGrid, {
////////////////////////////////////////////////////////////////////////////////
	defaults : {
		resizable:true,
		events: {
			activate:"click",
			deactivate:"click"
		},
		classes: {
			pGInner:"pGInner",
			pGActive:"pGActive"
		}
	},
////////////////////////////////////////////////////////////////////////////////
	_init : function(data, opts, update) {
		var slide;
		var that = expandableGrid;
		var context = data.context;

//		binding callbacks to make them available.
		for(callbacks in opts.callbacks) expandableGrid.bindCallback(data,callbacks,opts.callbacks[callbacks]);
		
		if(!update) context.expandableGrid("_triggerCallback","preInit", opts);
		var thisContext=$(context).addClass("expandableGrid");

		opts=data.opts= expandableGrid._extendOpts(data, opts);

		if(!update) context.expandableGrid("_triggerCallback","init", opts);

		thisContext.slides($.extend({},opts,{	
			vertical:false,
			handle:"."+opts.classes.pGInner,
			events : {
				activate :false,
				deactivate : false
			},
			callbacks : {
				postActivate : opts.callbacks.postActivate,
				postDeactivate : opts.callbacks.postDeactivate,
				preUpdate : opts.callbacks.preUpdate,
				postUpdate : opts.callbacks.postUpdate,
				step:opts.callbacks.step,

			}
		}));
		
		var slides=thisContext.data("greenishSlidesData").slides;
		
		for(var k=0; slide=slides[k]; k++) {
			slide.obj.children().eq(0).addClass(opts.classes.pGInner).css(that.css.pGInner).slides($.extend({},opts,{
				vertical:true,
				callbacks:{
					activateEvent:that._preActivate,
					deactivateEvent:that._preDeactivate
				}
			}));
		}
		if(!update) context.slides("_triggerCallback","postInit"); // #CALLBACK
	},
////////////////////////////////////////////////////////////////////////////////
	activate : function(){
		var that = $(this)
		var data = that.closest(".expandableGrid").data("expandableGridData");
		that.slides("activate");
		expandableGrid._preActivate.apply(this, [data]);
	},
////////////////////////////////////////////////////////////////////////////////
	deactivate : function(){
		var that = $(this)
		var data = that.closest(".expandableGrid").data("expandableGridData");
		that.slides("deactivate");
		expandableGrid._preDeactivate.apply(this, [data]);
	},
////////////////////////////////////////////////////////////////////////////////
	_extendOpts : function (data, opts, noDefaults) {
		return noDefaults ? 
			$.extend(true,{}, data.opts||{}, opts||{}):
			$.extend(true,{}, this.defaults, data.opts||{}, opts||{});
	},
////////////////////////////////////////////////////////////////////////////////
	bindCallback : function (data, callback, func) {
		func=typeof(func)=="function"?[func]:func;
		data.callbacks[callback]=data.callbacks[callback]||[];
		for(var key in func) data.callbacks[callback].push(func[key]);
	},
////////////////////////////////////////////////////////////////////////////////
	_triggerCallback : function (data, callback, param) {
		if(!data.callbacks[callback] || data.callbacks[callback].length <= 0) return param;
		for(var key in data.callbacks[callback]) {
			if((param=data.callbacks[callback][key].apply(this, [data,param])) !== false) continue;
			else throw "callbackReturnedFalse";
		}
		return param;
	},
////////////////////////////////////////////////////////////////////////////////
	_preActivate:function(data){
		$(this).expandableGrid("_triggerCallback","preActivate");
		var slide=$(this);
		var ai=slide.index();
		slide.closest(".greenishSlides").parent().slides("activate");
		$("."+data.opts.classes.pGActive).removeClass(data.opts.classes.pGActive);
		slide.addClass(data.opts.classes.pGActive);
		$("."+data.opts.classes.pGInner).each(function(){
			var slide = $(this).children().eq(ai);
			if(!slide.hasClass("active")) slide.slides("activate");
		});
	},
////////////////////////////////////////////////////////////////////////////////
	_preDeactivate:function(data) {
		$(this).expandableGrid("_triggerCallback","preDeactivate");
		$(this).closest(".greenishSlides").parent().slides("deactivate");
		$("."+data.opts.classes.pGActive).removeClass(data.opts.classes.pGActive);
		$("."+data.opts.classes.pGInner).each(function(){
			$(".gsActive",this).slides("deactivate");
		});
	},
////////////////////////////////////////////////////////////////////////////////
	css : {
		pGInner: {
			position:"absolute",
			width:"100%",
			height:"100%",
			margin:"0px",
			padding:"0px"
		}
	}
////////////////////////////////////////////////////////////////////////////////
});
})(jQuery);

