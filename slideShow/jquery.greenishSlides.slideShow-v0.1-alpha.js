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
$.fn.greenishSlideShow = function (opts){
	var context=$(this),
		that=$().pictureGrid,
		thisContext,
		i,k,
		slides, slide;
		
	if(typeof(opts) === 'object') 
		opts=$.extend(true,{},that.defaults, opts||{});
	else opts=that.defaults;	

	for(i=0; i<context.length; i++) {
		thisContext=$(context[i]).addClass("pictureGrid");
		
		thisContext.greenishSlides($.extend({},opts,{	
			vertical:false,
			handle:"."+opts.classes.pGInner
		}));
		
		slides=$(context[i]).data("greenishSlidesData").slides;
		
		for(k=0; slide=slides[k]; k++) {
			slide.obj.children().eq(0).addClass(opts.classes.pGInner).greenishSlides($.extend({},opts,{
				vertical:true,
				hooks:{
					preActivateEvent:that.preActivate,
					preDeactivateEvent:that.preDeactivate
				}
			}));
		}
	}
};
////////////////////////////////////////////////////////////////////////////////
$.extend($().greenishSlideShow, {
////////////////////////////////////////////////////////////////////////////////
		init : function(context){		
			if($(".gScarousel .carousel-cassette", context).greenishSlides) $(".gScarousel .carousel-cassette",context).greenishSlides({
				stayOpen:true,
				handle:false,
				easing:"easeInOutQuad",
				active:0,
				circle:true,
				resizable:false,
				cache:true,
				hooks: {
					postActivate:cuny.gScarousel.postActivate,
					preInit:cuny.gScarousel.preInit
				}
			});
		},
////////////////////////////////////////////////////////////////////////////////
		postActivate:function () {
			var ai=$(this).index(),
				dots=$(this).closest(".gScarousel").find(".carousel-controls a"),
				dot;
			for(var i=0; i<dots.length; i++) {
				dot=dots.eq(i);
				parseFloat(dot.html()) == ai ?
					dot.addClass("active"):
					dot.removeClass("active");
			}
		},
////////////////////////////////////////////////////////////////////////////////
		preInit: function() {
//			Set Carousel Height.
			var slides=$(this).find(".liLiner").css("position","absolute"),
				height=0,
				slideHeight,
				controls;
			for(var i=(slides.length-1); i>=0; i--) 
				if((slideHeight=slides.eq(i).height()) > height) 
					height=slideHeight;
			$(this).css("height",height);	
//			Set Create controls.
			$(this).before(cuny.gScarousel.controls(slides));
		},
////////////////////////////////////////////////////////////////////////////////
		controls : function (slides) {
			var	controls,
				append;
			controls = $("<div/>").addClass("carousel-controls clearfix");
			append=$("<div/>").addClass("ui-icon carousel-control-item prev").bind("click", function(){
				var context=$(this).closest(".gScarousel").find(".carousel-cassette");
				$.gS.prev(context);
				
			});
			controls.append(append);
			for(var i=0; i<slides.length; i++) {
				append=$("<a/>").addClass("ir ui-icon carousel-control-item slideDot").html(i).bind("click", function(){
					var slide=$(this).closest(".gScarousel").find(".carousel-cassette").children().eq($(this).html());
					$.gS.activate(slide);
				});
				controls.append(append);
			}
			append=$("<div/>").addClass("ui-icon carousel-control-item next").bind("click", function(){
				var context=$(this).closest(".gScarousel").find(".carousel-cassette");
				$.gS.next(context);
				
			});
			controls.append(append);
			return controls;
		}
	}, // end gScarousel
////////////////////////////////////////////////////////////////////////////////
});
})(jQuery);

