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
		animationSpeed: "slow",
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
		var css;
//		Extends defaults into settings.
		$.gS.settings = $.extend(this.defaults, typeof(options) == "object" ? options :{});

//		Sets wrappers and additional classes
		$(context).wrapInner("<div class=\"gSWrapperTwo\"/>").wrapInner("<div class=\"gSWrapperOne\"/>");
		var slides = $(context).find(".gSWrapperTwo").children().addClass("gSSlide");

		$.gS.settings.orientation == "horizontal" ? slides.addClass("gSHorizontal") : slides.addClass("gSVertical");
		$.gS.settings.positioningAbsolute ? css = $.gS.css["absolute"] : css = $.gS.css["relative"];

//		Set CSS
		if(typeof(css.gSWrapperOne) == "object") $(context).find(".gSWrapperOne").css(css.gSWrapperOne);
		if(typeof(css.gSWrapperTwo) == "object") $(context).find(".gSWrapperTwo").css(css.gSWrapperTwo);
		if(typeof(css.gSSlide) == "object") $(context).find(".gSSlide").css(css.gSSlide);
		if(typeof(css.gSHorizontal) == "object") $(context).find(".gSHorizontal").css(css.gSHorizontal);
		if(typeof(css.gSVertical) == "object") $(context).find(".gSVertical").css(css.gSVertical);

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
		var slides=$(context).find(".gSSlide");
		var slideCount=slides.length;
		var activeIndex = slides.filter(".gSSlide.active").index();
		var sum={minus:0,plus:0,all:0};
		var values = mainSize = [];
		mainSize["width"]=$(context).width();
		mainSize["height"]=$(context).height();

//		get minWidth for every slide.
		for(var i=0; i < slides.length; i++) {
			values[i] = { "width" : parseFloat(slides.eq(i).css("min-width").replace("px","")),"height" : "50%"};					
			sum.all+=values[i]["width"];
		}

//		If there is an max-width defined for the active element - set it to the new width.
		if(activeIndex >= 0) var maxSize = parseFloat(slides.eq(activeIndex).css("max-width").replace("px",""));
		if(activeIndex >= 0 && maxSize>0) values[activeIndex]["width"]=maxSize;

//		If fillSpace is Set (kwicks)
		if($.gS.settings.fillSpace) {
//			if no max-width is set for the active element, it's filling all the space it can get. (everything else stays on min-width)
			if(activeIndex >= 0 && !(maxSize>0)) values[activeIndex]["width"] = mainSize["width"]-sum.all+values[activeIndex]["width"];
//			figure out which size elements have, that are not hitting any max/min limit.
			else {
				var fullSize=mainSize["width"];
				var count=slideCount
				var newSize=fullSize/count;
				var skip=[];
				
				for(var i=0; i < slides.length; i++) 
					if(!skip[i] && (values[i]["width"] > newSize || i == activeIndex)) {
						skip[i]=true;
						count--;
						fullSize-=values[i]["width"];
						newSize=fullSize/count;
						i=-1;
					}
				for(var i=0; i < slides.length; i++) if(!skip[i]) values[i]["width"]=newSize;
			}
		}
		if($.gS.settings.positioningAbsolute) {
			for(var i=0; i < activeIndex; i++) {
				var slide=slides.eq(i);
				if(values[(i-1)]) {
					values[i]["left"]=sum.minus;
					
					if(parseFloat(slide.css("right").replace("px","")) >= 0) slide.css("left", mainSize["width"]-parseFloat(slide.css("right").replace("px",""))-slide.width());
					else if(parseFloat(slide.css("left").replace("px","")) <= 0) slide.css("left", sum.minus);
				}
				else values[i]["left"]=0;
				sum.minus+=values[i]["width"];
				slide.css({"right":"","z-index":"1","margin-left":0, "margin-right":0});
			}
			for(var i=slides.length-1; i > activeIndex; i--) {
				console.log("after");
				var slide=slides.eq(i);
				if(values[(i+1)]) {
					values[i]["right"]=sum.plus;

					if(parseFloat(slide.css("left").replace("px","")) >= 0) slide.css("right", mainSize["width"]-parseFloat(slide.css("left").replace("px",""))-slide.width());
					else if(parseFloat(slide.css("right").replace("px","")) <= 0)  slide.css("right", sum.plus);
				}
				else values[i]["right"]=0;
				sum.plus+=values[i]["width"];
				slide.css({"left":"","z-index":"1","margin-left":0, "margin-right":0});
			}
			
			if(parseFloat(slides.eq(activeIndex).css("right").replace("px","")) >= 0) $.extend(values[activeIndex], {"z-index":-1, "margin-left":sum.minus, "margin-right":sum.plus, "right":"0px", "left":"auto"});
			else $.extend(values[activeIndex], {"z-index":-1,"margin-left":sum.minus, "margin-right":sum.plus, "left":"0px", "right":"auto"})
		}
		else {
//			Sets Sizes relative for better resizing.. if there is an active slide only that one is set relative.		
			if(activeIndex>=0) values[activeIndex]["width"]=(values[activeIndex]["width"]*50/mainSize["width"])+"%";
			else for(var i=0; i < slides.length; i++) values[i]["width"]=(values[i]["width"]*50/mainSize["width"])+"%";
		}
		
		console.log(values);
		
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
		for(var i=0; i<slides.length; i++) slides.eq(i).stop().animate(values[i], $.gS.settings.animationSpeed, $.gS.settings.easing, postAnimation); 
	},
//////////////////////////////////////////////////////////////////////////////////////////		
	css :{
		relative : {	
			gSSlide : {
				position:"relative"
			},
			gSHorizontal : {
				"float":"left"		
			},
			gSWrapperOne : {
				position:"relative",
				height:"100%",
				width:"100%",
				overflow:"hidden"
			},
			gSWrapperTwo : {
				position:"relative",
				height:"200%",
				width:"200%"
			}
		},
		absolute: {
			gSSlide : {
				position:"absolute"
			},
			gSWrapperOne : {
				position:"relative",
				height:"100%",
				width:"100%"
			},
			gSWrapperTwo : {
				position:"relative",
				height:"100%",
				width:"100%"
			}
		}
	}
});
})(jQuery);


