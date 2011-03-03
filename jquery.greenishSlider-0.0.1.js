/*! 

Authors:  Philipp C. Adrian

*/


(function($) {

$.fn.greenishSlides = function (settings){
	return $(this).each(function (settings) {
		$(this).greenishSlides.init($(this), settings);
	});
	
};
$.gS = $().greenishSlides;
$.extend($.gS, {
	defaults : {
		stayOpen: true,
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
		if(!$(context).is("ul")) return "has to be ul";

		$.gS.settings = $.extend(this.defaults, typeof(options) == "object" ? options :{});
		$.gS.settings.slideCount=$(context).find("li").length;
		$(context).data("greenishSlides", $.gS.settings);

		if($.gS.settings.fillSpace) $(context).children().last().addClass("last");
		
//		Define Activate Event
		$(context).find("li").bind("mouseover", function (){
			$(this).parent().find(".active").removeClass("active");
			$(this).addClass("active");

			if($(this).parent().has(".deactivated")) {
				$(this).parent().find(".deactivated").removeClass("deactivated");
				if($.gS.checkHook(context, "postDeactivate")) $.gS.settings.hooks.postDeactivate($(this));
			}
			if($.gS.checkHook(context, "preActivate")) $.gS.settings.hooks.preActivate($(this));
			
			$.gS.setSliders($(this).parent());
		
		});		
//		Define Deactivate Event
		if(!$.gS.settings.stayOpen) $(context).find("li").bind("mouseout", function (){
			$(this).parent().find(".active").removeClass("active").addClass("deactivated");
			if($.gS.checkHook(context, "preDeactivate")) $.gS.settings.hooks.preDeactivate($(this));
			$.gS.setSliders($(this).parent(), $(this));
		});
		
		$(window).resize(function () {
			$.gS.setSliders(context,{animationSpeed:"fast"});
		});
		
//		First Initialisation		
		$.gS.setSliders(context);
		
		return true;

	},
	
	getSettings: function (context, options) {
		$.gS.settings = $(context).data("greenishSlides");
		$.gS.settings.context=context;
		$.gS.settings.mainWidth=$(context).width();
		$.gS.settings.outWidth=Math.ceil($.gS.settings.mainWidth/$.gS.settings.slideCount);
		$.extend($.gS.settings, typeof(options) == "object" ? options :{});
	},
	checkHook : function (context, hook) {
		if($(context) !=  $($.gS.settings.context)) $.gS.getSettings(context);
		if($.gS.settings.hooks && typeof($.gS.settings.hooks[hook]) == "function") return true;
		else return false;
	},
	
	setSliders : function (context, options) {
		$.gS.getSettings(context, options);

//		If there is no active element
		if($(context).find(".active").length <=0) $(context).find("li").each(function(){

//			If space should be filled up or not.			
			if($.gS.settings.fillSpace) var newWidth=$.gS.settings.outWidth;
			else var newWidth=$(context).find("li").css("min-width").replace("px","");

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
			var activeWidth = $.gS.settings.mainWidth-(($.gS.settings.slideCount-1) * $(context).find("li").css("min-width").replace("px",""));
			var activeIndex = $(context).find("li.active").index();
			$(context).find("li").each(function(){
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


