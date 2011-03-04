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
		var slides=$(context).wrapInner("<div class=\"gSWrapperTwo\"/>").wrapInner("<div class=\"gSWrapperOne\"/>").find(".gSWrapperTwo").children().addClass("gSSlide");
		
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
		$.gS.setSlides(context.find(".gSWrapperTwo"));
	},
//////////////////////////////////////////////////////////////////////////////////////////		
	activate : function (slide) {
		$(slide).parent().find(".active").removeClass("active");
		$(slide).addClass("active");

		if($(slide).parent().find(".deactivated").length > 0) {
			$(slide).parent().find(".deactivated").removeClass("deactivated");
			$.gS.settings.hooks.postDeactivate($(slide));
		}
		$.gS.settings.hooks.preActivate($(slide));
		$.gS.setSlides($(slide).parent());
 	},
//////////////////////////////////////////////////////////////////////////////////////////		
 	deactivate : function (slide) {
		$(slide).parent().find(".active").removeClass("active").addClass("deactivated");
		$.gS.settings.hooks.preDeactivate($(slide));
		$.gS.setSlides($(slide).parent());
 	}, 	
//////////////////////////////////////////////////////////////////////////////////////////		
	getValues : function (context) {
		var slides=$(context).find(".gSSlide");
		var slideCount=slides.length;
		var activeIndex = slides.filter(".gSSlide.active").index();
		var sum={minus:0,plus:0};
		var values=[];
		var mainSize = [];
		mainSize["width"]=$(context).parent().width();
		mainSize["height"]=$(context).parent().height();

//		get new sizes for every slide but the active one.
		for(var index=0; index < slides.length; index++) {
			if(index==activeIndex) continue;
			values[index] = { "width" : slides.eq(index).css("min-width").replace("px",""),"height" : mainSize["height"]};					
			index<activeIndex ? sum.minus+=parseFloat(values[index]["width"]) : sum.plus+=parseFloat(values[index]["width"]);
		}
//		If there is no active one
		if( activeIndex<0) {
//			If slides have to be spread (kwicks)
			if($.gS.settings.fillSpace) for(var index=0; index < slides.length; index++) values[index] = { "width" :mainSize["width"]/slideCount,"height" : mainSize["height"]};
		}
//		If there is an active one
//		handle the active one (on fillSpace).
		else values[activeIndex]= {"width": (mainSize["width"]-(sum.minus+sum.plus)), "height" : mainSize["height"]};

		return values;
	},
//////////////////////////////////////////////////////////////////////////////////////////		
	setSlides : function (context) {
		var slides=$(context).find(".gSSlide");
		var values=$.gS.getValues(context);

//		check if deactivation or activation and sets hooks.
		if($(context).find(".active").length <=0)  var postAnimation = function () {
				if($(this).is(".deactivated")) {
					$.gS.settings.hooks.postDeactivate($(this));
					$(this).removeClass("deactivated");
				}
			}
		else var postAnimation = function () {
				if($(this).is(".active")) $.gS.settings.hooks.postActivate($(this));
			}

//		each slide gets animated			
		for(var index=0; index<slides.length; index++) {
			slides.eq(index).stop().animate(values[index], $.gS.settings.animationSpeed, $.gS.settings.easing, postAnimation); 
		}
	}
//////////////////////////////////////////////////////////////////////////////////////////		
});
})(jQuery);


