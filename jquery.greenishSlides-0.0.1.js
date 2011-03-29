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
	return $(this).each(function () {
		$.gS.init($(this), settings);
	});
};
$.gS = $().greenishSlides;
$.extend($.gS, {
////////////////////////////////////////////////////////////////////////////////
	defaults : {
		stayOpen: true,
		fillSpace: true,
		transitionSpeed: 400,
		easing: "swing",
		orientation:"horizontal",
		circle : false,
		handle:".gSSlide",
		events: {
			activate:"click",
			deactivate:"click"
		},
		hover: {
			mouseover:function () {},
			mouseout:function () {}
		},
		keyEvents:true,
		swipeEvents:true,
		swipeThreshold: {
				x: 30,
				y: 10
			},
		hooks : {
			preActivate: function () {
				return true;
//				console.log("preActivate");
			},
			postActivate: function () {
//				console.log("postActivate");
			},
			preDeactivate: function () {
				return true;
//				console.log("preDeactivate");
			},
			postDeactivate: function () {
//				console.log("postDeactivate");
			},
			preActivateAnimation : function (css) {
				return css;
			},
			preDeactivateAnimation : function (css) {
				return css;
			}
		},
		limits : {
			sdaf: {
				selector:"",
				min:200,
				max:200
			}
		
		}
	},
////////////////////////////////////////////////////////////////////////////////
	init : function (context, options) {
////	Extends defaults into settings.
		$.gS.setOptions(options);

////	Sets css and classes
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
////	Keyboard and Swipe events.		
		if($.gS.settings.keyEvents) $(document).bind("keydown", function(event) {
			if(event.which == 39 || event.which == 40) $.gS.next(context);
			else if(event.which == 37 || event.which == 38) $.gS.prev(context);
		});
		
		if($.gS.settings.swipeEvents && typeof($().swipe)=="function") $(context).swipe({
			threshold: {
				x: $.gS.settings.swipeThreshold.x,
				y: $.gS.settings.swipeThreshold.y
			},
			swipeLeft: function(){$.gS.next(context)},
			swipeRight: function(){$.gS.prev(context)}
		});
////	/Keyboard and Swipe events.

////	Define hover
		if($.gS.defaults.hover.mouseover!=$.gS.settings.hover.mouseover || $.gS.defaults.hover.mouseout!=$.gS.settings.hover.mouseout)
			$($.gS.settings.handle).live("mouseover mouseout", function(event) {
				var context=$(this);
				if($.gS.defaults.handle!=$.gS.settings.handle) context=$(".gSSlide").has($(this));

				event.type == "mouseover" ? $.proxy($.gS.settings.hover.mouseover, context)(): $.proxy($.gS.settings.hover.mouseout, context)();
			});
			//$.gS.settings.hover.mouseover).live("mouseout", $.gS.settings.hover.mouseout);

////	Define Activate Event
		$($.gS.settings.handle).live($.gS.settings.events.activate, function (event){
				$.gS.activate($(this));
		});
////	Define Deactivate Event
		if(!$.gS.settings.stayOpen) $($.gS.settings.handle).live($.gS.settings.events.deactivate, function (event){
				$.gS.deactivate($(this));
		});
////	First Initialisation	
		if($(context).find(".active")) $.gS.activate($(context).find(".active").eq(0).removeClass("active"));
		else $.gS.setSlides(context);
	},
////////////////////////////////////////////////////////////////////////////////
	setOptions : function (options) {
////	Extends defaults into settings.
		$.gS.settings = $.extend(true,{},this.defaults, typeof( $.gS.settings) == "object" ?  $.gS.settings :{}, typeof(options) == "object" ? options :{});
	},
////////////////////////////////////////////////////////////////////////////////
	activate : function (slide) {
//		console.log("active");
		if($.gS.defaults.handle!=$.gS.settings.handle && !$(slide).hasClass("gSSlide")) slide=$(".gSSlide").has($(slide));
		if($(slide).hasClass("active")) return;
		if(!$.proxy($.gS.settings.hooks.preActivate, $(slide))()) return;
		$(slide).siblings().removeClass("active");
		$(slide).addClass("active");

		if($(slide).parent().find(".deactivated").length > 0) {
			$(slide).siblings().removeClass("deactivated");
			$.proxy($.gS.settings.hooks.postDeactivate, $(slide))();

		}
		$.gS.setSlides($(slide).parent());
 	},
////////////////////////////////////////////////////////////////////////////////
 	deactivate : function (slide) {
		if($.gS.defaults.handle!=$.gS.settings.handle) slide=$(".gSSlide").has($(slide));
		if(!$(slide).hasClass("active")) return;
		if(!$.proxy($.gS.settings.hooks.preDeactivate, $(slide))()) return;
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
	getCSS : function (context) {
		var slides=$(context).children();
		var t={css:{}, slides:{}, ai:slides.filter(".gSSlide.active").index(), cS:$(context)[$.gS.WoH]()};
//		get minWidth for every slide.
		for(var i=c=0; i < slides.length; i++) {
			t.css[i] = {};
			t.slides[i]=slides.eq(i);
			if(i == t.ai) {
//				If there is an max-width defined for the active element - set it to the new width.
				if($.gS.settings.limits[i] && $.gS.settings.limits[i].max >= 0) t.max=$.gS.settings.limits[i].max;
				else t.max=$.gS.settings.limits.max || 0;
				if(t.max > 0) t.css[t.ai][$.gS.WoH]=t.max;
			}
			else {
				if($.gS.settings.limits[i] && $.gS.settings.limits[i].min >= 0) t.min=$.gS.settings.limits[i].min;
				else t.min=$.gS.settings.limits.min || 0;
				c+=t.css[i][$.gS.WoH]=t.min;
			}
		}
//		if no max-width is set for the active element, it's filling all the space it can get. (everything else stays on min-width)
		if(true && t.ai >= 0 && (!(t.max>0) || t.max>t.cS-c)) {
			t.css[t.ai][$.gS.WoH] = t.cS-c;
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
		for(var i=c=0; i < slides.length; i++) {
			c+=t.css[i][$.gS.WoH];
			if(true && i==t.ai && $.gS.settings.orientation == "horizontal") {
				c-t.css[i][$.gS.WoH]<t.cS-(c-t.css[i][$.gS.WoH]+t.slides[i][$.gS.WoH]()) ?
					$.gS.positioning(context,  t.slides[i], $.gS.LoT, true):
					$.gS.positioning(context,  t.slides[i], $.gS.RoB, true);
				
				t.css[i]["margin-"+$.gS.LoT]=c-t.css[i][$.gS.WoH];
				t.css[i]["margin-"+$.gS.RoB]=t.cS-c;
			}
			else if((i<t.ai) || t.ai<0 || (c-t.css[i][$.gS.WoH]<t.cS-(c-t.css[i][$.gS.WoH]+t.slides[i][$.gS.WoH]()) && t.ai==i) ){
				$.gS.positioning(context,  t.slides[i], $.gS.LoT);
				t.css[i][$.gS.LoT]=c-t.css[i][$.gS.WoH];
			}
			else {
				$.gS.positioning(context, t.slides[i], $.gS.RoB);
				t.css[i][$.gS.RoB]=t.cS-c;
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
			if(parseFloat(obj.css("margin-"+t.bind).replace("px","")) > 0 || parseFloat(obj.css("margin-"+t.from).replace("px","")) > 0) 
				t.css[t.bind]=parseFloat(obj.css("margin-"+t.bind).replace("px",""));
			else t.bind==$.gS.LoT ? t.css[bind]=t.p[$.gS.LoT] : t.css[bind]=t.cS-t.p[$.gS.LoT]-t.oS;
			t.css[$.gS.ToL]=t.css["margin-"+$.gS.LoT]=t.css["margin-"+$.gS.RoB]=0;
			t.css[$.gS.WoH]=t.oS;
		}
		t.css[t.from]="auto";
		obj.removeClass(t.from).addClass(t.bind).stop().css(t.css);
	},
////////////////////////////////////////////////////////////////////////////////
	setSlides : function (context, speed) {
		speed=speed || $.gS.settings.transitionSpeed;
		var slides=$(context).find(".gSSlide");
		var css=$.gS.getCSS(context);
		

		var active = $(context).find(".active");
//		check if deactivation or activation and sets hooks.
		if(active.length <=0) {
			css=$.proxy($.gS.settings.hooks.preDeactivateAnimation, $(active))(css);	
			var postAnimation = function () {
				if($(this).is(".deactivated")) {
					$.proxy($.gS.settings.hooks.postDeactivate, $(this))();
					$(this).removeClass("deactivated");
				}
			}
		}
		else { 
			css=$.proxy($.gS.settings.hooks.preActivateAnimation, $(active))(css);
			var postAnimation = function () {
				if($(this).is(".active")) {
					$.proxy($.gS.settings.hooks.postActivate, $(this))();
					if($.gS.orientation == "horizontal") $(this).css({width:"auto"});	
				}
			}
		}
//		each slide gets animated			
		for(var i=0; i<=slides.length; i++) $(slides[i]).stop().dequeue("gSpre").animate(css[i], { duration:speed, easing:$.gS.settings.easing, complete:postAnimation}).dequeue("gSpost"); 
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


