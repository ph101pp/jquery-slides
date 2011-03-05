/*! 

Authors:  Philipp C. Adrian

*/


(function($) {

$.fn.greenishSlides = function (settings){
	return $(this).each(function (settings) {
		$().greenishSlides.init($(this), settings);
	});
};
$.gS = $().greenishSlides;
$.extend($.gS, {
//////////////////////////////////////////////////////////////////////////////////////////		
	defaults : {
		stayOpen: false,
		fillSpace: true,
		animationSpeed: "600",
		easing: "swing",
		orientation:"horizontal",
		hooks : {
			preActivate: function (active) {
				console.log("preActivate");
			},
			postActivate: function (active) {
				console.log("postActivate");
			},
			preDeactivate: function (active) {
				console.log("preDeactivate");
			},
			postDeactivate: function (active) {
				console.log("postDeactivate");
			}
		}
	},
//////////////////////////////////////////////////////////////////////////////////////////		
	init : function (context, settings) {
//		Extends defaults into settings.
		$.gS.settings = $.extend(this.defaults, typeof(options) == "object" ? options :{});

//		Sets wrappers and additional classes
		$(context).children().wrapAll("<div class=\"gSWrapperOne\"/>").wrapAll("<div class=\"gSWrapperTwo\"/>").wrap("<div class=\"gSSlideWrapper\"/>").addClass("gSSlide");
		var slides=$(context).find(".gSSlideWrapper");
		
		$.gS.settings.orientation == "horizontal" ? slides.addClass("gSHorizontal") : slides.addClass("gSVertical");
		
//		Define Activate Event
		slides.bind("mouseover", function (){
			$.gS.activate(this);
		});		
//		Define Deactivate Event
		if(!$.gS.settings.stayOpen) slides.bind("mouseout", function (){
			$.gS.deactivate(this);
		});
		
//		First Initialisation		
		$.gS.setSlides(context);
	},
//////////////////////////////////////////////////////////////////////////////////////////		
	activate : function (slide) {
		$(slide).parent().find(".active").removeClass("active");
		$(slide).children().addClass("active");

		if($(slide).parent().find(".deactivated").length > 0) {
			$(slide).parent().find(".deactivated").removeClass("deactivated");
			$.gS.settings.hooks.postDeactivate($(slide));
		}
		$.gS.settings.hooks.preActivate($(slide));
		$.gS.setSlides($(slide).parent().parent());
 	},
//////////////////////////////////////////////////////////////////////////////////////////		
 	deactivate : function (slide) {
		$(slide).parent().find(".active").removeClass("active").addClass("deactivated");
		$.gS.settings.hooks.preDeactivate($(slide));
		$.gS.setSlides($(slide).parent().parent());
 	}, 	
//////////////////////////////////////////////////////////////////////////////////////////		
	getValues : function (context) {
		var slides=$(context).find(".gSSlideWrapper");
		var slideCount=slides.length;
		var activeIndex = slides.has(".gSSlide.active").index();
		var sum={minus:0,plus:0};
		var values=[];
		var mainSize = [];
		mainSize["width"]=$(context).width();
		mainSize["height"]=$(context).height();

//		get collapsed sizes for every slide.
		for(var index=0; index < slides.length; index++) {
			values[index] = { "width" : slides.eq(index).children().css("min-width").replace("px",""),"height" : mainSize["height"]};					
			index<activeIndex ? sum.minus+=parseFloat(values[index]["width"]) : sum.plus+=parseFloat(values[index]["width"]);
		}
		
//		If there is no active one
		if( activeIndex<0) {
//			If slides have to be spread (kwicks)
			if($.gS.settings.fillSpace) for(var index=0; index < slides.length; index++) values[index].width=mainSize["width"]/slideCount;
		}
//		If there is an active one
//		handle the active one (on fillSpace).
		else values[activeIndex].width= mainSize["width"]-(sum.minus+sum.plus-values[activeIndex].width);

		return values;
	},
//////////////////////////////////////////////////////////////////////////////////////////		
	setSlides : function (context) {
		var slides=$(context).find(".gSSlideWrapper");
		var values=$.gS.getValues(context);

//		check if deactivation or activation and sets hooks.
		if($(context).find(".active").length <=0)  var postAnimation = function () {
				if($(this).children().is(".deactivated")) {
					$.gS.settings.hooks.postDeactivate($(this));
					$(this).children().removeClass("deactivated");
				}
			}
		else var postAnimation = function () {
				if($(this).children().is(".active")) $.gS.settings.hooks.postActivate($(this));
			}

//		each slide gets animated			
		for(var index=0; index<slides.length; index++) {
			slides.eq(index).stop().animate(values[index], $.gS.settings.animationSpeed, $.gS.settings.easing, postAnimation); 
		}
	}
//////////////////////////////////////////////////////////////////////////////////////////		
});
})(jQuery);


