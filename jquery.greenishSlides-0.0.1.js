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
		animationSpeed: 5000,
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
	init : function (context, options) {
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
		var activeIndex = slides.filter(".gSSlide.active").index();
		var t={minus:0, plus:0, all:0, contextWidth:$(context).width(), contextHeight:$(context).height(), slides:{}};
		var values = [];

//		get minWidth for every slide.
		for(var i=0; i < slides.length; i++) if(i != activeIndex) {
				var slide=t.slides[i]=slides.eq(i);
				values[i] = { "width" : parseFloat(slide.css("min-width").replace("px",""))};
				$.gS.settings.positioningAbsolute? t.slides[i].css({"height" : "100%"}) : t.slides[i].css({"height" : "50%"});
				t.all+=values[i]["width"]+slide.outerWidth(true)-slide.innerWidth();
			}
			else {
				t.slides[i]=slides.eq(i);
				values[i]={};
				$.gS.settings.positioningAbsolute? t.slides[i].css({"height" : "100%"}) : t.slides[i].css({"height" : "50%"});
			}

//		If there is an max-width defined for the active element - set it to the new width.
		if(activeIndex >= 0) var maxSize = parseFloat(slides.eq(activeIndex).css("max-width").replace("px",""));
		if(activeIndex >= 0 && maxSize>0) values[activeIndex]["width"]=maxSize;

//		If fillSpace is Set (kwicks)
		if($.gS.settings.fillSpace) {
//			if no max-width is set for the active element, it's filling all the space it can get. (everything else stays on min-width)
			if(true && activeIndex >= 0 && !(maxSize>0)) {
				values[activeIndex]["width"] = t["contextWidth"]-t.all-(t.slides[activeIndex].outerWidth(true)-t.slides[activeIndex].innerWidth());
			}
			else {
//				Calculates which size elements have, that are not hitting any max/min limit.
				var fullSize=t["contextWidth"];
				var count=slides.length
				var newSize=Math.ceil(fullSize/count);
				var skip=[];
				
				for(var i=0; i < slides.length; i++) 
					if(!skip[i] && (values[i]["width"] > newSize || (true && i == activeIndex))) {
						skip[i]=true;
						count--;
						fullSize-=values[i]["width"];
						newSize=Math.ceil(fullSize/count);
						i=-1;
					}
//				Sets calculated value and takes margins into the equation.
				for(var i=0; i < slides.length; i++) {
					if(!skip[i]) values[i]["width"]=newSize;
					values[i]["width"]-=t.slides[i].outerWidth(true)-t.slides[i].innerWidth();
				}
			}
		}
		if($.gS.settings.positioningAbsolute) {
			for(var i=0; i < slides.length; i++) {
					if(i==0 || (i<=activeIndex && !(i == activeIndex && isNaN(parseFloat(t.slides[i].css("left").replace("px","")))))){
						if(true && i==activeIndex) {
							var width=t.minus+t["contextWidth"]-t.minus-values[i]["width"]+t.slides[i].width();
							$.gS.positioning(context,  t.slides[i], "left", true);
							t.slides[i].children().css({"margin-left":t.minus, "margin-right":t["contextWidth"]-t.minus-values[i]["width"] })
							t.slides[i].css({"width":width});
							t.minus+=values[i]["width"];
							values[i]["width"]="100%";	
						}
						else{					
							values[i]["left"]=t.minus;
							$.gS.positioning(context,  t.slides[i], "left");
							t.minus+=values[i]["width"];
						}
					}
					else {
						if(true && i==activeIndex) {
							var width=t.minus+t["contextWidth"]-t.minus-values[i]["width"]+t.slides[i].width();
							$.gS.positioning(context,  t.slides[i], "left", true);
							t.slides[i].children().css({"margin-left":t.minus, "margin-right":t["contextWidth"]-t.minus-values[i]["width"] })
							t.slides[i].css({"width":width});
							t.minus+=values[i]["width"];
							values[i]["width"]="100%";	
						}
						else{					
							t.minus+=values[i]["width"];
							values[i]["right"]=t["contextWidth"]-t.minus;
							$.gS.positioning(context, t.slides[i], "right");
						}
					}
			}
		}
		else {	
//			Sets Sizes relative for better resizing.. if there is an active slide only that one is set relative.		
			if(activeIndex>=0) values[activeIndex]["width"]=(values[activeIndex]["width"]*100/t["contextWidth"])+"%";
			else for(var i=0; i < slides.length; i++) values[i]["width"]=(values[i]["width"]*100/t["contextWidth"])+"%"; //51% to reduce jittering and ensure fill up.
		}
		console.log(values);
		return values;
	},
//////////////////////////////////////////////////////////////////////////////////////////		
	positioning : function (context, obj, bind, active) {
		if(bind == "left") var from="right";
		else var from = "left";
		var css={};
		var icss={};
		var inner = obj.children();
		var t={"contextWidth":context.innerWidth(), "contextHeight":context.innerHeight(), "objWidth":inner.outerWidth(), "objHeight":inner.outerHeight()};

		console.log(bind);
		if(active) {
			var pos= obj.offset();
			css[bind]=0;
			css["z-index"]=0;
			icss["margin-left"]=pos["left"];
			icss["margin-right"] = t["contextWidth"]-pos["left"]-t["objWidth"];
			css["width"]=icss["margin-left"]+icss["margin-right"]+parseFloat(obj.css("width").replace("px",""));
		}
		else {
				console.log(inner.css("width"));

			if(parseFloat(inner.css("margin-"+bind).replace("px","")) > 0 || parseFloat(inner.css("margin-"+from).replace("px","")) > 0) {
				console.log("hallo");
				css[bind] = inner.css("margin-"+bind);
				css["width"]=t["objWidth"];
			}
			else  css[bind]=css[bind]=t["contextWidth"]-parseFloat(obj.css(from).replace("px",""))-t["objWidth"];
			css["z-index"]=1;
			icss["margin-left"]=0;
			icss["margin-right"]=0;
		}
		css[from]="auto";
		inner.css(icss);
		obj.css(css);
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
				position:"relative",
				padding:0
			},
			gSHorizontal : {
				"float":"left",
				marginTop:0,
				marginBottom:0,
				borderTop:0,
				borderBottom:0
			},
			gSVertical : {
				marginLeft:0,
				marginRight:0,
				borderLeft:0,
				borderRight:0
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
				width:"100%",
				overflow:"hidden"
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


