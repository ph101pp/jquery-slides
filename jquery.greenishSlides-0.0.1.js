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
$.fn.greenishSlides = function (options){
	return $(this).each(function () {
		$.gS.init($(this), options);
	});
};
$.gS = $().greenishSlides;
var cssFloat = 
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
			},
			postActivate: function () {
			},
			preDeactivate: function () {
			},
			postDeactivate: function () {
			},
			preActivateAnimation : function (e, css) {
				console.log(e);
				console.log(css);
			},
			preDeactivateAnimation : function (e, css) {
			}
		},
		limits : {
		}
	},
////////////////////////////////////////////////////////////////////////////////
	init : function (context, options) {
////	Extends defaults into options.
		this.options=this.setOpts(options);

////	Sets css and classes
		var slides = $(context).css($.gS.css.context).children().addClass("gSSlide").css($.gS.css.gSSlide);
		if($.gS.options.orientation == "horizontal") {
			slides.addClass("gSHorizontal").css($.gS.css.gSHorizontal);
			$.gS.options.ToL="top";
			$.gS.options.WoH="width";
			$.gS.options.LoT="left";
			$.gS.options.RoB="right";
		}
		else {
			slides.addClass("gSVertical").css($.gS.css.gSVertical);
			$.gS.options.ToL="left";
			$.gS.options.WoH="height";
			$.gS.options.LoT="top";
			$.gS.options.RoB="bottom";
		}
		
////	Set hooks.
		$.each(this.options.hooks,function(name,func) {
			$(context).bind(name, function (e, param1, param2){
				$.proxy(func, e.target)(e, param1, param2);
			});
		});
////	/Set hooks.
////	Keyboard and Swipe events.		
		if($.gS.options.keyEvents) $(document).bind("keydown", function(event) {
			if(event.which == 39 || event.which == 40) $.gS.next(context);
			else if(event.which == 37 || event.which == 38) $.gS.prev(context);
		});
		
		if($.gS.options.swipeEvents && typeof($().swipe)=="function") $(context).swipe({
			threshold: {
				x: $.gS.options.swipeThreshold.x,
				y: $.gS.options.swipeThreshold.y
			},
			swipeLeft: function(){$.gS.next(context)},
			swipeRight: function(){$.gS.prev(context)}
		});
////	/Keyboard and Swipe events.

////	Define hover
		if($.gS.defaults.hover.mouseover!=$.gS.options.hover.mouseover || $.gS.defaults.hover.mouseout!=$.gS.options.hover.mouseout)
			$($.gS.options.handle).live("mouseover mouseout", function(event) {
				var context=$(this);
				if($.gS.defaults.handle!=$.gS.options.handle) context=$(".gSSlide").has($(this));

				event.type == "mouseover" ? $.proxy($.gS.options.hover.mouseover, context)(): $.proxy($.gS.options.hover.mouseout, context)();
			});
			//$.gS.options.hover.mouseover).live("mouseout", $.gS.options.hover.mouseout);

////	Define Activate Event
		$($.gS.options.handle).live($.gS.options.events.activate, function (event){
				$.gS.activate($(this));
		});
////	Define Deactivate Event
		if(!$.gS.options.stayOpen) $($.gS.options.handle).live($.gS.options.events.deactivate, function (event){
				$.gS.deactivate($(this));
		});
////	First Initialisation	
		$(context).find(".active") ? 
		$.gS.activate($(context).find(".active").eq(0).removeClass("active")):
		$.gS.setSlides(context);
	},
////////////////////////////////////////////////////////////////////////////////
	setOpts : function (options) {
////	Extends defaults into options.
		return $.extend(true,{},this.defaults, this.options||{}, options||{});
	},
////////////////////////////////////////////////////////////////////////////////
	activate : function (slide) {
//		console.log("active");
		if($.gS.defaults.handle!=$.gS.options.handle && !$(slide).hasClass("gSSlide")) slide=$(".gSSlide").has($(slide));
		if($(slide).hasClass("active")) return;
		$(slide).siblings().removeClass("active");
		$(slide).addClass("active");

		if($(slide).parent().find(".deactivated").length > 0) {
			$(slide).siblings().removeClass("deactivated");
			$(slide).trigger("postDeactivate"); //hook
		}
		$(slide).trigger("preActivate"); // hook
		$.gS.setSlides($(slide).parent());
 	},
////////////////////////////////////////////////////////////////////////////////
 	deactivate : function (slide) {
		if($.gS.defaults.handle!=$.gS.options.handle) slide=$(".gSSlide").has($(slide));
		if(!$(slide).hasClass("active")) return;
		$(slide).removeClass("active").addClass("deactivated");
		$(slide).trigger("preDeactivate"); // hook
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
		
		if(next < 0) $.gS.options.circle ? 
				next = slides.length+next:
				next = 0;
		else if(next>=slides.length) $.gS.options.circle ? 
				next = next-slides.length: 
				next = slides.length-1;
				
		$.gS.activate(slides.eq(next));
	},
////////////////////////////////////////////////////////////////////////////////
	cssFloat : function (context, value) {
		return parseFloat($(context).css(value).replace("px","")) || undefined;
	},
