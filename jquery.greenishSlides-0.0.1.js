/*! 

Author {
	Philipp C. Adrian
	www.philippadrian.com
	@gre_nish
}
*/


(function($) {
////////////////////////////////////////////////////////////////////////////////
$.fn.greenishSlides = function (settings){
	return $(this).each(function (settings) {
		$().greenishSlides.init($(this), settings);
	});
};
$.gS = $().greenishSlides;
$.extend($.gS, {
////////////////////////////////////////////////////////////////////////////////
	defaults : {
		stayOpen: false,
		fillSpace: true,
		animationSpeed: 400,
		easing: "swing",
		orientation:"horizontal",
		hooks : {
			preActivate: function (active) {
				return true;
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
////////////////////////////////////////////////////////////////////////////////
	init : function (context, options) {
//		Extends defaults into settings.
		$.gS.settings = $.extend(this.defaults, typeof(options) == "object" ? options :{});

//		Sets wrappers and additional classes
		var slides = $(context).css({overflow:"hidden"}).children().addClass("gSSlide").css($.gS.css.gSSlide);
		$.gS.settings.orientation == "horizontal" ? slides.addClass("gSHorizontal").css($.gS.css.gSHorizontal) : slides.addClass("gSVertical").css($.gS.css.gSVertical);

		$.gS.initSlides(slides);

//		First Initialisation		
		$.gS.setSlides(context);
	},
////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////
	activate : function (slide) {
		if($(slide).hasClass("active")) return;
		$(slide).siblings().removeClass("active");
		$(slide).addClass("active");

		if($(slide).parent().find(".deactivated").length > 0) {
			$(slide).siblings().removeClass("deactivated");
			$.gS.settings.hooks.postDeactivate($(slide));
		}
		if(!$.gS.settings.hooks.preActivate($(slide))) return;
		$.gS.setSlides($(slide).parent());
 	},
////////////////////////////////////////////////////////////////////////////////
 	deactivate : function (slide) {
		if(!$(slide).hasClass("active")) return;
		$(slide).removeClass("active").addClass("deactivated");
		$.gS.settings.hooks.preDeactivate($(slide));
		$.gS.setSlides($(slide).parent());
 	}, 	
////////////////////////////////////////////////////////////////////////////////
	getValues : function (context) {
		var slides=$(context).children();
		var t={ai:slides.filter(".gSSlide.active").index(), minus:0, c:0, cW:$(context).width(), cH:$(context).height(), slides:{}};
		var css = [];
//		get minWidth for every slide.
		for(var i=0; i < slides.length; i++) if(i != t.ai) {
				t.slides[i]=slides.eq(i);
				css[i] = { "width" : parseFloat(t.slides[i].css("min-width").replace("px",""))};
				t.c+=css[i]["width"];
			}
			else {
				t.slides[i]=slides.eq(i);
				css[i]={};
				
//				If there is an max-width defined for the active element - set it to the new width.
				t.max = parseFloat(t.slides[t.ai].css("max-width").replace("px",""));
				if(t.max > 0) css[t.ai]["width"]=t.max;
			}

//		If fillSpace is Set (kwicks)
		if($.gS.settings.fillSpace) {
//			if no max-width is set for the active element, it's filling all the space it can get. (everything else stays on min-width)
			if(true && t.ai >= 0 && (!(t.max>0) || t.max>t["cW"]-t.c)) {
				css[t.ai]["width"] = t["cW"]-t.c;
			}
			else {
//				Calculates which size elements have, that are not hitting any max/min limit.
				var fullSize=t["cW"];
				var count=slides.length
				var newSize=Math.ceil(fullSize/count);
				var skip=[];
				
				for(var i=0; i < slides.length; i++) 
					if(!skip[i] && (css[i]["width"] > newSize || (true && i == t.ai))) {
						skip[i]=true;
						count--;
						fullSize-=css[i]["width"];
						newSize=Math.ceil(fullSize/count);
						i=-1;
					}
//				Sets calculated value and takes margins into the equation.
				for(var i=0; i < slides.length; i++) {
					if(!skip[i]) css[i]["width"]=newSize;
				}
			}
		}
		for(var i=0; i < slides.length; i++) {
			t.minus+=css[i]["width"];
			if(true && i==t.ai) {
				if(t.minus-t.slides[i].css("width")<t["cW"]-t.minus) $.gS.position(context,  t.slides[i], "left", true);
				else  $.gS.position(context,  t.slides[i], "right", true);
				
				css[i]["margin-left"]=t.minus-css[i]["width"];
				css[i]["margin-right"]=t["cW"]-t.minus;
				css[i]["width"]="auto";
			}
			else if(t.minus-css[i]["width"]<t["cW"]-t.minus || t.ai<0){
				$.gS.position(context,  t.slides[i], "left");
				css[i]["left"]=t.minus-css[i]["width"];
			}
			else {
				$.gS.position(context, t.slides[i], "right");
				css[i]["right"]=t["cW"]-t.minus;
			}
		}
			
		return css;
	},
////////////////////////////////////////////////////////////////////////////////
	position : function (context, obj, bind, active) {
		var t={p : obj.offset(), "bind":bind, "from": bind=="left"?"right":"left", cW:context.innerWidth(), cH:context.innerHeight(), oW:obj.outerWidth(), oH:obj.outerHeight()};
		
		if(active) {
			t.css={zIndex:0, width: "auto", "margin-left":t.p.left, "margin-right":t["cW"]-t.p.left-t["oW"], position:"static"};
			t.css[bind]=0;
		}
		else {
			t.css={zIndex:1, position:"absolute", top:0, "margin-left":0, "margin-right":0, "width":obj.outerWidth()};
			if(parseFloat(obj.css("margin-"+t.bind).replace("px","")) > 0 || parseFloat(obj.css("margin-"+t.from).replace("px","")) > 0)
				t.css[t.bind]=parseFloat(obj.css("margin-"+t.bind).replace("px",""));
			else t.bind=="left" ? t.css[bind]=t.p.left:t.css[bind]=t["cW"]-t.p.left-t["oW"];
		}
		t.css[t.from]="auto";
		obj.stop().css(t.css);
	},
////////////////////////////////////////////////////////////////////////////////
	setSlides : function (context) {
		var slides=$(context).find(".gSSlide");
		var css=$.gS.getValues(context);

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
		for(var i=0; i<slides.length; i++) $(slides[i]).stop().animate(css[i], $.gS.settings.animationSpeed, $.gS.settings.easing, postAnimation); 
	},
////////////////////////////////////////////////////////////////////////////////
	stop : function () {
		var slides=$(".gSSlide");
		for(var i=0; i<slides.length; i++) $(slides[i]).stop().children().stop(); 

	},	
////////////////////////////////////////////////////////////////////////////////
	css :{
		gSSlide : {
			position:"absolute",
			margin:0,
			display:"block",
		},
		gSHorizontal:{
			marginBottom:"-100%",
			height:"100%"
		},
		gSVertical:{
			marginRight:"-100%",
			width:"100%"
		}
	}
});
})(jQuery);


