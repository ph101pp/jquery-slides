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
$.fn.greenishSlides = function (method){
	var context=$(this),
		data, call, args;
	if(typeof(method) === 'object' || !method) {
		args=arguments;
		call="_init";
	}
	else if($.gS[method]) {
		args=Array.prototype.slice.call(arguments,1);
		call=method;
	}
	else $.error(method+"doesn't exist");
	
	for(i=0; i<context.length; i++) {
		data=$(context[i]).data("greenishSlidesData") || $(context[i]).parent().data("greenishSlidesData");
   		if(data && call=="_init") {
   			$.gS.opts(data, method, true);
   			continue;
   		}
   		data = data || {
				context : $(context[i]),
				css:{},
				dcss:{},
				limits:{},
				hooks:[],
				slides:[],
				ai:-1,
				active:$(),
			};
		if(call=="_init") {
			data.opts=method=="_init"?Array.prototype.slice.call(arguments,1):method;
			args=[data];
		}
		else args=[data].concat(args);
		$(context[i]).data("greenishSlidesData",data);

		if(call=="triggerHook") return $.gS[call].apply(this, args);
		else $.gS[call].apply(this, args);
	};
	return this;
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
	_init : function (data) {	
		context=data.context;
////	Extends defaults into opts.
		opts=$.gS.opts(data, data.opts, true);

//		binding hooks to make them available.
				
		var gS=$.gS,
			context=data.context,
////		Extends defaults into opts.
			opts=gS.opts(data, data.opts, true),
			slides = context.css(gS.css.context).children().addClass(opts.classes.slide).css(gS.css.gSSlide),
			activateDeactivateEvent=function (e, triggeredSlide) {
				var target=$(e.target);
				target= triggeredSlide ? [target,target] : eventSlide(e);
				if((e.type == "focusin" || e.type==opts.events.activate) && target && !target[0].hasClass(opts.classes.active)) {
					target[0].greenishSlides("triggerHook","preActivateEvent"); // hook
					target[0].greenishSlides("activate");
				}
				else if(!opts.stayOpen && (e.type == "focusout" || e.type==opts.events.deactivate) && target && target[0].hasClass(opts.classes.active) && target[1].has(e.relatedTarget).length <=0 && target[1] != e.relatedTarget) {
					target[0].greenishSlides("triggerHook","preDeactivateEvent");
					target[0].greenishSlides("deactivate");
				}
			},
			eventSlide= function(e) {
				var target=$(e.target),
					handle=target.is(opts.handle) ? target : $(opts.handle, context).has(target).eq(0),
					slide = handle.hasClass(opts.classes.slide) ? handle : context.children().has(handle);
					return slide.length ? [slide, handle] : false;					
			},
			event;

		for(hooks in opts.hooks) gS.bindHook(data,hooks,opts.hooks[hooks]);
		context.greenishSlides("triggerHook","preInit"); // hook
		
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
			if(e.which == 39 || e.which == 40) context.greenishSlides("next");
			else if(e.which == 37 || e.which == 38) context.greenishSlides("prev");
		});
		
		if(opts.swipeEvents && context.swipe) context.swipe({
			threshold: opts.swipeThreshold,
			swipeLeft: function(){context.greenishSlides("next")},
			swipeRight: function(){context.greenishSlides("prev")}
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
		else gS.update(data);
		context.greenishSlides("triggerHook","postInit"); // hook
		
		gS.timing("init" , "Done");
	},
////////////////////////////////////////////////////////////////////////////////
	activate : function (data) {
		$.gS.timing("activation", "Start", true);
		var gS=$.gS,
			slide=$(this),
			context=data.context,
			opts=data.opts,
			deactivated;
			
		
		!slide.is("."+opts.classes.slide+", ."+opts.classes.slide+opts.handle)?
			slide=$("."+opts.classes.slide).has($(slide)):
			slide=$(slide);

		if(slide.hasClass(opts.classes.active)) return;
		slide.siblings("."+opts.classes.active).removeClass(opts.classes.active).addClass("gSdeactivated");
		
		deactivated =slide.siblings(".gSdeactivated");
		if(deactivated.length > 0) {
			deactivated.removeClass("gSdeactivated");
			slide.greenishSlides("triggerHook","postDeactivate"); // hook
		}
		slide.addClass(opts.classes.active)
		data.active=slide;
		data.ai=slide.index();
		
		slide.greenishSlides("triggerHook","preActivate"); // hook
		
		gS.update(data);
 	},
////////////////////////////////////////////////////////////////////////////////
 	deactivate : function (data) {
		var gS=$.gS,
			slide=$(this),
			context=data.context,
			opts=data.opts,
		!slide.is("."+opts.classes.slide+", ."+opts.classes.slide+opts.handle)?
			slide=$("."+opts.classes.slide).has($(slide)):
			slide=$(slide);

		if(!slide.hasClass(opts.classes.active)) return;
		slide.removeClass(opts.classes.active).addClass("gSdeactivated");
		slide.greenishSlides("triggerHook","preDeactivate");// hook
		data.active=$();
		data.ai="-1";

		gS.update(data);
 	}, 	
////////////////////////////////////////////////////////////////////////////////
	prev : function (data, fromSlide) {
		var gS=$.gS,
			context=data.context,
			opts=data.opts,
			slide,
			slideId=gS._step(data, -1, fromSlide);
		if(slideId === undefined) slideId=context.children().length-1;
		slideId=context.greenishSlides("triggerHook","prev",slideId); //hook
		slide=context.children().eq(slideId);
		if(slideId!==false && !slide.hasClass(opts.classes.active)) slide.greenishSlides("activate");
	},
////////////////////////////////////////////////////////////////////////////////
	next : function (data, fromSlide) {
		var gS=$.gS,
			context=data.context,
			opts=data.opts,
			slide,
			slideId=gS._step(data, 1, fromSlide);
		if(slideId === undefined) slideId=0;
		slideId=context.greenishSlides("triggerHook","next",slideId);
		slide=context.children().eq(slideId);
		if(slideId!==false && !slide.hasClass(opts.classes.active)) slide.greenishSlides("activate");
	},
////////////////////////////////////////////////////////////////////////////////
	_step : function (data, number, fromSlide) {
		var gS=$.gS,
			context=data.context,
			opts=data.opts,
			slides=context.children(),
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
	bindHook : function (data, hook, func) {
		func=typeof(func)=="function"?[func]:func;
		data.hooks[hook]=data.hooks[hook]||[];
		for(var key in func) data.hooks[hook].push(func[key]);
	},
////////////////////////////////////////////////////////////////////////////////
	triggerHook : function (data, hook, param) {
		if(data.hooks[hook] && data.hooks[hook].length <= 0) return param;
		for(var key in data.hooks[hook]) param=data.hooks[hook][key].apply(this, [data,param]);	
		return param;
	},
////////////////////////////////////////////////////////////////////////////////
	opts : function (data, opts, save) {
		opts=$.extend(true,{},this.defaults, data.opts||{}, opts||{});
		if(save) data.opts=opts;
		return opts;
	},
////////////////////////////////////////////////////////////////////////////////
	_cssFloat : function (obj, value) {
		var mins={"minWidth":true,"min-width":true,"minHeight":true,"min-height":true},
			min=mins[value];
		value=obj.css(value);
		if(min && value=="0px") return undefined;
		value=parseFloat(value.replace(["px","%"],""));
		return (!isNaN(value) ? value : undefined);
	},
////////////////////////////////////////////////////////////////////////////////
	_capitalize : function (word) {
		return word.charAt(0).toUpperCase() + word.slice(1);
	},
////////////////////////////////////////////////////////////////////////////////
	clearCache : function (data) {
		data.dcss={};
		data.limits={};
	},
////////////////////////////////////////////////////////////////////////////////
	_getCSS : function (data, i) {
		var gS = $.gS,
			opts=data.opts,
			context=data.context
			slide= data.slides[i],
			ai=data.ai,
			css=data.css[i]=data.css[i]||{}
			posAct = slide.obj.hasClass("posAct"),
			alignLoT= ai==i && slide.obj.hasClass(opts.LoT);
		
		css[opts.WoH]=slide.obj[opts.WoH]();
		slide.active=(i==ai?true:false);
		
		if(opts.resizable && slide.active) {
			alignLoT ?
				gS._positioning(data, i, opts.LoT, true):
				gS._positioning(data, i, opts.RoB, true);
		}
		else if(i<ai || ai<0 || (slide.active && alignLoT)){
			if(!slide.obj.hasClass(opts.LoT) || posAct) 
				gS._positioning(data, i, opts.LoT);

			slide.align=opts.LoT;
			css[opts.LoT]=gS._cssFloat(slide.obj, opts.LoT);
		}
		else {
			if(!slide.obj.hasClass(opts.RoB) || posAct)  
				gS._positioning(data, i, opts.RoB);
			
			slide.align=opts.RoB;
			css[opts.RoB]=gS._cssFloat(slide.obj, opts.RoB);
		}
	},
////////////////////////////////////////////////////////////////////////////////
	_positioning : function (data, i, bind, active) {
		var gS=$.gS,
			opts=data.opts,
			context=data.context,
			slide=data.slides[i],
			p = slide.obj.position(),
			from = bind==opts.LoT ? opts.RoB : opts.LoT,
			cS = context["inner"+gS._capitalize(opts.WoH)](),
			oS = slide.obj["outer"+gS._capitalize(opts.WoH)](),
			marginLoT="margin-"+opts.LoT,
			marginRoB="margin-"+opts.RoB,
			css;

		if(active) {
			css={zIndex:0, position:"relative"};
			css[opts.WoH]="auto";
			data.css[i][marginLoT]=css[marginLoT]=p[opts.LoT];
			data.css[i][marginRoB]=css[marginRoB]=cS-p[opts.LoT]-oS;
			css[bind]=0;
			slide.obj.addClass("posAct");
			slide.align=bind;
		}
		else {
			css={zIndex:1, position:"absolute"};
			css[bind]=gS._cssFloat(slide.obj,"margin-"+bind);
			if(!css[bind] && !gS._cssFloat(slide.obj,"margin-"+from)) 
				bind==opts.LoT ? 
					css[bind]=p[opts.LoT]:
					css[bind]=cS-p[opts.LoT]-oS;
			css[marginLoT]=0;
			css[marginRoB]=0;
			data.css[i][opts.WoH]=css[opts.WoH]=oS;
			data.css[i][from]="auto";
			slide.obj.removeClass("posAct");
		}
		css[from]="auto";
		slide.obj.removeClass(from).addClass(bind).css(css);
	},
////////////////////////////////////////////////////////////////////////////////
	_getLimits : function (data, i) {
//		console.log("limits"+i);
		var gS = $.gS,
			opts=data.opts,
			context=data.context,
			slide= data.slides[i],
			cssMin = data.css[i]["min-"+opts.WoH] || gS._cssFloat(slide.obj,"min-"+opts.WoH),
			cssMax = data.css[i]["max-"+opts.WoH] || gS._cssFloat(slide.obj,"max-"+opts.WoH),
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
	_getDCss : function (data) {
		var gS = $.gS,
			opts=data.opts,
			context=data.context,
			ai=data.ai,
			skip={},
			count=data.slides.length,
			fullSize=cS=data.cS,
			newSize,
			hitMax,
			i,c,
			dcss={};
//		Calculate Width
		for(i=c=0; slide=data.slides[i]; i++) {
			if(!slide.active) c+=data.limits[i].min || 0;
			dcss[i]={};
		}
		if(ai>=0 && (isNaN(data.limits[ai].max) || data.limits[ai].max>cS-c)) 
			for(i=0; i < count; i++)  
				i==ai?
					dcss[i][opts.WoH] = cS-c:
					dcss[i][opts.WoH] = data.limits[i].min || 0;
		else {
			newSize=fullSize/count;
			for(i=0; limit=data.limits[i]; i++) {
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
			for(i=0; i < data.slides.length; i++) 
				if(!skip[i]) dcss[i][opts.WoH]=newSize;
		}
		
//		Caculate position.		
		for(i=c=0; slide=data.slides[i]; i++) {
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
	_getData : function (data) {
		$.gS.timing("update" , "Start",true);
		var gS=$.gS,
			context=data.context,
			opts=data.opts,
			slides=context.children(),
			active = data.active,
			ai=data.ai,
			i,
			dcss=data.dcss=opts.cache ? data.dcss : {},
			limits=data.limits= opts.cache ? data.limits : {};
			data.cS = opts.cache && data.cS ? data.cS : context[opts.WoH]();
 
//		Get data
		for(i=slides.length-1; i >=0 ; i--) {
			data.slides[i] = data.slides[i] || {	
					obj:slides.eq(i)
				}
			
			gS._getCSS(data, i);
			data.limits[i]=data.limits[i] || gS._getLimits(data,i);
		};

		data.dcss[ai] = data.dcss[ai] || gS._getDCss(data);
	},
////////////////////////////////////////////////////////////////////////////////
	update : function (data, opts) {
		var gS=$.gS,
			context=data.context.stop(),
			slides=context.children(),
			active=data.active,
			ai=data.ai,
			postAnimation,
			data;
		opts=gS.opts(data, opts);	

//		Get and store Data for the animation function
		gS._getData(data);
		
//		Set hooks for either Activation or Deactivation.
		if(active.length <=0) {
			active.greenishSlides("triggerHook","preDeactivateAnimation"); // hook
			postAnimation = function () {
				var deactive=$(this).find("."+opts.classes.slide+".gSdeactivated");
				if(deactive.length>0) {
					deactive.greenishSlides("triggerHook","postDeactivate"); // hook
					deactive.removeClass("gSdeactivated");
				}
			}
		}
		else {  
			active.greenishSlides("triggerHook","preActivateAnimation"); // hook
			postAnimation = function () {
				var active=$(this).find("."+opts.classes.slide+"."+opts.classes.active);
				if(active.length>0) {
					active.greenishSlides("triggerHook","postActivate"); // hook
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
		var data= $(obj.elem).dequeue("gSanimationStep").data("greenishSlidesData"); // hook: custom queue that runs once on every step of the animation (MAKE IT FAST!)
		if(!data) {
			$(this).stop();
			return;
		};
		var	opts=data.opts,
			dcss=data.dcss[data.ai],
			ai=data.ai,
			css={},
			slide, k, i,
			calc=function(i, key) {
				return Math.round(data.css[i][key]+((dcss[i][key]-data.css[i][key])*(state[i] || state)));
			},
			getPosition = function(i, align) {
				return css[i] ? css[i][align]+css[i][opts.WoH] : 0;
			};
		state/=100;
		
//		Set Position
		for(i=data.slides.length-1; slide=data.slides[i]; i--) {
			css[i]={};
			if(!slide.active) {
				data.css[i][slide.align] = data.css[i][slide.align] || 0;
				css[i][slide.align]=calc(i, slide.align);
			}
		};
//		Set Width to fill up space
		for(i=data.slides.length-1; slide=data.slides[i]; i--) if(!slide.active) {
			k= (slide.align == opts.LoT ? i+1:i-1);
			if(data.slides[k]) !data.slides[k].active? 
				css[i][opts.WoH] = css[k][slide.align]-css[i][slide.align]:
				css[i][opts.WoH] = calc(i,opts.WoH);
			else css[i][opts.WoH]= data.cS-css[i][slide.align];
			
			slide.obj.css(css[i]);		
		}
//		Set Active
		if(css[ai]) {
			if(opts.resizable) {
				css[ai]["margin-"+opts.LoT]=getPosition(ai-1 , opts.LoT);
				css[ai]["margin-"+opts.RoB]=getPosition(ai+1 , opts.RoB);
			}
			else {
				if(data.slides[ai].align == opts.LoT) {
					css[ai][opts.LoT]=getPosition(ai-1 ,opts.LoT);
					css[ai][opts.WoH]=data.cS-css[ai][opts.LoT]-getPosition(ai+1,opts.RoB);
				}
				else {
					css[ai][opts.RoB]=getPosition(ai+1 ,opts.RoB);
					css[ai][opts.WoH]=data.cS-css[ai][opts.RoB]-getPosition(ai-1,opts.LoT);
				}
			}
			data.slides[ai].obj.css(css[ai]);
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


