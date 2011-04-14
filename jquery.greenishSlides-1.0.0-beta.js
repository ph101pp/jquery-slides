/*! 
 * greenishSlides: jQuery Slideshow plugin - v1.0.0 - beta (4/6/2011)
 * http://www.philippadrian.com
 * 
 * Copyright (c) 2011 Philipp C. Adrian
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses. 
 */

(function($) {
////////////////////////////////////////////////////////////////////////////////
$.fn.greenishSlides = function (opts){
	return $(this).each(function () {
		$.gS.init($(this), opts);
	});
};
$.gS = $().greenishSlides;
$.extend($.gS, {

////////////////////////////////////////////////////////////////////////////////
	timer :{},
	timing : function (key, comment, hide) {
		return;
		var timer,time;
		comment=comment||"";
		timer = new Date()
		$.gS.timer[key] = $.gS.timer[key]|| new Date();
				
		time = timer - $.gS.timer[key];
		
		$.gS.timer[key]=timer;
		if(true && !hide) {
			console.log(key+":"+comment+"////////////////////");
			console.log("Time: "+time+"ms");
		}
	},
////////////////////////////////////////////////////////////////////////////////
	defaults : {
		stayOpen: false,
//		fillSpace: true,
		resizable:true,
		vertical:false,
		circle : false,
		transitionSpeed: 400,
		easing: "swing",
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
		hooks : {},
		limits : {},
		active:false,
		activeClass:"active",
//		queue:false
		cache:true
	},
////////////////////////////////////////////////////////////////////////////////
	init : function (context, opts) {
		context=$(context);
////	Extends defaults into opts.
		opts=this.opts=this.setOpts(context,opts);
		$.gS.hook("preInit", context); // hook
		
		var gS=$.gS,
			slides = context.css(gS.css.context).children().addClass("gSSlide").css(gS.css.gSSlide),
			setEvents;
		
		gS.timing("init" , "Start");
		
////	Sets css and classes
		if(opts.vertical) {
			slides.addClass("gSVertical").css(gS.css.gSVertical);
			$.extend(opts, gS.orientation.vertical)
		}
		else {
			slides.addClass("gSHorizontal").css(gS.css.gSHorizontal);
			$.extend(opts, gS.orientation.horizontal)
		}
////	/Sets css and classes
////	Keyboard and Swipe events.		
		if(opts.keyEvents) $(document).bind("keydown", function(e) {
			if(e.which == 39 || e.which == 40) gS.next(context);
			else if(e.which == 37 || e.which == 38) gS.prev(context);
		});
		
		if(opts.swipeEvents && context.swipe) context.swipe({
			threshold: opts.swipeThreshold,
			swipeLeft: function(){gS.next(context)},
			swipeRight: function(){gS.prev(context)}
		});
////	/Keyboard and Swipe events.

////	Define hover
		if(gS.defaults.hover.mouseover!=opts.hover.mouseover || gS.defaults.hover.mouseout!=opts.hover.mouseout)
			$(opts.handle).live("mouseover mouseout", function(event) {
				var context=$(this);
				if(gS.defaults.handle!=opts.handle) context=$(".gSSlide").has(context);

				event.type == "mouseover" ? 
					$.proxy(opts.hover.mouseover, context)(): 
					$.proxy(opts.hover.mouseout, context)();
			});

////	Define deactivation and activation events
		if(opts.handle) (setEvent=function(handle) {
				handle = typeof(handle) == "object" ? 
					handle:
					$(context).find(handle);
	////		Define Activate Event
				$(handle).bind(opts.events.activate, function (e){
					if($(this).hasClass(opts.activeClass)) return;
					gS.activate($(this));
	////			Define Deactivate Event
					if(!opts.stayOpen && opts.handle) {
						$(this).unbind(e);
						$(this).bind(opts.events.deactivate, function (e, justEvents){
							if($(this).has(e.relatedTarget).length >0 || this == e.relatedTarget) return false;
							if(!justEvents) gS.deactivate($(this));
							$(this).unbind(e);
							setEvent($(this));
							return false;
						});
					}
				});
			})(opts.handle);
		else slides.bind((opts.events.activate="gSactivate"), function(e){
				$.gS.activate($(this));
			});
		
////	First Initialisation

		if($("."+opts.activeClass, context).length)
			$("."+opts.activeClass, context).eq(0).removeClass(opts.activeClass).trigger(opts.events.activate);
		else if(opts.active !== false) {
			!isNaN(opts.active) ? 
					slides.eq(opts.active).removeClass(opts.activeClass).trigger(opts.events.activate):
					$(opts.active, context).eq(0).removeClass(opts.activeClass).trigger(opts.events.activate);
		}
		else gS.update(context);
		gS.hook("postInit", context); // hook
		
		gS.timing("init" , "Done");
	},
	
	
////////////////////////////////////////////////////////////////////////////////
	activate : function (slide) {	
		$.gS.timing("activation", "Start", true);
		var gS=$.gS,
			opts=gS.opts,
			deactivated;
		!slide.is(".gSSlide, .gSSlide"+opts.handle)?
			slide=$(".gSSlide").has($(slide)):
			slide=$(slide);

		if(slide.hasClass(opts.activeClass)) return;
		if(!opts.stayOpen && opts.handle) 
			slide.siblings("."+opts.activeClass).trigger(opts.events.deactivate, true);
		slide.siblings("."+opts.activeClass).removeClass(opts.activeClass).addClass("gSdeactivated");
		
		deactivated =slide.siblings(".gSdeactivated");
		if(deactivated.length > 0) {
			deactivated.removeClass("gSdeactivated");
			gS.hook("postDeactivate", slide); // hook
		}
		slide.addClass(opts.activeClass)
		gS.hook("preActivate", slide); // hook

		gS.update(slide.parent());
 	},
////////////////////////////////////////////////////////////////////////////////
 	deactivate : function (slide) {
		var gS=$.gS,
			opts=gS.opts;
		!slide.is(".gSSlide, .gSSlide"+opts.handle)?
			slide=$(".gSSlide").has($(slide)):
			slide=$(slide);

		if(!slide.hasClass(opts.activeClass)) return;
		slide.removeClass(opts.activeClass).addClass("gSdeactivated");
		gS.hook("preDeactivate", slide); // hook
		
		gS.update(slide.parent());
 	}, 	
////////////////////////////////////////////////////////////////////////////////
	prev : function (context, fromSlide) {
		var slideId=$.gS._step(context, -1, fromSlide);
		slideId=$.gS.hook("prev", context, slideId);
		if(slideId!==false) $.gS.activate($(context).children().eq(slideId));
	},
////////////////////////////////////////////////////////////////////////////////
	next : function (context, fromSlide) {
		var slideId=$.gS._step(context, 1, fromSlide);
		slideId=$.gS.hook("next", context, slideId);
		if(slideId!==false) $.gS.activate($(context).children().eq(slideId));
	},
////////////////////////////////////////////////////////////////////////////////
	_step : function (context, number, fromSlide) {
		var gS=$.gS,
			opts=gS.opts,
			slides=$(context).children(),
			next;
		fromSlide=fromSlide || slides.filter(".gSSlide."+opts.activeClass);
		if(!slides.filter(fromSlide).length) return;
		next = $(fromSlide).index()+(parseFloat(number)%slides.length);
		
		if(next < 0) gS.opts.circle ? 
			next = slides.length+next:
			next = 0;
		else if(next>=slides.length) gS.opts.circle ? 
				next = next-slides.length: 
				next = slides.length-1;
				
		return next;
	},
////////////////////////////////////////////////////////////////////////////////
	setOpts : function (context,opts) {
		return $.extend(true,{},this.defaults, this.opts||{}, opts||{});
	},
////////////////////////////////////////////////////////////////////////////////
	hook : function (hook, hookContext, hookParams) {
		if(this.opts.hooks[hook]) 
			return $.proxy(this.opts.hooks[hook], hookContext)(hookParams);
		else return hookParams;
	},
////////////////////////////////////////////////////////////////////////////////
	cssFloat : function (context, value) {
		var mins={"minWidth":true,"min-width":true,"minHeight":true,"min-height":true},
			min=mins[value];
		value=$(context).css(value);
		if(min && value=="0px") return undefined;
		value=parseFloat(value.replace(["px","%"],""));
		return (!isNaN(value) ? value : undefined);
	},
////////////////////////////////////////////////////////////////////////////////
	capitalize : function (word) {
		return word.charAt(0).toUpperCase() + word.slice(1);
	},
////////////////////////////////////////////////////////////////////////////////
	clearCache : function (context) {
		$(context).removeData("cache");
	},
////////////////////////////////////////////////////////////////////////////////
	_getCSS : function (context, data, i, ai) {
		var gS = $.gS,
			opts = gS.opts,
			slide= data[i],
			posAct = slide.obj.hasClass("posAct"),
			alignLoT= ai==i && slide.obj.hasClass(opts.LoT);
		
		slide.css=slide.css||{};
		slide.css[opts.WoH]=data[i].obj[opts.WoH]();
		slide.active=(i==ai?true:false);
		
		if(opts.resizable && slide.active) {
			alignLoT ?
				slide=gS._positioning(context,  slide, opts.LoT, true):
				slide=gS._positioning(context,  slide, opts.RoB, true);
		}
		else if((i<ai) || ai<0 || (slide.active && alignLoT)){
			if(!slide.obj.hasClass(opts.LoT) || posAct) 
				slide=gS._positioning(context,  slide, opts.LoT);

			slide.align=opts.LoT;
			slide.css[opts.LoT]=gS.cssFloat(slide.obj, opts.LoT);
		}
		else {
			if(!slide.obj.hasClass(opts.RoB) || posAct)  
				slide=gS._positioning(context, slide, opts.RoB);
			
			slide.align=opts.RoB;
			slide.css[opts.RoB]=gS.cssFloat(slide.obj, opts.RoB);
		}
		return data;
	},	
////////////////////////////////////////////////////////////////////////////////
	_positioning : function (context, data, bind, active) {
		var gS=$.gS,
			opts=gS.opts,
			p = data.obj.position(),
			from = bind==opts.LoT ? opts.RoB : opts.LoT,
			cS = $(context)["inner"+gS.capitalize(opts.WoH)](),
			oS = data.obj["outer"+gS.capitalize(opts.WoH)](),
			marginLoT="margin-"+opts.LoT,
			marginRoB="margin-"+opts.RoB;

		if(active) {
			css={zIndex:0, position:"relative"};
			css[opts.WoH]="auto";
			data.css[marginLoT]=css[marginLoT]=p[opts.LoT];
			data.css[marginRoB]=css[marginRoB]=cS-p[opts.LoT]-oS;
			css[bind]=0;
			data.obj.addClass("posAct");
			data.align=bind;
		}
		else {
			css={zIndex:1, position:"absolute"};
			css[bind]=gS.cssFloat(data.obj,"margin-"+bind);
			if(!css[bind] && !gS.cssFloat(data.obj,"margin-"+from)) 
				bind==opts.LoT ? 
					css[bind]=p[opts.LoT]:
					css[bind]=cS-p[opts.LoT]-oS;
			css[marginLoT]=0;
			css[marginRoB]=0;
			data.css[opts.WoH]=css[opts.WoH]=oS;
			data.css[bind]=css[bind];
			data.css[from]="auto";
			data.obj.removeClass("posAct");
		}
		css[from]="auto";
		data.obj.removeClass(from).addClass(bind).css(css);



		return data;
	},
////////////////////////////////////////////////////////////////////////////////
	_getLimits : function (context, data, i) {
//		console.log("limits"+i);
		var gS = $.gS,
			opts = gS.opts,
			slide= data[i],
			cssMin = slide.css["min-"+opts.WoH] || gS.cssFloat(slide.obj,"min-"+opts.WoH),
			cssMax = slide.css["max-"+opts.WoH] || gS.cssFloat(slide.obj,"max-"+opts.WoH),
			limits={
				max:!isNaN(cssMax) ? 
					cssMax : 
					opts.limits[i] && !isNaN(opts.limits[i].max) ? 
						opts.limits[i].max :
						!isNaN(opts.limits.max) ? 
							opts.limits.max : 
							undefined,
				
				min:!isNaN(cssMin) ? 
					cssMin :
					opts.limits[i] && !isNaN(opts.limits[i].min) ? 
						opts.limits[i].min :
						!isNaN(opts.limits.min) ? 
							opts.limits.min : 
							undefined,
			};
		return limits;
	},	
////////////////////////////////////////////////////////////////////////////////
	_getDCss : function (context, data, ai) {
		var gS = $.gS,
			opts = gS.opts,
			skip={},
			count=data.length,
			fullSize=cS=$(context)[opts.WoH](),
			newSize,
			hitMax,
			i,c
			dcss={};
//		Calculate Width
		for(i=c=0; slide=data[i]; i++) {
			if(!slide.active) c+=slide.limits.min || 0;
			dcss[i]={};
		}
		if(ai>=0 && (isNaN(data[ai].limits.max) || data[ai].limits.max>cS-c)) 
			for(i=0; i < data.length; i++)  
				i==ai?
					dcss[i][opts.WoH] = cS-c:
					dcss[i][opts.WoH] = data[i].limits.min || 0;
		else {
			newSize=Math.ceil(fullSize/count);
			for(i=0; limit = data[i]; i++) {
				limit=limit.limits;
				hitMax=(limit.max<newSize);
				if(!skip[i] && (limit.min>newSize || hitMax || i==ai)){
					skip[i]=true;
					count--;
					hitMax || i==ai? 
						fullSize-=dcss[i][opts.WoH]=limit.max:
						fullSize-=dcss[i][opts.WoH]=limit.min;
					newSize=Math.ceil(fullSize/count);
					i=-1;
				}
			}
			for(i=0; i < data.length; i++) 
				if(!skip[i]) dcss[i][opts.WoH]=newSize;
		}
		
//		Caculate position.		
		for(i=c=0; slide=data[i]; i++) {
			c+= dcss[i][opts.WoH];

			if(opts.resizable && i==ai) {			
				dcss[i]["margin-"+opts.LoT]= c-dcss[i][opts.WoH];
				dcss[i]["margin-"+opts.RoB]= cS-c;
			}
			else if((i<ai) || ai<0 || (slide.obj.hasClass(opts.LoT) && ai==i))
				dcss[i][opts.LoT]= c-dcss[i][opts.WoH];
			else 
				dcss[i][opts.RoB]= cS-c;
		}
		return dcss;
		
	},
////////////////////////////////////////////////////////////////////////////////
	_getData : function (context) {
		$.gS.timing("update" , "Start",true);
		var gS=$.gS,
			opts=gS.opts,
			slides=$(context).children(),
			active = slides.filter(".gSSlide."+opts.activeClass),
			ai=active.index(),
			i,
			cache=context.data("cache") || {},			
			dcss=cache.dcss || {},
			limits=cache.limits || {},
			data=[];

//		Get Data
		for(i=slides.length-1; i >=0 ; i--) {
			data[i]= data[i] || {
				obj:slides.eq(i),
			};
			
			data=gS._getCSS(context, data, i, ai);
			!opts.cache || !limits[i] ?
				data[i].limits=limits[i]=gS._getLimits(context, data, i):
				data[i].limits=limits[i];
		};

		if(!opts.cache || !dcss[ai]) dcss[ai] = gS._getDCss(context, data, ai);
		
		
		if(opts.cache) {
			cache = {
				dcss:dcss,
				limits:limits
			};
			context.data("cache", cache);	
		}		
		
		return {
			dcss:dcss[ai],
			data:data,
			opts:opts,
			cS: $(context)[opts.WoH]()		
		};
		
	},
////////////////////////////////////////////////////////////////////////////////
	update : function (context, opts) {
		context=$(context).stop();
		var gS=$.gS,
			slides=$(context).children(),
			active,
			ai,
			postAnimation,
			data;
		
		this.opts=opts=opts ?
			gS.setOpts(opts):
			gS.opts;
			
		active = slides.filter(".gSSlide."+opts.activeClass);

//		Get and store Data for the animation function
		data=gS._getData(context);
		context.data("animation", data);	
	
//		Set hooks for either Activation or Deactivation.
		if(active.length <=0) {
			gS.hook("preDeactivateAnimation", active, data); // hook
			postAnimation = function () {
				var deactive=$(this).find(".gSSlide.gSdeactivated");
				if(deactive.length>0) {
					gS.hook("postDeactivate", deactive); // hook
					deactive.removeClass("gSdeactivated");
				}
			}
		}
		else {  
			gS.hook("preActivateAnimation", active, data); // hook
			postAnimation = function () {
				var active=$(this).find(".gSSlide."+opts.activeClass);
				if(active.length>0) {
					gS.hook("postActivate", active); // hook
				}
			}
		}
		
//		Start Animation for Slides		
		context
			.dequeue("gSpreAnimation") // hook: custom queue that runs before the animation
			.css({textIndent:0})
			.animate({textIndent:100}, {duration:opts.transitionSpeed, easing:opts.easing, complete:postAnimation , step:gS.animation})
			.dequeue("gSpostAnimation"); // hook: custom queue that runs after the animation
		
		$.gS.timing("activation" , "done");
	
	},
////////////////////////////////////////////////////////////////////////////////
	animation : function (state, obj) {
		$.gS.timing("step","start",true)
		var info= $(obj.elem).dequeue("gSanimationStep").data("animation"); // hook: custom queue that runs once on every step of the animation (MAKE IT FAST!)
		if(!info) {
			$(this).stop();
			return;
		};
		var	opts=info.opts,
			data=info.data,
			dcss=info.dcss,
			css={},
			slide, k, i,
			ai,
			calc=function(i, key) {
				return Math.round(data[i].css[key]+((dcss[i][key]-data[i].css[key])*(state[i] || state)));
			},
			getPosition = function(i, align) {
				return css[i] ? css[i][align]+css[i][opts.WoH] : 0;
			};
		state/=100;
		
//		Set Position
		for(i=data.length-1; slide=data[i]; i--) {
			css[i]={};
			if(!slide.active) {
				slide.css[slide.align] = slide.css[slide.align] || 0;
				css[i][slide.align]=calc(i, slide.align);
			}
			else ai=i;
		};
//		Set Width to fill up space
		for(i=data.length-1; slide=data[i]; i--) if(!slide.active) {
			k= (slide.align == opts.LoT ? i+1:i-1);
			if(data[k]) !data[k].active? 
				css[i][opts.WoH] = css[k][slide.align]-css[i][slide.align]:
				css[i][opts.WoH] = calc(i,opts.WoH);
			else css[i][opts.WoH]= info.cS-css[i][slide.align];
			
			slide.obj.css(css[i]);		
		}
//		Set Active
		if(css[ai]) {
			if(opts.resizable) {
				css[ai]["margin-"+opts.LoT]=getPosition(ai-1 , opts.LoT);
				css[ai]["margin-"+opts.RoB]=getPosition(ai+1 , opts.RoB);
			}
			else {
				if(data[ai].align == opts.LoT) {
					css[ai][opts.LoT]=getPosition(ai-1 ,opts.LoT);
					css[ai][opts.WoH]=info.cS-css[ai][opts.LoT]-getPosition(ai+1,opts.RoB);
				}
				else {
					css[ai][opts.RoB]=getPosition(ai+1 ,opts.RoB);
					css[ai][opts.WoH]=info.cS-css[ai][opts.RoB]-getPosition(ai-1,opts.LoT);
				}
			}
			data[ai].obj.css(css[ai]);
		}
		$.gS.timing("step","end",true);
	},
////////////////////////////////////////////////////////////////////////////////
	orientation :{
		horizontal :{
			WoH:"width",
			LoT:"left",
			RoB:"right"
		},
		vertical :{
			WoH:"height",
			LoT:"top",
			RoB:"bottom"
		}
	},	
////////////////////////////////////////////////////////////////////////////////
	css :{
		context : {
			zoom:1,
			listStyle:"none",
			margin:0,
			padding:0,
			border:0,
			overflow:"hidden"
		},
		gSSlide : {
			position:"absolute",
			margin:0,
			border:0,
			padding:0,
			display:"block",
			overflow:"hidden",
			textIndent:0
		},
		gSHorizontal:{
			marginBottom:"-100%",
			height:"100%",
			top:0
		},
		gSVertical:{
			marginRight:"-100%",
			width:"100%",
			left:0
		}
	}
});
})(jQuery);


