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
		$(slide).siblings().removeClass("active");
		$(slide).addClass("active");

		if($(slide).parent().find(".deactivated").length > 0) {
			$(slide).siblings().removeClass("deactivated");
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
		var t={minus:0, c:0, cW:$(context).width(), cH:$(context).height(), slides:{}};
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
				
//				If there is an max-width defined for the active element - set it to the new width.
				t.max = parseFloat(t.slides[ai].css("max-width").replace("px",""));
				if(t.max > 0) v[ai].css["width"]=t.max;
			}

//		If fillSpace is Set (kwicks)
		if($.gS.settings.fillSpace) {
//			if no max-width is set for the active element, it's filling all the space it can get. (everything else stays on min-width)
			if(true && ai >= 0 && !(t.max>0)) {
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
		for(var i=0; i < slides.length; i++) {
			t.minus+=v[i].css["width"];
			if(true && i==ai) {
				if(t.minus-t.slides[i].css("width")<t["cW"]-t.minus) $.gS.alignObj(context,  t.slides[i], "left", true);
				else  $.gS.alignObj(context,  t.slides[i], "right", true);
				
				v[i].css["margin-left"]=t.minus-v[i].css["width"];
				v[i].css["margin-right"]=t["cW"]-t.minus;
				v[i].css["width"]="auto";
				v[i].obj=t.slides[i].children();
			}
			else if(t.minus-v[i].css["width"]<t["cW"]-t.minus){
				v[i].css["left"]=t.minus-v[i].css["width"];
				v[i].obj=t.slides[i];
				$.gS.alignObj(context,  t.slides[i], "left");
			}
			else {
				v[i].css["right"]=t["cW"]-t.minus;
				v[i].obj=t.slides[i];
				$.gS.alignObj(context, t.slides[i], "right");
			}
		}
			
		console.log(v);
		return v;
	},
////////////////////////////////////////////////////////////////////////////////
	alignObj : function (context, obj, bind, active) {
		var t={css:{zIndex:1, position:"absolute", top:0}, icss:{"margin-left":0,"margin-right":0, "width":"auto"}, "bind":bind , iO:obj.children(), cW:context.innerWidth(), cH:context.innerHeight(), oW:obj.children().outerWidth(), oH:obj.children().outerHeight()};
		t.bind == "left"? t.from="right": t.from = "left";
		
		
		if(parseFloat(t.iO.css("margin-"+t.bind).replace("px","")) > 0 || parseFloat(t.iO.css("margin-"+t.from).replace("px","")) > 0) {
			if(!active) {
				t.css[t.bind]=parseFloat(t.iO.css("margin-"+t.bind).replace("px",""));
				t.css["width"]=t["oW"];
				t.css.position="absolute";
			}
			else {
				t.icss["margin-left"]=t.iO.css("margin-left");
				t.icss["margin-right"]=t.iO.css("margin-right");
				t.css[bind]=0;
				t.css.zIndex=0;
			}
		}	
		else {
			t.p = obj.offset();
			if(!active) t.bind=="left"? t.css[bind]=t.p.left:t.css[bind]=t["cW"]-t.p.left-t["oW"];
			else {
				t.css[bind]=0;
				t.css.zIndex=0;
				t.css.width="100%";
				t.icss["margin-left"]=t.p.left;
				t.icss["margin-right"] = t["cW"]-t.p.left-t["oW"];
			}
		}		
		t.css[t.from]="auto";
		t.iO.stop().css(t.icss);
		obj.stop().css(t.css);
	},
////////////////////////////////////////////////////////////////////////////////
	setSlides : function (context) {
		var slides=$(context).find(".gSSlide");
		var v=$.gS.getValues(context);
		$.gS.settings.test=0;

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
		 if(($.gS.settings.test++)<=0) for(var i=0; i<slides.length; i++) v[i].obj.stop().animate(v[i].css, $.gS.settings.animationSpeed, $.gS.settings.easing, postAnimation); 
	},
	
	stop : function () {
		var slides=$(".gSSlide");
		for(var i=0; i<slides.length; i++) $(slides[i]).stop().children().stop(); 

	},	
////////////////////////////////////////////////////////////////////////////////
	css :{
		gSSlide : {
			position:"absolute",
			marginTop:0,
			marginBottom:"-100%"
		},
		gSHorizontal:{},
		gSVertical:{}
	}
});
})(jQuery);


