/*! 
 * pictureGrid: Extension for the greenishSlides jQuery plugin - v0.2 - beta (5/13/2011)
 * http://www.philippadrian.com
 * 
 * Copyright (c) 2011 Philipp C. Adrian
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses. 
 */
 
(function($) {
////////////////////////////////////////////////////////////////////////////////
var pG = $.fn.expandableGrid = function (opts){
	var context=$(this),
		that=pG,
		thisContext,
		i,k,
		slides, slide;

	opts= typeof(opts) === 'object' ? 
		$.extend(true,{},that.defaults, opts||{}) :
		that.defaults;	

	for(i=0; i<context.length; i++) {
		thisContext=$(context[i]).addClass("expandableGrid");
		
		thisContext.greenishSlides($.extend({},opts,{	
			vertical:false,
			handle:"."+opts.classes.pGInner
		}));
		
		slides=thisContext.data("greenishSlidesData").slides;
		
		for(k=0; slide=slides[k]; k++) {
			slide.obj.children().eq(0).addClass(opts.classes.pGInner).css(that.css.pGInner).greenishSlides($.extend({},opts,{
				vertical:true,
				callbacks:{
					activateEvent:that.preActivate,
					deactivateEvent:that.preDeactivate
				}
			}));
		}
	}
};
////////////////////////////////////////////////////////////////////////////////
$.extend(pG, {
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
	preActivate:function(data){
		var slide=$(this);
			ai=slide.index();
		$("."+data.opts.classes.pGActive).removeClass(data.opts.classes.pGActive);
		slide.addClass(data.opts.classes.pGActive);
		$("."+data.opts.classes.pGInner).each(function(){
			var slide = $(this).children().eq(ai);
			if(!slide.hasClass("active")) slide.greenishSlides("activate");
		});
	},
////////////////////////////////////////////////////////////////////////////////
	preDeactivate:function(data) {
		$("."+data.opts.classes.pGActive).removeClass(data.opts.classes.pGActive);
		$("."+data.opts.classes.pGInner).each(function(){
			console.log(this);
			$(".gsActive",this).greenishSlides("deactivate");
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

