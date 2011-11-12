/*! 
 * greenishSlides: jQuery Slideshow plugin - v0.2 - beta (5/13/2011)
 * http://www.philippadrian.com
 * 
 * Copyright (c) 2011 Philipp C. Adrian
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses. 
 */
 
 /*
 */
(function($) {
////////////////////////////////////////////////////////////////////////////////
$.fn.pictureGrid = function (opts){
	var context=$(this),
		that=$().pictureGrid,
		thisContext,
		i,k,
		slides, slide, handle;
		
	if(typeof(method) === 'object') 
		opts=$.extend(true,{},that.defaults, opts||{});
	else opts=that.defaults;	
	
	
	for(i=0; i<context.length; i++) {
		thisContext=$(context[i]).addClass("pictureGrid");
		
		thisContext.greenishSlides($.extend({},opts,{	
			vertical:false,
			hasndle:"."+opts.classes.vertical
		}));
		
/* 
		slides=$(context[i]).data("greenishSlidesData").slides;
		
		for(k=0; slide=slides[k]; k++) {
			slide.obj.children().eq(0).addClass(opts.classes.vertical).greenishSlides($.extend({},opts,{
				vertical:true,
				hooks:{
					preActivateEvent:that.preActivate,
					preDeactivateEvent:that.preDeactivate
				}
			}));
		}
 */

		
		

		$("."+opts.classes.vertical, thisContext).greenishSlides($.extend({},opts,{
			vertical:true,
			hooks:{
				preActivateEvent:that.preActivate,
				preDeacjtivateEvent:that.preDeactivate
			}
		}));



	}
};
$.extend($().pictureGrid, {
////////////////////////////////////////////////////////////////////////////////
	defaults : {
		resizable:true,
		events: {
			activate:"click",
			deactivate:"click"
		},
		classes: {
			vertical:"vertical"
		}
	},
	preActivate:function(data){
		console.log("preActivate");
		var slide=$(this);
			ai=slide.index();
		$("."+data.opts.classes.vertical).each(function(){
			var slide = $(this).children().eq(ai);
			if(!slide.hasClass("active")) slide.greenishSlides("activate");
		});
	},
	preDeactivate:function (data) {
		console.log("preDeactivate");
		$("."+data.opts.classes.vertical).each(function(){
			$(".active",this).greenishSlides("deactivate");
		});
	}
////////////////////////////////////////////////////////////////////////////////
});
})(jQuery);

