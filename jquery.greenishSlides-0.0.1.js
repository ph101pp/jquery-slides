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
	defaults : {
		stayOpen: false,
		fillSpace: false,
		animationSpeed: "slow",
		easing: "swing",
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
		
	init : function (context, settings) {
		$.gS.settings = $.extend(this.defaults, typeof(options) == "object" ? options :{});
		$.gS.settings.slideCount=$(context).children().length;

//		Sets wrappers and additional classes
		var slides=$(context).wrapInner("<div class=\"gSWrapperTwo\"/>").wrapInner("<div class=\"gSWrapperOne\"/>").children().children().children().addClass("gSSlide");
		
//		Define Activate Event
		slides.bind("mouseover", function (){
			$(this).parent().find(".active").removeClass("active");
			$(this).addClass("active");

			if($(this).parent().has(".deactivated")) {
				$(this).parent().find(".deactivated").removeClass("deactivated");
				if($.gS.checkHook(context, "postDeactivate")) $.gS.settings.hooks.postDeactivate($(this));
			}
			if($.gS.checkHook(context, "preActivate")) $.gS.settings.hooks.preActivate($(this));
			
			$.gS.setSlides($(this).parent());
		
		});		
//		Define Deactivate Event
		if(!$.gS.settings.stayOpen) slides.bind("mouseout", function (){
			$(this).parent().find(".active").removeClass("active").addClass("deactivated");
			if($.gS.checkHook(context, "preDeactivate")) $.gS.settings.hooks.preDeactivate($(this));
			$.gS.setSlides($(this).parent());
		});
		
		$(window).resize(function () {
			$.gS.setSlides(context.find(".gSWrapperTwo"));
		});
		
//		First Initialisation		
		$.gS.setSlides(context.find(".gSWrapperTwo"));
		
		return true;

	},
	
	getSettings: function (context, options) {
		$.gS.settings.context=context;
		$.gS.settings.mainWidth=$(context).parent().width();
		$.gS.settings.outWidth=Math.ceil($.gS.settings.mainWidth/$.gS.settings.slideCount);
		$.extend($.gS.settings, typeof(options) == "object" ? options :{});
	},
	checkHook : function (context, hook) {
		if($(context) !=  $($.gS.settings.context)) $.gS.getSettings(context);
		if($.gS.settings.hooks && typeof($.gS.settings.hooks[hook]) == "function") return true;
		else return false;
	},
	
	getValues : function (context) {
		var slides=$(context).find(".gSSlide");
		var activeIndex = slides.filter(".gSSlide.active").index();
		var values=[];
		var all=0;
//		get new widths for every slide but the active one.
		for(var index=0; slides.eq(index).length > 0; index++) {
			if(index==activeIndex) continue;
			
//			If slides have to be spread (kwicks)
			if($.gS.settings.fillSpace && activeIndex<0) values[index] = { "width" : $.gS.settings.outWidth};
			else values[index] = { "width" : slides.eq(index).css("min-width").replace("px","")};

			all+=parseFloat(values[index].width);
		}
//		handle the active one (on fillSpace).
		values[activeIndex]= {"width": ($.gS.settings.mainWidth-all)};
		return values;
	},
		
	setSlides : function (context, options) {
		$.gS.getSettings(context, options);
		var values=$.gS.getValues(context);
		var slides=$(context).find(".gSSlide");

//		check if deactivation or activation and sets hooks.
		if($(context).find(".active").length <=0)  var postAnimation = function () {
				if($.gS.checkHook(context, "postDeactivate") && $(this).is(".deactivated")) {
					$.gS.settings.hooks.postDeactivate($(this));
					$(this).removeClass("deactivated");
				}
			}
		else var postAnimation = function () {
				if($.gS.checkHook(context, "postActivate") && $(this).is(".active")) $.gS.settings.hooks.postActivate($(this));
			}

//		each slide gets animated			
		for(var index=0; slides.eq(index).length > 0; index++) {
			slides.eq(index).stop().animate(values[index], $.gS.settings.animationSpeed, $.gS.settings.easing, postAnimation); 
		}
	
	}

});
})(jQuery);