////////////////////////////////////////////////////////////////////////////////
	getCSS : function (context) {
		var opts=$.gS.options;
		var slides=$(context).children();
		var t={css:{}, slides:{}, ai:slides.filter(".gSSlide.active").index(), cS:$(context)[opts.WoH]()};
//		get minWidth for every slide.
		for(var i=c=0; i < slides.length; i++) {
			t.css[i] = {};
			t.slides[i]=slides.eq(i);
			if(i == t.ai) {
//				If there is an max-width defined for the active element - set it to the new width.
				opts.limits[i] && opts.limits.max? 
					t.max=opts.limits[i].max:
					t.max=opts.limits.max || 0;
				if(t.max > 0) t.css[t.ai][opts.WoH]=t.max;
			}
			else {
				opts.limits[i] && opts.limits[i].min ? 
					t.min=opts.limits[i].min:
					t.min=opts.limits.min || 0;
				c+=t.css[i][opts.WoH]=t.min;
			}
		}
//		if no max-width is set for the active element, it's filling all the space it can get. (everything else stays on min-width)
		if(t.ai>=0 && (!(t.max>0) || t.max>t.cS-c)) 
			t.css[t.ai][opts.WoH] = t.cS-c;
		else {
//				Calculates which size elements have, that are not hitting any max/min limit.
			var fullSize=t.cS;
			var count=slides.length
			var newSize=Math.ceil(fullSize/count);
			var skip=[];
			
			for(var i=0; i < slides.length; i++) 
				if(!skip[i] && (t.css[i][opts.WoH]>newSize || (true&&i==t.ai))){
					skip[i]=true;
					count--;
					fullSize-=t.css[i][opts.WoH];
					newSize=Math.ceil(fullSize/count);
					i=-1;
				}
//				Sets calculated value.
			for(var i=0; i < slides.length; i++) 
				if(!skip[i]) t.css[i][opts.WoH]=newSize;
		}
		for(var i=c=0; i < slides.length; i++) {
			c+=t.css[i][opts.WoH];
			t.alignRoB=(t.slides[t.ai].css(opts.RoB)=="auto" && t.ai==i);
			if(true && i==t.ai && opts.orientation == "horizontal") {
				t.alignRoB ?
					$.gS.positioning(context,  t.slides[i], opts.LoT, true):
					$.gS.positioning(context,  t.slides[i], opts.RoB, true);
				
				t.css[i]["margin-"+opts.LoT]=c-t.css[i][opts.WoH];
				t.css[i]["margin-"+opts.RoB]=t.cS-c;
			}
			else if((i<t.ai) || t.ai<0 || t.alignRoB){
				$.gS.positioning(context,  t.slides[i], opts.LoT);
				t.css[i][opts.LoT]=c-t.css[i][opts.WoH];
			}
			else {
				$.gS.positioning(context, t.slides[i], opts.RoB);
				t.css[i][opts.RoB]=t.cS-c;
			}
		}
		return t.css;
	},
////////////////////////////////////////////////////////////////////////////////
	positioning : function (context, obj, bind, active) {
		var t={p : obj.offset(), "bind":bind, "from": bind==$.gS.options.LoT?$.gS.options.RoB:$.gS.options.LoT, cS:$(context)["inner"+$.gS.options.WoH.charAt(0).toUpperCase() + $.gS.options.WoH.slice(1)](), oS:obj["outer"+$.gS.options.WoH.charAt(0).toUpperCase() + $.gS.options.WoH.slice(1)]()};
		
		if(active) {
			t.css={zIndex:0, position:"relative"};
			t.css[$.gS.options.WoH]="auto";
			t.css["margin-"+$.gS.options.LoT]=t.p[$.gS.options.LoT];
			t.css["margin-"+$.gS.options.RoB]=t.cS-t.p[$.gS.options.LoT]-t.oS;
			t.css[bind]=0;
		}
		else {
			t.css={zIndex:1, position:"absolute"};
			t.css[t.bind]=$.gS.cssFloat(obj,"margin-"+t.bind);
			if(!t.css[t.bind] && !$.gS.cssFloat(obj,"margin-"+t.from)) 
				t.bind==$.gS.options.LoT ? 
					t.css[bind]=t.p[$.gS.options.LoT]:
					t.css[bind]=t.cS-t.p[$.gS.options.LoT]-t.oS;
			t.css[$.gS.options.ToL]=0;
			t.css["margin-"+$.gS.options.LoT]=0;
			t.css["margin-"+$.gS.options.RoB]=0;
			t.css[$.gS.options.WoH]=t.oS;
		}
		t.css[t.from]="auto";
		obj.removeClass(t.from).addClass(t.bind).stop().css(t.css);
	},
////////////////////////////////////////////////////////////////////////////////
	setSlides : function (context, opts) {
		opts=this.setOpts(opts);
		var slides=$(context).find(".gSSlide");
		var css=$.gS.getCSS(context);
		

		var active = $(context).find(".active");
//		check if deactivation or activation and sets hooks.
		if(active.length <=0) {
			$(active).trigger("preDeactivateAnimation", css); // hook
			var postAnimation = function () {
				if($(this).is(".deactivated")) {
					$(this).trigger("postDeactivate"); // hook
					$(this).removeClass("deactivated");
				}
			}
		}
		else {  
			$(active).trigger("preActivateAnimation", css); // hook
			var postAnimation = function () {
				if($(this).is(".active")) {
					$(this).trigger("postActivate"); // hook
					if(true && opts.orientation == "horizontal") 
						$(this).css({width:"auto"});	
				}
			}
		}
//		each slide gets animated			
		for(var i=0; i<=slides.length; i++) 
			$(slides[i]).stop()
			.dequeue("gSpre") // "hook" custom queue that runs befor the animation
			.animate(css[i], {duration:opts.transitionSpeed, easing:opts.easing, complete:postAnimation})
			.dequeue("gSpost"); // "hook" custom queue that runs befor the animation
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


