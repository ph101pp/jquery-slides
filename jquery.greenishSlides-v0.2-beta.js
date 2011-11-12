/*! 
 * greenishSlides: jQuery Slideshow plugin - v0.2 - beta (5/13/2011)
 * http://www.philippadrian.com
 * 
 * Copyright (c) 2011 Philipp C. Adrian
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php)
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses. 
 */
 
 /*
 */
(function($) {
////////////////////////////////////////////////////////////////////////////////
$.gS=$.fn.greenishSlides = function (method){
	var context=$(this),
		data, call, args, i;
	if(typeof(method) === 'object' || !method) {
		args=arguments;
		call="_init";
	}
	else if($.gS[method]) {
		args=Array.prototype.slice.call(arguments,1);
		call=method;
	}
	else throw "Error: The method \""+method+"\" doesn't exist in greenishSlides";
	
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
				active:$()
			};
		if(call=="_init") {
			data.opts=method=="_init"?Array.prototype.slice.call(arguments,1):method;
			args=[data];
		}
		else args=[data].concat(args);
		$(context[i]).data("greenishSlidesData",data);

	
		if(call=="_triggerHook") return $.gS[call].apply(context[i], args);
		else try { 
				$.gS[call].apply(context[i], args);
			}
			catch(err){
				if(err!="hookReturnedFalse") throw err;
			}
	}
	return this;
};
////////////////////////////////////////////////////////////////////////////////
$.extend($.gS, {
////////////////////////////////////////////////////////////////////////////////
	defaults : {
		stayOpen: false,
//		fillSpace: true,
		resizable:false,
		vertical:false,
		circle : false,
		transitionSpeed: 400,
		easing:"swing",
		events: {
			activate:"click",
			deactivate:"click"
		},
		keyEvents:false,
		hooks : {},
		limits : {},
		active:false,
		classes:{
			active:"active",
			vertical:"gSVertical",
			horizontal:"gSHorizontal",
			slide:"gSSlide",
			deactivating:"gSdeactivating",
			positionActive:"positionActive"
/* 
			positionTop:"top",
			positionRight:"right",
			positionBottom:"bottom",
			positionLeft:"left"

 */
		},
		handle:".gSSlide",
		cache:false
//		queue:false
	},
////////////////////////////////////////////////////////////////////////////////
	_init : function (data) {	
		var gS=$.gS,
			context=data.context,
////	Extends defaults into opts.
			opts=gS.opts(data, data.opts, true),
			hooks, slides, event;

//		binding hooks to make them available.
		for(hooks in opts.hooks) gS.bindHook(data,hooks,opts.hooks[hooks]);
		context.greenishSlides("_triggerHook","preInit"); // hook
				
		slides = context.css(gS.css.context).addClass("greenishSlides")
			.children().addClass(opts.classes.slide).css(gS.css.gSSlide);

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
////	Keyboard events.		
		if(opts.keyEvents) {
			opts.vertical?
				$(document).bind("keydown", function(e) {
					if(e.which == 40) context.greenishSlides("next");
					else if(e.which == 38) context.greenishSlides("prev");
				}):
				$(document).bind("keydown", function(e) {
					if(e.which == 39) context.greenishSlides("next");
					else if(e.which == 37) context.greenishSlides("prev");
				});
		}
////	/Keyboard events.
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
		context.bind(event, function(e) {context.greenishSlides("_event",e);}); // focusin/focusout for Keyboard accessability;
////	/Activate and Deactivate events
		context.greenishSlides("_triggerHook","init"); // hook

////	First Initialisation
		if($("."+opts.classes.active, context).length)
			$("."+opts.classes.active, context).eq(0).removeClass(opts.classes.active).trigger(opts.events.activate, true);
		else if(opts.active !== false) {
			!isNaN(opts.active) ? 
				slides.eq(opts.active).removeClass(opts.classes.active).trigger(opts.events.activate, true):
				$(opts.active, context).eq(0).removeClass(opts.classes.active).trigger(opts.events.activate, true);
		}
		else gS.update(data);
		context.greenishSlides("_triggerHook","postInit"); // hook
	},
////////////////////////////////////////////////////////////////////////////////
	_event: function (data, e, triggeredSlide) {
		var target=$(e.target),
			opts=data.opts,
			context=data.context,
			handle, slide;
		if(triggeredSlide) target=[target,target];
		else {
			handle =target.is(opts.handle) ? target : $(opts.handle, context).has(target).eq(0);
			slide = handle.hasClass(opts.classes.slide) ? handle : context.children().has(handle);
			target= slide.length ? [slide, handle] : false;
		}
		if((e.type == "focusin" || e.type==opts.events.activate) && target && !target[0].hasClass(opts.classes.active)) {
			target[0].greenishSlides("_triggerHook","preActivateEvent"); // hook
			target[0].greenishSlides("activate");
		}
		else if(!opts.stayOpen && (e.type == "focusout" || e.type==opts.events.deactivate) && target && target[0].hasClass(opts.classes.active) && target[1].has(e.relatedTarget).length <=0 && target[1] != e.relatedTarget) {
			target[0].greenishSlides("_triggerHook","preDeactivateEvent");
			target[0].greenishSlides("deactivate");
		}
	},
////////////////////////////////////////////////////////////////////////////////
	activate : function (data) {
		var gS=$.gS,
			slide=$(this),
			context=data.context,
			opts=data.opts,
			deactivated;
			
		!slide.is("."+opts.classes.slide+", ."+opts.classes.slide+opts.handle)?
			slide=$("."+opts.classes.slide).has($(slide)):
			slide=$(slide);

		if(slide.hasClass(opts.classes.active)) return;
		
		slide.siblings("."+opts.classes.active).removeClass(opts.classes.active).addClass(opts.classes.deactivating);
		slide.addClass(opts.classes.active);
		data.active=slide;
		data.ai=slide.index();
		
		slide.greenishSlides("_triggerHook","preActivate"); // hook
		
		gS.update(data, {}, "activate");
	},
////////////////////////////////////////////////////////////////////////////////
	deactivate : function (data) {
		var gS=$.gS,
			slide=$(this),
			context=data.context,
			opts=data.opts;
		!slide.is("."+opts.classes.slide+", ."+opts.classes.slide+opts.handle)?
			slide=$("."+opts.classes.slide).has($(slide)):
			slide=$(slide);

		if(!slide.hasClass(opts.classes.active)) return;
		slide.removeClass(opts.classes.active).addClass(opts.classes.deactivating);
		slide.greenishSlides("_triggerHook","preDeactivate");// hook
		data.active=$();
		data.ai="-1";

		gS.update(data, {}, "deactivate");
	}, 
////////////////////////////////////////////////////////////////////////////////
	prev : function (data, fromSlide) {
		var gS=$.gS,
			context=data.context,
			opts=data.opts,
			slide,
			slideId=gS._step(data, -1, fromSlide);
		if(slideId === undefined) slideId=context.children().length-1;
		slideId=context.greenishSlides("_triggerHook","prev",slideId); //hook
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
		slideId=context.greenishSlides("_triggerHook","next",slideId);
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
	_triggerHook : function (data, hook, param) {
		if(!data.hooks[hook] || data.hooks[hook].length <= 0) return param;
		for(var key in data.hooks[hook]) 
			if((param=data.hooks[hook][key].apply(this, [data,param])) !== false) continue;
			else throw "hookReturnedFalse";
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
			context=data.context,
			ai=data.ai,
			slide, css, posAct, alignLoT;

		for(i=0; slide=data.slides[i]; i++) {
			css=data.css[i]=data.css[i]||{},
			posAct = slide.obj.hasClass(opts.classes.positionActive),
			alignLoT= ai==i && slide.obj.hasClass(opts.LoT);
		
			css[opts.WoH]=slide.obj["outer"+gS._capitalize(opts.WoH)](true);
			slide.active=(i==ai?true:false);
			
			
			//left
			if(!opts.resizable || !data.limited || i<ai || ai<0) {
				if(!slide.obj.hasClass(opts.LoT) || posAct)
					gS._positioning(data, i, opts.LoT);
				else {
					slide.align=opts.LoT;
					css[opts.LoT]=slide.obj.position()[opts.LoT];
				}
			}
			//right
			else if(!slide.active) {
				if(!slide.obj.hasClass(opts.RoB) || posAct) 
					gS._positioning(data, i, opts.RoB);
				else {
					slide.align=opts.RoB;
					css[opts.RoB]=gS._cssFloat(slide.obj, opts.RoB);
				}
			}
			//active
			else alignLoT ?
					gS._positioning(data, i, opts.LoT, true):
					gS._positioning(data, i, opts.RoB, true);
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
			cS = data.cS,
			oS = slide.obj["outer"+gS._capitalize(opts.WoH)](true),
			posLoT=p[opts.LoT],
			posRoB=cS-p[opts.LoT]-oS,
			css={};

		if(active) {
			css.zIndex=0;
			css[opts.WoH]="auto";
			data.css[i][opts.LoT]=css[opts.LoT]=posLoT;
			data.css[i][opts.RoB]=css[opts.RoB]=posRoB;
			slide.obj.addClass(opts.classes.positionActive);
		}
		else {
			css.zIndex=1;
			data.css[i][opts.WoH]=css[opts.WoH]=oS;
			data.css[i][bind] = css[bind]= bind==opts.LoT ? posLoT : posRoB;
			css[from]=data.css[i][from]="auto";
			slide.obj.removeClass(opts.classes.positionActive);
		}

		slide.align=bind;
		slide.obj.removeClass(from).addClass(bind).css(css);
	},
////////////////////////////////////////////////////////////////////////////////
	_getLimits : function (data, i) {
		var gS = $.gS,
			opts=data.opts,
			context=data.context,
			slide, k, min, max, limits;
		
		for(i=0; slide=data.slides[i]; i++) 
			if(!data.limits[i]) {
				data.limits[i]={};
				cssMin = gS._cssFloat(slide.obj,"min-"+opts.WoH);
				cssMax = gS._cssFloat(slide.obj,"max-"+opts.WoH);
				k="-"+(data.slides.length-i);
				min=[];
				max=[];
				
				!isNaN(cssMax) && max.push(cssMax); 
				opts.limits[i] && !isNaN(opts.limits[i].max) && max.push(opts.limits[i].max); 
				opts.limits[k] && !isNaN(opts.limits[k].max) && max.push(opts.limits[k].max); 
				!isNaN(opts.limits.max) && max.push(opts.limits.max); 
		
				data.limits[i].max=max.length ? 
					max.sort(function(a,b){return (a-b);})[0]:
					undefined;
		
				!isNaN(cssMin) && min.push(cssMin); 
				opts.limits[i] && !isNaN(opts.limits[i].min) && min.push(opts.limits[i].min); 
				opts.limits[k] && !isNaN(opts.limits[k].min) && min.push(opts.limits[k].min); 
				!isNaN(opts.limits.min) && min.push(opts.limits.min); 
		
				data.limits[i].min=min.length ? 
					min.sort(function(a,b){return (b-a);})[0]:
					undefined;
		
				if(cssMin && cssMin > data.limits[i].max) data.limits[i].max=cssMin;
				if(cssMax && cssMax < data.limits[i].min) data.limits[i].min=cssMax;
				if(data.limits[i].min || data.limits[i].max) data.limited=true;
			}
////	Resize event
		if(opts.resizable) 
			if(data.limited) { 
				if(!data.resizeEventSet) {
					$(window).bind("resize.greenishSlides", function(){
						context.greenishSlides("update");
					});
					data.resizeEventSet=true;	
				}
			}
			else if(data.resizeEventSet) {
				$(window).unbind("resize.greenishSlides");
				data.resizeEventSet=false;	
			}
////	/Resize event

	},
////////////////////////////////////////////////////////////////////////////////
	_getDCss : function (data) {
		var gS = $.gS,
			opts=data.opts,
			context=data.context,
			ai=data.ai,
			skip={},
			count=data.slides.length,
			cS=data.cS,
			fullSize=cS,
			newSize,
			hitMax,
			i,c,slide,limit,
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

			if(!opts.resizable || !data.limited || i<ai || ai<0) {
				dcss[i][opts.LoT]= c-dcss[i][opts.WoH];
			}
			else if(i!=ai) {
				dcss[i][opts.RoB]= cS-c;
			}
			else {			
				dcss[i][opts.LoT]= c-dcss[i][opts.WoH];
				dcss[i][opts.RoB]= cS-c;
			}
		}
		return dcss;
		
	},
////////////////////////////////////////////////////////////////////////////////
	_getData : function (data) {
		var gS=$.gS,
			context=data.context,
			opts=data.opts,
			slides=context.children(),
			active = data.active,
			ai=data.ai,
			i;
			
//		load caches if necessary
		data.dcss=opts.cache ? data.dcss : {};
		data.limits= opts.cache ? data.limits : {};
		data.limited= opts.cache ? data.limited : false;
		data.cS = opts.cache && data.cS ? data.cS : context["inner"+gS._capitalize(opts.WoH)]();

//		Get/Update slide objects
		if(slides.length != data.slides.length)
			for(i=slides.length-1; i >=0 ; i--) 
				data.slides[i] = data.slides[i] || {	
						obj:slides.eq(i)
					};
//		Get Limits if defined for each slide
		gS._getLimits(data);
//		Get current css values for each slide
		gS._getCSS(data);
//		Get new css values for each slide		
		data.dcss[ai] = data.dcss[ai] || gS._getDCss(data);
	},
////////////////////////////////////////////////////////////////////////////////
	update : function (data, opts, action) {
		var gS=$.gS,
			context=data.context.stop(),
			slides=context.children(),
			active=data.active,
			ai=data.ai,
			postAnimation;
		active.greenishSlides("_triggerHook","update"); // hook
		opts=gS.opts(data, opts);	

//		Get and store Data for the animation function
		gS._getData(data);
		
//		Set hooks for either Activation or Deactivation.
		if(action == "deactivate") {
			active.greenishSlides("_triggerHook","preDeactivateAnimation"); // hook
			postAnimation = function () {context.greenishSlides("_postDeactivate");}; // hook
		}
		else if(action == "activate") {  
			active.greenishSlides("_triggerHook","preActivateAnimation"); // hook
			postAnimation = function () {context.greenishSlides("_postActivate");}; // hook
		}
		else {
			active.greenishSlides("_triggerHook","preUpdateAnimation"); // hook
			postAnimation = function () {active.greenishSlides("_triggerHook","postUpdate");}; // hook		
		}
//		Start Animation for Slides	
		context
			.dequeue("gSpreAnimation") // hook: custom queue that runs before the animation
			.css({textIndent:0})
			.animate({textIndent:100}, {duration:opts.transitionSpeed, easing:opts.easing, complete:postAnimation , step:gS._animationStep})
			.dequeue("gSpostAnimation"); // hook: custom queue that runs after the animation
	},
////////////////////////////////////////////////////////////////////////////////
	_postActivate : function (data) {
		if(data.ai>=0)
			data.active.greenishSlides("_triggerHook","postActivate"); // hook
		$.gS._postDeactivate(data);
	},
////////////////////////////////////////////////////////////////////////////////
	_postDeactivate : function (data) {
		var deactive=data.context.find("."+data.opts.classes.slide+"."+data.opts.classes.deactivating);
		if(deactive.length>0) {
			deactive.greenishSlides("_triggerHook","postDeactivate"); // hook
			deactive.removeClass(data.opts.classes.deactivating);
		}
	},
////////////////////////////////////////////////////////////////////////////////
	_animationStep : function (state, obj) {
		try{
			var data = $(obj.elem).dequeue("gSanimationStep").data("greenishSlidesData"); // hook: custom queue that runs once on every step of the animation (MAKE IT FAST!)
			if(!data) throw data;
			var opts=data.opts,
				dcss=data.dcss[data.ai],
				ai=data.ai,
				css={},
				newCss=[],
				slide, k, i,
				slideAlignNot= data.slides[ai] && data.slides[ai].align == opts.LoT ? opts.RoB : opts.LoT,
				calc=function(i, key) {
					return Math.round(data.css[i][key]+((dcss[i][key]-data.css[i][key])*state));
				},
				getPosition = function(i, align) {
					return css[i] ? css[i][align]+css[i][opts.WoH] : 0;
				},
				trimValue=function(value, adjust) {
					if(state!=1 || !opts.resizable || data.limited) return value;
					
					return adjust ?
						(0.01+(100*value/data.cS))+"%":
						(100*value/data.cS)+"%";
				};
			state/=100;
//			Set Position
			for(i=0; slide=data.slides[i]; i++) {
				css[i]={};
				newCss[i]={};
				data.css[i][slide.align] = data.css[i][slide.align] || 0;
				css[i][slide.align]=calc(i, slide.align);
				if(slide.active && opts.resizable && data.limited)
					newCss[i][slideAlignNot]=css[i][slideAlignNot]=calc(i, slideAlignNot);
	
				newCss[i][slide.align]=trimValue(css[i][slide.align]);
			}
	
//			Set Width to fill up space
			for(i=0; slide=data.slides[i]; i++)
				if(slide.active && opts.resizable && data.limited)
					css[i][opts.WoH]=data.cS-css[i][slide.align]-css[i][slideAlignNot];
				else {
					k=(slide.align == opts.LoT ? i+1:i-1);
					data.slides[k] ?
						css[i][opts.WoH]=css[k][slide.align]-css[i][slide.align]:
						css[i][opts.WoH]=data.cS-css[i][slide.align];
					i==data.slides.length-1 ?
						newCss[i][opts.WoH]=trimValue(css[i][opts.WoH], true):
						newCss[i][opts.WoH]=trimValue(css[i][opts.WoH]);
				}
			
			data.actualCSS=newCss;
			$.gS._triggerHook(data, "step");
		}
		catch(err){
			$(this).stop();
			return;
		}
		for(i=0; slide=data.slides[i]; i++) slide.obj.css(newCss[i]);		
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
			listStyle:"none"
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
			height:"100%",
			top:0
		},
		gSVertical:{
			width:"100%",
			left:0
		}
	}
////////////////////////////////////////////////////////////////////////////////
});
////////////////////////////////////////////////////////////////////////////////
})(jQuery);


