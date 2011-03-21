/*! 

Author {
	Philipp C. Adrian
	www.philippadrian.com
	www.greenish.ch
	@gre_nish
}
*/


(function($) {
////////////////////////////////////////////////////////////////////////////////
$.fn.greenishSlides = function (settings){
	return $(this).each(function (settings) {
		$.gS.init($(this), settings);
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
		circle : true,
		handle:  "img",
		activateEvent: "mouseover",
		deactivateEvent: "mouseout",
		hooks : {
			preActivate: function (active) {
				return true;
//				console.log("preActivate");
			},
			postActivate: function (active) {
//				console.log("postActivate");
			},
			preDeactivate: function (active) {
				return true;
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
		var slides = $(context).css($.gS.css.context).children().addClass("gSSlide").css($.gS.css.gSSlide);
		if($.gS.settings.orientation == "horizontal") {
			slides.addClass("gSHorizontal").css($.gS.css.gSHorizontal);
			$.gS.ToL="top";
			$.gS.WoH="width";
			$.gS.LoT="left";
			$.gS.RoB="right";
		}
		else {
			slides.addClass("gSVertical").css($.gS.css.gSVertical);
			$.gS.ToL="left";
			$.gS.WoH="height";
			$.gS.LoT="top";
			$.gS.RoB="bottom";
		}
		
		if($.gS.settings.handle) $.gS.initSlides($(context).find($.gS.settings.handle));
		else $.gS.initSlides(slides);

//		First Initialisation		
		$.gS.setSlides(context);
	},
////////////////////////////////////////////////////////////////////////////////
	initSlides : function (slides) {
//		Define Activate Event
		$(slides).bind($.gS.settings.activateEvent, function (){
			$.gS.activate($(".gSSlide").has($(this)));
		});		
//		Define Deactivate Event
		if(!$.gS.settings.stayOpen) $(slides).bind($.gS.settings.deactivateEvent, function (){
			$.gS.deactivate($(".gSSlide").has($(this)));
		});
	},
////////////////////////////////////////////////////////////////////////////////
	activate : function (slide) {
		if($(slide).hasClass("active")) return;
		if(!$.gS.settings.hooks.preActivate($(slide))) return;
		$(slide).siblings().removeClass("active");
		$(slide).addClass("active");

		if($(slide).parent().find(".deactivated").length > 0) {
			$(slide).siblings().removeClass("deactivated");
			$.gS.settings.hooks.postDeactivate($(slide));
		}
		$.gS.setSlides($(slide).parent());
 	},
////////////////////////////////////////////////////////////////////////////////
 	deactivate : function (slide) {
		if(!$(slide).hasClass("active")) return;
		if(!$.gS.settings.hooks.preDeactivate($(slide))) return;
		$(slide).removeClass("active").addClass("deactivated");
		$.gS.setSlides($(slide).parent());
 	}, 	
////////////////////////////////////////////////////////////////////////////////
	prev : function (context, activeSlide) {
		$.gS.step(context, -1, activeSlide);
	},
////////////////////////////////////////////////////////////////////////////////
	next : function (context, activeSlide) {
		$.gS.step(context, 1, activeSlide);
	},
////////////////////////////////////////////////////////////////////////////////
	step : function (context, number, fromSlide) {
		var slides=$(context).children();
		if(slides.filter($(fromSlide)).length <= 0) fromSlide=slides.filter(".gSSlide.active");
		if(slides.filter(fromSlide).length <= 0) return;
		var next = $(fromSlide).index()+(parseFloat(number)%slides.length);
		
		if($.gS.settings.circle) next >= slides.length ? next = next-slides.length : next < 0 ? next = slides.length+next :true;		
		else next >= slides.length ? next = slides.length-1 : next < 0 ? next = 0 :true;		
				
		$.gS.activate(slides.eq(next));
	},
////////////////////////////////////////////////////////////////////////////////
	getValues : function (context) {
		var slides=$(context).children();
		var t={css:{}, slides:{}, ai:slides.filter(".gSSlide.active").index(), cS:$(context)[$.gS.WoH]()};
//		get minWidth for every slide.
		for(var i=t.c=0; i < slides.length; i++) {
			t.css[i] = {};
			t.slides[i]=slides.eq(i);
			if(i == t.ai) {
//				If there is an max-width defined for the active element - set it to the new width.
				t.max = parseFloat(t.slides[t.ai].css("max-"+$.gS.WoH).replace("px",""));
				if(t.max > 0) t.css[t.ai][$.gS.WoH]=t.max;
			}
			else t.c+=t.css[i][$.gS.WoH]=parseFloat(t.slides[i].css("min-"+$.gS.WoH).replace("px",""));
		}
//		If fillSpace is Set (kwicks)
		if(true || $.gS.settings.fillSpace)
//			if no max-width is set for the active element, it's filling all the space it can get. (everything else stays on min-width)
			if(true && t.ai >= 0 && (!(t.max>0) || t.max>t.cS-t.c)) {
				t.css[t.ai][$.gS.WoH] = t.cS-t.c;
			}
			else {
//				Calculates which size elements have, that are not hitting any max/min limit.
				var fullSize=t.cS;
				var count=slides.length
				var newSize=Math.ceil(fullSize/count);
				var skip=[];
				
				for(var i=0; i < slides.length; i++) 
					if(!skip[i] && (t.css[i][$.gS.WoH] > newSize || (true && i == t.ai))) {
						skip[i]=true;
						count--;
						fullSize-=t.css[i][$.gS.WoH];
						newSize=Math.ceil(fullSize/count);
						i=-1;
					}
//				Sets calculated value.
				for(var i=0; i < slides.length; i++) if(!skip[i]) t.css[i][$.gS.WoH]=newSize;
			}
		for(var i=t.c=0; i < slides.length; i++) {
			t.c+=t.css[i][$.gS.WoH];
			if(true && i==t.ai && $.gS.settings.orientation == "horizontal") {
				if(t.c-t.css[i][$.gS.WoH]<t.cS-(t.c-t.css[i][$.gS.WoH]+t.slides[i][$.gS.WoH]())) $.gS.positioning(context,  t.slides[i], $.gS.LoT, true);
				else  $.gS.positioning(context,  t.slides[i], $.gS.RoB, true);
				
				t.css[i]["margin-"+$.gS.LoT]=t.c-t.css[i][$.gS.WoH];
				t.css[i]["margin-"+$.gS.RoB]=t.cS-t.c;
				t.css[i][$.gS.WoH]="auto";
			}
			else if((i<t.ai) || t.ai<0 || (t.c-t.css[i][$.gS.WoH]<t.cS-(t.c-t.css[i][$.gS.WoH]+t.slides[i][$.gS.WoH]()) && t.ai==i) ){
				$.gS.positioning(context,  t.slides[i], $.gS.LoT);
				t.css[i][$.gS.LoT]=t.c-t.css[i][$.gS.WoH];
			}
			else {
				$.gS.positioning(context, t.slides[i], $.gS.RoB);
				t.css[i][$.gS.RoB]=t.cS-t.c;
			}
		}
		return t.css;
	},
////////////////////////////////////////////////////////////////////////////////
	positioning : function (context, obj, bind, active) {
		var t={p : obj.offset(), "bind":bind, "from": bind==$.gS.LoT?$.gS.RoB:$.gS.LoT, cS:$(context)["inner"+$.gS.WoH.charAt(0).toUpperCase() + $.gS.WoH.slice(1)](), oS:obj["outer"+$.gS.WoH.charAt(0).toUpperCase() + $.gS.WoH.slice(1)]()};
		
		if(active) {
			t.css={zIndex:0, position:"relative"};
			t.css[$.gS.WoH]="auto";
			t.css["margin-"+$.gS.LoT]=t.p[$.gS.LoT];
			t.css["margin-"+$.gS.RoB]=t.cS-t.p[$.gS.LoT]-t.oS;
			t.css[bind]=0;
		}
		else {
			t.css={zIndex:1, position:"absolute"};
			if(parseFloat(obj.css("margin-"+t.bind).replace("px","")) > 0 || parseFloat(obj.css("margin-"+t.from).replace("px","")) > 0) t.css[t.bind]=parseFloat(obj.css("margin-"+t.bind).replace("px",""));
			else t.bind==$.gS.LoT ? t.css[bind]=t.p[$.gS.LoT] : t.css[bind]=t.cS-t.p[$.gS.LoT]-t.oS;
			t.css[$.gS.ToL]=t.css["margin-"+$.gS.LoT]=t.css["margin-"+$.gS.RoB]=0;
			t.css[$.gS.WoH]=t.oS;
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
		context : {
			overflow:"hidden"
		},
		gSSlide : {
			position:"absolute",
			margin:0,
			display:"block",
			overflow:"hidden"
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


