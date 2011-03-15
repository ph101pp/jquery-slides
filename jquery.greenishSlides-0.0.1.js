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
////////////////////////////////////////////////////////////////////////////////
	init : function (context, options) {
//		Extends defaults into settings.
		$.gS.settings = $.extend(this.defaults, typeof(options) == "object" ? options :{});

//		Sets wrappers and additional classes
		var slides = $(context).children().addClass("gSSlide").css($.gS.css.gSSlide);
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
		if($(slide).hasClass(".active")) return;
		$(slide).parent().find(".active").removeClass("active");
		$(slide).addClass("active");

		if($(slide).parent().find(".deactivated").length > 0) {
			$(slide).parent().find(".deactivated").removeClass("deactivated");
			$.gS.settings.hooks.postDeactivate($(slide));
		}
		$.gS.settings.hooks.preActivate($(slide));
		$.gS.setSlides($(slide).parent());
 	},
////////////////////////////////////////////////////////////////////////////////
 	deactivate : function (slide) {
		if(!$(slide).hasClass(".active")) return;
		$(slide).removeClass("active").addClass("deactivated");
		$.gS.settings.hooks.preDeactivate($(slide));
		$.gS.setSlides($(slide).parent());
 	}, 	
////////////////////////////////////////////////////////////////////////////////
	getValues : function (context) {
		var slides=$(context).children();
		var ai = slides.filter(".gSSlide.active").index();
		var t={minus:0, plus:0, c:0, cW:$(context).width(), cH:$(context).height(), slides:{}};
		var v = [];

//		get minWidth for every slide.
		for(var i=0; i < slides.length; i++) if(i != ai) {
				var slide=t.slides[i]=slides.eq(i);
				v[i] = {css:{ "width" : parseFloat(slide.css("min-width").replace("px",""))}};
				t.slides[i].css({"height" : "100%"});
				t.c+=v[i].css["width"]+slide.outerWidth(true)-slide.innerWidth();
			}
			else {
				t.slides[i]=slides.eq(i);
				v[i]={css:{}};
				t.slides[i].css({"height" : "100%"});
			}

//		If there is an max-width defined for the active element - set it to the new width.
		if(ai >= 0) var maxSize = parseFloat(t.slides[ai].css("max-width").replace("px",""));
		if(ai >= 0 && maxSize>0) v[ai].css["width"]=maxSize;

//		If fillSpace is Set (kwicks)
		if($.gS.settings.fillSpace) {
//			if no max-width is set for the active element, it's filling all the space it can get. (everything else stays on min-width)
			if(true && ai >= 0 && !(maxSize>0)) {
				v[ai].css["width"] = t["cW"]-t.c-(t.slides[ai].outerWidth(true)-t.slides[ai].innerWidth());
			}
			else {
//				Calculates which size elements have, that are not hitting any max/min limit.
				var fullSize=t["cW"];
				var count=slides.length
				var newSize=Math.ceil(fullSize/count);
				var skip=[];
				
				for(var i=0; i < slides.length; i++) 
					if(!skip[i] && (v[i].css["width"] > newSize || (true && i == ai))) {
						skip[i]=true;
						count--;
						fullSize-=v[i].css["width"];
						newSize=Math.ceil(fullSize/count);
						i=-1;
					}
//				Sets calculated value and takes margins into the equation.
				for(var i=0; i < slides.length; i++) {
					if(!skip[i]) v[i].css["width"]=newSize;
					v[i].css["width"]-=t.slides[i].outerWidth(true)-t.slides[i].innerWidth();
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
		var t={"cW":context.innerWidth(), "cH":context.innerHeight(), "objWidth":inner.outerWidth(), "objHeight":inner.outerHeight()};

		console.log(bind);
		if(active) {
			var pos= obj.offset();
			css[bind]=0;
			css["z-index"]=0;
			icss["margin-left"]=pos["left"];
			icss["margin-right"] = t["cW"]-pos["left"]-t["objWidth"];
			css["width"]=icss["margin-left"]+icss["margin-right"]+parseFloat(obj.css("width").replace("px",""));
		}
		else {
				console.log(inner.css("width"));

			if(parseFloat(inner.css("margin-"+bind).replace("px","")) > 0 || parseFloat(inner.css("margin-"+from).replace("px","")) > 0) {
				console.log("hallo");
				css[bind] = inner.css("margin-"+bind);
				css["width"]=t["objWidth"];
			}
			else  css[bind]=css[bind]=t["cW"]-parseFloat(obj.css(from).replace("px",""))-t["objWidth"];
			css["z-index"]=1;
			icss["margin-left"]=0;
			icss["margin-right"]=0;
		}
		css[from]="auto";
		inner.css(icss);
		obj.css(css);
	},
////////////////////////////////////////////////////////////////////////////////
	setSlides : function (context) {
		var slides=$(context).find(".gSSlide");
		var v=$.gS.getValues(context);

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
		for(var i=0; i<slides.length; i++) 
			v[i].obj.stop().animate(v[i].css, $.gS.settings.animationSpeed, $.gS.settings.easing, postAnimation); 
	},
////////////////////////////////////////////////////////////////////////////////
	css :{
		gSSlide : {
			position:"absolute"
		},
		gSHorizontal:{},
		gSVertical:{}
	}
});
})(jQuery);


