/*! 

Author {
	Philipp C. Adrian
	www.philippadrian.com
	@gre_nish
}
*/


(function($) {
//////////////////////////////////////////////////////////////////////////////////////////		
$.fn.greenishSlides = function (settings){
	return $(this).each(function (settings) {
		$().greenishSlides.init($(this), settings);
	});
};
$.gS = $().greenishSlides;
$.extend($.gS, {
//////////////////////////////////////////////////////////////////////////////////////////		
	defaults : {
		stayOpen: true,
		fillSpace: true,
		positioningAbsolute: true,
		animationSpeed: "600",
		easing: "swing",
		orientation:"horizontal",
		hooks : {
			preActivate: function (active) {
//				console.log("preActivate");
			},
			postActivate: function (active) {
//				console.log("postActivate");
			},
			preDeactivate: function (active) {
//				console.log("preDeactivate");
			},
			postDeactivate: function (active) {
//				console.log("postDeactivate");
			}
		}
	},
//////////////////////////////////////////////////////////////////////////////////////////		
	init : function (context, settings) {
//		Extends defaults into settings.
		$.gS.settings = $.extend(this.defaults, typeof(options) == "object" ? options :{});

//		Sets wrappers and additional classes
		$(context).wrapInner("<div class=\"gSWrapperTwo\"/>").wrapInner("<div class=\"gSWrapperOne\"/>");
		var slides = $(context).find(".gSWrapperTwo").children().addClass("gSSlide");
/*		
		var slides = $(context).children().addClass("gSSlide");
*/		
		$.gS.settings.orientation == "horizontal" ? slides.addClass("gSHorizontal") : slides.addClass("gSVertical");
		
		$.gS.initSlides(slides);

//		First Initialisation		
		$.gS.setSlides(context);
	},
//////////////////////////////////////////////////////////////////////////////////////////		
	initSlides : function (slides) {
//		Define Activate Event
		slides.bind("mouseover", function (){
			$.gS.activate(this);
		});		
//		Define Deactivate Event
		if(!$.gS.settings.stayOpen) slides.bind("mouseout", function (){
			$.gS.deactivate(this);
		});
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
		$.gS.setSlides($(slide).parent().parent().parent());
 	},
//////////////////////////////////////////////////////////////////////////////////////////		
 	deactivate : function (slide) {
		$(slide).parent().find(".active").removeClass("active").addClass("deactivated");
		$.gS.settings.hooks.preDeactivate($(slide));
		$.gS.setSlides($(slide).parent().parent().parent());
 	}, 	
//////////////////////////////////////////////////////////////////////////////////////////		
	getValues : function (context) {
		var maxSize=false;
		var slides=$(context).find(".gSSlide");
		var slideCount=slides.length;
		var activeIndex = slides.filter(".gSSlide.active").index();
		var sum={minus:0,plus:0,all:0};
		var values=[];
		var mainSize = [];
		mainSize["width"]=$(context).width();
		mainSize["height"]=$(context).height();

//		get minWidth for every slide.
		for(var index=0; index < slides.length; index++) {
			values[index] = { "width" : parseFloat(slides.eq(index).css("min-width").replace("px","")),"height" : mainSize["height"]};					
			sum.all+=values[index]["width"];
		}

//		If there is an max-width defined for the active element - set it to the new width.
		if(parseFloat(slides.eq(activeIndex).css("max-width").replace("px","")) > 0) maxSize=true;
		if(maxSize && activeIndex >= 0) values[activeIndex]["width"]=parseFloat(slides.eq(activeIndex).css("max-width").replace("px",""));

//		If fillSpace is Set (kwicks)
		if($.gS.settings.fillSpace) {
//			if no max-width is set for the active element, it's filling all the space it can get. (everything else stays on min-width)
			if(!maxSize && activeIndex >= 0) values[activeIndex]["width"] = mainSize["width"]-sum.all+values[activeIndex]["width"];
//			figure out which size elements have that are not hitting any max/min limit.
			else {
				var fullSize=mainSize["width"];
				var count=slideCount
				var newSize=fullSize/count;
				var skip=[];
				
				for(var index=0; index < slides.length; index++) 
					if(!skip[index] && (values[index]["width"] > newSize || index == activeIndex)) {
						skip[index]=true;
						count--;
						fullSize-=values[index]["width"];
						newSize=fullSize/count;
						index=-1;
					}
				for(var index=0; index < slides.length; index++) if(!skip[index]) values[index]["width"]=newSize;
			}
		}
		
		if($.gS.settings.positioningAbsolute) {
			for(var index=0; index <= activeIndex; index++) {
				if(values[(index-1)]) {
					values[index]["left"]=sum.minus+=values[(index-1)]["width"];
					slides.eq(index).css("right","");
				}
				else {
					values[index]["left"]=0;
					slides.eq(index).css("right","");
				}
			}
			for(var index=slides.length-1; index > activeIndex; index--) {
				if(values[(index+1)]) {
					values[index]["right"]=sum.plus+=values[(index+1)]["width"];
					slides.eq(index).css("left","");
				}
				else {
					values[index]["right"]=0;
					slides.eq(index).css("left","");
				}
			
			}
			
//			$.extend(values[activeIndex], {"z-index":-1, "margin-left":sum.minus, "margin-right":sum.plus, "left":0});
			
		
		
		}
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


