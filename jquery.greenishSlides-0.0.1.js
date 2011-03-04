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
		fillSpace: true,
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
	
		console.log(slides);
		


		
//		Define Activate Event
		slides.bind("mouseover", function (){
			$(this).parent().find(".active").removeClass("active");
			$(this).addClass("active");

			if($(this).parent().has(".deactivated")) {
				$(this).parent().find(".deactivated").removeClass("deactivated");
				if($.gS.checkHook(context, "postDeactivate")) $.gS.settings.hooks.postDeactivate($(this));
			}
			if($.gS.checkHook(context, "preActivate")) $.gS.settings.hooks.preActivate($(this));
			
			$.gS.setSlides($(this).parent().parent().parent());
		
		});		
//		Define Deactivate Event
		if(!$.gS.settings.stayOpen) slides.bind("mouseout", function (){
			$(this).parent().find(".active").removeClass("active").addClass("deactivated");
			if($.gS.checkHook(context, "preDeactivate")) $.gS.settings.hooks.preDeactivate($(this));
			$.gS.setSlides($(this).parent().parent().parent());
		});
		
		$(window).resize(function () {
			$.gS.setSlides(context);
		});
		
//		First Initialisation		
		$.gS.setSlides(context);
		
		return true;

	},
	
	getSettings: function (context, options) {
		$.gS.settings.context=context;
		$.gS.settings.mainWidth=$(context).width();
		$.gS.settings.minWidth=$(context).find(".gSSlide").css("min-width").replace("px","");
		$.gS.settings.outWidth=Math.ceil($.gS.settings.mainWidth/$.gS.settings.slideCount);
		$.extend($.gS.settings, typeof(options) == "object" ? options :{});
	},
	checkHook : function (context, hook) {
		if($(context) !=  $($.gS.settings.context)) $.gS.getSettings(context);
		if($.gS.settings.hooks && typeof($.gS.settings.hooks[hook]) == "function") return true;
		else return false;
	},
		
	setSlides : function (context, options) {
		$.gS.getSettings(context, options);

//		If there is no active element
		if($(context).find(".active").length <=0) $(context).find(".gSSlide").each(function(){

//			If space should be filled up or not.			
		console.log($.gS.settings.fillSpace);
			if($.gS.settings.fillSpace) var newWidth=$.gS.settings.outWidth;
			else var newWidth=$.gS.settings.minWidth;

			var newLeft=newWidth * ($(this).index());
			
//			Move element to new position
			var postAnimation = function () {
				if($.gS.checkHook(context, "postDeactivate") && $(this).is(".deactivated")) {
					$.gS.settings.hooks.postDeactivate($(this));
					$(this).removeClass("deactivated");
				}
			}
			if($(this).css("position")=="absolute" && !$(this).hasClass("last")) $(this).stop().animate({"width":newWidth,"left":newLeft,}, $.gS.settings.animationSpeed, $.gS.settings.easing, postAnimation); 
			else $(this).stop().animate({"width":newWidth}, $.gS.settings.animationSpeed, $.gS.settings.easing, postAnimation); 

		});
//		If there is an active element: loop through li's and find out the new position for each one.
		else {
			var activeWidth = $.gS.settings.mainWidth-(($.gS.settings.slideCount-1) * $.gS.settings.minWidth);
			var activeIndex = $(context).find(".gSSlide.active").index();
			$(context).find(".gSSlide").each(function(){
//				If this is the active element 
				if($(this).is(".active")) {
					var newWidth = activeWidth;	
					var newLeft = $(this).css("min-width").replace("px","") * $(this).index();
				}
//				If this comes before the active element
				else if($(this).index() < activeIndex) {
					var newWidth = $(this).css("min-width").replace("px","");
					var newLeft = newWidth * $(this).index();
				}
//				If this comes after the active element
				else {
					var newWidth = $(this).css("min-width").replace("px","");
					var newLeft = (newWidth * $(this).index())+activeWidth-$(this).css("min-width").replace("px","");
				}
				
//				Move element to new position
				var postAnimation = function () {
					if($.gS.checkHook(context, "postActivate") && $(this).is(".active")) $.gS.settings.hooks.postActivate($(this));
				}
				if($(this).css("position")=="absolute" && !$(this).hasClass("last")) $(this).stop().animate({"width":newWidth,"left":newLeft,}, $.gS.settings.animationSpeed, $.gS.settings.easing, postAnimation); 
				else $(this).stop().animate({"width":newWidth}, $.gS.settings.animationSpeed, $.gS.settings.easing, postAnimation); 
			});
		
		}
	
	
	}

});
})(jQuery);


