/*! 
 * greenishSlides: jQuery Slideshow plugin - v0.1 - beta (4/6/2011)
 * http://www.philippadrian.com
 * 
 * Copyright (c) 2011 Philipp C. Adrian
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses. 
 */
 
 /*
 greenishSlides(
 
 	activate
 	deactivate
 	next
 	prev
 	setOpts
 
 )
 
 */
;(function($) {
////////////////////////////////////////////////////////////////////////////////
$.fn.greenishSlides = function (opts){
	return $(this).each(function () {
		$.gS._init($(this), opts);
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
		resizable:false,
		vertical:false,
		circle : false,
		transitionSpeed: 400,
		easing: "swing",
		events: {
			activate:"click",
			deactivate:"click"
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
		classes:{
			active:"active",
			vertical:"gSVertical",
			horizontal:"gSHorizontal",
			slide:"gSSlide"
		},
		handle:".gSSlide",
//		queue:false
		cache:true
	},
////////////////////////////////////////////////////////////////////////////////
	_init : function (context, opts) {
		context=$(context);
////	Extends defaults into opts.
		opts=$.gS.opts(context, opts, true);

//		binding hooks to make them available.
		for(hooks in opts.hooks) context.bind(hooks,opts.hooks[hooks]);
		context.trigger("preInit"); // hook
				
		var gS=$.gS,
			slides = context.css(gS.css.context).children().addClass(opts.classes.slide).css(gS.css.gSSlide),
			activateDeactivateEvent=function (e, triggeredSlide) {
				var target=$(e.target);
				target= triggeredSlide ? [target,target] : eventSlide(e);
				console.log(target);
				if((e.type == "focusin" || e.type==opts.events.activate) && target && !target[0].hasClass(opts.classes.active)) {
					target[0].trigger("preActivateEvent");
					gS.activate(target[0]);
				}
				else if(!opts.stayOpen && (e.type == "focusout" || e.type==opts.events.deactivate) && target && target[0].hasClass(opts.classes.active) && target[1].has(e.relatedTarget).length <=0 && target[1] != e.relatedTarget) {
					target[0].trigger("preDeactivateEvent");
					gS.deactivate(target[0]);
				}
			},
			eventSlide= function(e) {
				var target=$(e.target),
					handle=target.is(opts.handle) ? target : $(opts.handle, context).has(target).eq(0),
					slide = handle.hasClass(opts.classes.slide) ? handle : context.children().has(handle);
					return slide.length ? [slide, handle] : false;					
			},
			event;


		
		gS.timing("init" , "Start");
		
////	Sets css and classes
		if(opts.vertical) {
			slides.addClass(opts.classes.vertical).css(gS.css.gSVertical);
			$.extend(opts, gS.orientation.vertical);
		}
		else {
			slides.addClass(opts.classes.horizontal).css(gS.css.gSHorizontal);
			$.extend(opts, gS.orientation.horizontal);
		}
////	/Sets css and classes

////	Keyboard and Swipe events.		
		if(opts.keyEvents) $(document).bind("keydown", function(e) {
			console.log("keyEvent");
			if(e.which == 39 || e.which == 40) gS.next(context);
			else if(e.which == 37 || e.which == 38) gS.prev(context);
		});
		
		if(opts.swipeEvents && context.swipe) context.swipe({
			threshold: opts.swipeThreshold,
			swipeLeft: function(){$.gS.next(context);},
			swipeRight: function(){$.gS.prev(context);}
		});
////	/Keyboard and Swipe events.


////	Activate and Deactivate events
		event=!opts.events.activate ? 
			"":
			opts.events.activate+".gS focusin.gS ";
		event+=!opts.events.deactivate ? 
			"":
			opts.events.deactivate==opts.events.activate? 
				"focusout.gS ":
				opts.events.deactivate+".gS focusout.gS ";
		if(!opts.handle) event=opts.events.activate="gSactivate";
		context.bind(event, activateDeactivateEvent); // focusin for Keyboard accessability;
////	/Activate and Deactivate events

////	First Initialisation

		if($("."+opts.classes.active, context).length)
			$("."+opts.classes.active, context).eq(0).removeClass(opts.classes.active).trigger(opts.events.activate, true);
		else if(opts.active !== false) {
			!isNaN(opts.active) ? 
				slides.eq(opts.active).removeClass(opts.classes.active).trigger(opts.events.activate, true):
				$(opts.active, context).eq(0).removeClass(opts.classes.active).trigger(opts.events.activate, true);
		}
		else gS.update(context);
		context.trigger("postInit"); // hook
		
		gS.timing("init" , "Done");
	},
////////////////////////////////////////////////////////////////////////////////
	activate : function (slide) {
		$.gS.timing("activation", "Start", true);
		var gS=$.gS,
			context=slide.parent(),
			opts=gS.opts(context),
			deactivated;
		!slide.is("."+opts.classes.slide+", ."+opts.classes.slide+opts.handle)?
			slide=$("."+opts.classes.slide).has($(slide)):
			slide=$(slide);

		if(slide.hasClass(opts.classes.active)) return;
		slide.siblings("."+opts.classes.active).removeClass(opts.classes.active).addClass("gSdeactivated");
		
		deactivated =slide.siblings(".gSdeactivated");
		if(deactivated.length > 0) {
			deactivated.removeClass("gSdeactivated");
			slide.trigger("postDeactivate"); // hook
		}
		slide.addClass(opts.classes.active)
		slide.trigger("preActivate"); // hook

		gS.update(slide.parent());
 	},
////////////////////////////////////////////////////////////////////////////////
 	deactivate : function (slide) {
		var gS=$.gS,
			context=slide.parent(),
			opts=this.opts(context);
		!slide.is("."+opts.classes.slide+", ."+opts.classes.slide+opts.handle)?
			slide=$("."+opts.classes.slide).has($(slide)):
			slide=$(slide);

		if(!slide.hasClass(opts.classes.active)) return;
		slide.removeClass(opts.classes.active).addClass("gSdeactivated");
		slide.trigger("preDeactivate"); // hook
		
		gS.update(slide.parent());
 	}, 	
////////////////////////////////////////////////////////////////////////////////
	prev : function (context, fromSlide) {
		var gS=$.gS,
			opts=gS.opts(context),
			slide,
			slideId=gS._step(context, -1, fromSlide);
		if(slideId === undefined) slideId=$(context).children().length-1;
		slideId=context.trigger("prev", slideId);
		slide=$(context).children().eq(slideId);
		if(slideId!==false && !slide.hasClass(opts.classes.active)) slide.trigger(opts.events.activate, true);
	},
////////////////////////////////////////////////////////////////////////////////
	next : function (context, fromSlide) {
		var gS=$.gS,
			opts=gS.opts(context),
			slide,
			slideId=gS._step(context, 1, fromSlide)
		if(slideId === undefined) slideId=0;
		slideId=context.trigger("next", slideId);
		slide=$(context).children().eq(slideId);
		if(slideId!==false && !slide.hasClass(opts.classes.active)) slide.trigger(opts.events.activate, true);
	},
////////////////////////////////////////////////////////////////////////////////
	_step : function (context, number, fromSlide) {
		var gS=$.gS,
			opts=gS.opts(context),
			slides=$(context).children(),
			next;
		fromSlide=fromSlide || slides.filter("."+opts.classes.slide+"."+opts.classes.active);
		if(!slides.filter(fromSlide).length) return undefined;
		next = $(fromSlide).index()+(parseFloat(number)%slides.length);
		if(next < 0) opts.circle ? 
			next = slides.length+next:
			next = 0;
		else if(next>=slides.length) opts.circle ? 
				next = next-slides.length: 
				next = slides.length-1;
				
		return next;
	},
////////////////////////////////////////////////////////////////////////////////
	opts : function (context, opts, save) {
		var data=$(context).data("opts");
		opts=$.extend(true,{},this.defaults, data||{}, opts||{});
		if(save) $(context).data("opts", opts);
		return opts;
	},
////////////////////////////////////////////////////////////////////////////////
	_cssFloat : function (context, value) {
		var mins={"minWidth":true,"min-width":true,"minHeight":true,"min-height":true},
			min=mins[value];
		value=$(context).css(value);
		if(min && value=="0px") return undefined;
		value=parseFloat(value.replace(["px","%"],""));
		return (!isNaN(value) ? value : undefined);
	},
////////////////////////////////////////////////////////////////////////////////
	_capitalize : function (word) {
		return word.charAt(0).toUpperCase() + word.slice(1);
	},
////////////////////////////////////////////////////////////////////////////////
	clearCache : function (context) {
		$(context).removeData("cache");
	},
////////////////////////////////////////////////////////////////////////////////
	_getCSS : function (context, data, i, ai) {
		var gS = $.gS,
			opts=gS.opts(context),

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
			slide.css[opts.LoT]=gS._cssFloat(slide.obj, opts.LoT);
		}
		else {
			if(!slide.obj.hasClass(opts.RoB) || posAct)  
				slide=gS._positioning(context, slide, opts.RoB);
			
			slide.align=opts.RoB;
			slide.css[opts.RoB]=gS._cssFloat(slide.obj, opts.RoB);
		}
		return data;
	},
////////////////////////////////////////////////////////////////////////////////
	_positioning : function (context, data, bind, active) {
		var gS=$.gS,
			opts=gS.opts(context),
			p = data.obj.position(),
			from = bind==opts.LoT ? opts.RoB : opts.LoT,
			cS = $(context)["inner"+gS._capitalize(opts.WoH)](),
			oS = data.obj["outer"+gS._capitalize(opts.WoH)](),
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
			css[bind]=gS._cssFloat(data.obj,"margin-"+bind);
			if(!css[bind] && !gS._cssFloat(data.obj,"margin-"+from)) 
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
			opts=gS.opts(context),
			slide= data[i],
			cssMin = slide.css["min-"+opts.WoH] || gS._cssFloat(slide.obj,"min-"+opts.WoH),
			cssMax = slide.css["max-"+opts.WoH] || gS._cssFloat(slide.obj,"max-"+opts.WoH),
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
							undefined
			};
		if(cssMin && cssMin > limits.max) limits.max=cssMin;
		if(cssMax && cssMax < limits.min) limits.min=cssMax;
		return limits;
	},
////////////////////////////////////////////////////////////////////////////////
	_getDCss : function (context, data, ai) {
		var gS = $.gS,
			opts=gS.opts(context),
			skip={},
			count=data.length,
			fullSize=cS=$(context)[opts.WoH](),
			newSize,
			hitMax,
			i,c,
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
			newSize=fullSize/count;
			for(i=0; limit = data[i]; i++) {
				limit=limit.limits;
				hitMax=(limit.max<newSize);
				if(!skip[i] && (limit.min>newSize || hitMax || i==ai)){
					skip[i]=true;
					count--;
					hitMax || i==ai? 
						fullSize-=dcss[i][opts.WoH]=limit.max:
						fullSize-=dcss[i][opts.WoH]=limit.min;
					newSize=fullSize/count;
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
			opts=gS.opts(context),
			slides=$(context).children(),
			active = slides.filter("."+opts.classes.slide+"."+opts.classes.active),
			ai=active.index(),
			i,
			cache=context.data("cache") || {},			
			dcss=cache.dcss || {},
			limits=cache.limits || {},
			data=[];

//		Get Data
		for(i=slides.length-1; i >=0 ; i--) {
			data[i]= data[i] || {
				obj:slides.eq(i)
			};
			
			data=gS._getCSS(context, data, i, ai);
			!opts.cache || !limits[i] ?
				data[i].limits=limits[i]=gS._getLimits(context, data, i):
				data[i].limits=limits[i];
		};

		if(!opts.cache || !dcss[ai]) dcss[ai] = gS._getDCss(context, data, ai);
		
		if(opts.cache) context.data("cache", {
				dcss:dcss,
				limits:limits
			});	
		
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
		opts=gS.opts(context, opts);	
		active = slides.filter("."+opts.classes.slide+"."+opts.classes.active);

//		Get and store Data for the animation function
		data=gS._getData(context);
		context.data("animation", data);	
	
//		Set hooks for either Activation or Deactivation.
		if(active.length <=0) {
			active.trigger("preDeactivateAnimation", data); // hook
			postAnimation = function () {
				var deactive=$(this).find("."+opts.classes.slide+".gSdeactivated");
				if(deactive.length>0) {
					deactive.trigger("postDeactivate"); // hook
					deactive.removeClass("gSdeactivated");
				}
			}
		}
		else {  
			active.trigger("preActivateAnimation", data); // hook
			postAnimation = function () {
				var active=$(this).find("."+opts.classes.slide+"."+opts.classes.active);
				if(active.length>0) {
					active.trigger("postActivate"); // hook
				}
			}
		}
		
//		Start Animation for Slides		
		context
			.dequeue("gSpreAnimation") // hook: custom queue that runs before the animation
			.css({textIndent:0})
			.animate({textIndent:100}, {duration:opts.transitionSpeed, easing:opts.easing, complete:postAnimation , step:gS._animationStep})
			.dequeue("gSpostAnimation"); // hook: custom queue that runs after the animation
		
		$.gS.timing("activation" , "done");
	
	},
////////////////////////////////////////////////////////////////////////////////
	_animationStep : function (state, obj) {
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
			border:0
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
////////////////////////////////////////////////////////////////////////////////
});
})(jQuery);


