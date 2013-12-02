/*! 
 * jQuery Slides plugin - v1.0.3 (https://github.com/greenish/jquery-slides)
 * 
 * Copyright (c) 2011 Philipp Adrian (www.philippadrian.com)
 *
 * The MIT Licence (http://opensource.org/licenses/MIT)
 *   
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions: 

 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.

 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

(function($) {
/*///////////////////////////////////////////////////////////////////////////////
	Creates the data object that holds all data about the greenishSlide and calls 
	the passed method or the _init method.
*/
var greenishSlides =$.fn.slides = function (method){
	var context=$(this),
		data, call, args, givenArgs, i, opts;
	if(typeof(method) === 'object' || !method) {
		givenArgs=arguments;
		call="_init";
	}
	else if(greenishSlides[method]) {
		givenArgs=Array.prototype.slice.call(arguments,1);
		call=method;
	}
	else throw "Error: The method \""+method+"\" doesn't exist in jQuery Slides";
	
	for(i=0; i<context.length; i++) {
		args=givenArgs;
		data=$(context[i]).data("greenishSlidesData") || $(context[i]).parent().data("greenishSlidesData");
		if(data && call=="_init") {
			greenishSlides._init(data, method=="_init"?Array.prototype.slice.call(arguments,1):method, true);
			continue;
		}
		data = data || {
				context : $(context[i]),
				css:{},
				dcss:{},
				limits:{},
				callbacks:[],
				slides:[],
				ai:-1,
				active:$()
			};
		if(call=="_init") {
			opts = greenishSlides._extendOpts(data, (method=="_init" ? Array.prototype.slice.call(arguments,1):method));
			args=[data, opts];
		}
		else args=[data].concat(args);
		$(context[i]).data("greenishSlidesData",data);

//		Call method and catch "callbackReturnedFalse" error from Callback. 
		if(call=="_triggerCallback") return greenishSlides[call].apply(context[i], args);
		else try { 
				greenishSlides[call].apply(context[i], args);
			}
			catch(err){
				if(err!="callbackReturnedFalse") throw err;
			}
	}
	return this;
};
////////////////////////////////////////////////////////////////////////////////
$.extend(greenishSlides, {
/*///////////////////////////////////////////////////////////////////////////////
	object		defaults 
	Contains all the default settings that will be used if nothing else is defined.
*/
	defaults : {
		stayOpen: false,
//		fillSpace: true,
		resizable:false,
		vertical:false,
		circle : false,
		transitionSpeed: 400,
		easing:"swing",
		events: {
			activate:"mouseover",
			deactivate:"mouseout"
		},
		keyEvents:false,
		callbacks : {},
		limits : {},
		active:false,
		classes:{
			active:"gsActive",
			vertical:"gsVertical",
			horizontal:"gsHorizontal",
			slide:"gsSlide",
			deactivating:"gsDeactivating",
			positionActive:"gsPositionActive"
/* 
			positionTop:"top",
			positionRight:"right",
			positionBottom:"bottom",
			positionLeft:"left"

 */
		},
		handle:".gsSlide",
		cache:false
//		queue:false
	},
/*///////////////////////////////////////////////////////////////////////////////
*/
	_init : function (data, opts, update) {	
		var gS=greenishSlides,
			context=data.context,
			slides = context.children(),
			callbacks, event, newActive, cssClass;

		opts = opts || {};

//		binding callbacks to make them available.
		for(callbacks in opts.callbacks) gS.bindCallback(data,callbacks,opts.callbacks[callbacks]);

////	Sets css and classes
		if(!update) {
			context.slides("_triggerCallback","preInit", opts); // #CALLBACK
			context.css(gS.css.context).addClass("greenishSlides");
			slides.css(gS.css.gSSlide).addClass(opts.classes.slide);
		}
		else 
			if(opts.classes) {
				for(cssClass in opts.classes)
					if(cssClass=="gSHorizontal" || cssClass=="gSVertical") 
						context.removeClass(data.opts.classes[cssClass]).addClass(opts.classes[cssClass]);
					else 
						$(data.opts.classes[cssClass], slides).removeClass(data.opts.classes[cssClass]).addClass(opts.classes[cssClass]);
			}

		data.opts= greenishSlides._extendOpts(data, {classes:opts.classes}, true);
////	/Sets css and classes
////	Orientation
		if(opts.vertical !== undefined && opts.vertical !== data.opts.vertical) {
			if(data.opts.LoT !== undefined || data.opts.RoB !== undefined) slides.removeClass(data.opts.LoT+" "+data.opts.RoB);
			if(opts.vertical) {
				slides.css(gS.css.gSVertical).filter("."+opts.classes.active).css(gS.css.gSVerticalActive);
				context.removeClass(data.opts.classes.horizontal).addClass(data.opts.classes.vertical);
				$.extend(opts, gS.orientation.vertical);
			}
			else {
				slides.css(gS.css.gSHorizontal).filter("."+opts.classes.active).css(gS.css.gSHorizontalActive);
				context.removeClass(data.opts.classes.vertical).addClass(data.opts.classes.horizontal);
				$.extend(opts, gS.orientation.horizontal);
			}
			data.opts.vertical= opts.vertical;
		}

////	/Orientation
////	Keyboard events.		
		if(opts.keyEvents !== undefined && opts.keyEvents !== data.opts.keyEvents) {
			if(opts.keyEvents)
				data.opts.vertical?
					$(document).bind("keydown.gS", function(e) {
						if(e.which == 40) context.slides("next");
						else if(e.which == 38) context.slides("prev");
					}):
					$(document).bind("keydown.gS", function(e) {
						if(e.which == 39) context.slides("next");
						else if(e.which == 37) context.slides("prev");
					});
			else $(document).unbind("keydown.gS");
		}
////	/Keyboard events.
////	Activate and Deactivate events
		if(opts.events !== undefined || opts.handle !== undefined) {
			if(opts.handle !== undefined) data.opts.handle=opts.handle;
			if(data.opts.events === undefined) data.opts.events={};
				
			opts.events= !data.opts.handle || !opts.events ?
				{
					activate:"gsActivate",
					deactivate:false
				}:
				{
					activate:opts.events.activate || data.opts.events.activate || false,
					deactivate:opts.events.deactivate || data.opts.events.deactivate || false
				};
			
			event=!opts.events.activate ? 
				"":
				opts.events.activate+".gsActivate focusin.gsActivate ";
			event+=!opts.events.deactivate ? 
				"":
				opts.events.deactivate==opts.events.activate? 
					"focusout.gsActivate ":
					opts.events.deactivate+".gsActivate focusout.gsActivate ";
			context.unbind(".gsActivate").bind(event, function(e) {context.slides("_event",e);}); // focusin/focusout for Keyboard accessability;
		}
////	/Activate and Deactivate events
////	Resize event
		if(opts.resizable !== undefined && !opts.resizable) {
			$(window).unbind("resize.gS");
		};
////	/Resize event
////	First Initialisation / update
		if(!opts.active && opts.stayOpen) opts.active=0;
		newActive=opts.active !== undefined;

		//Extends defaults into opts.
		opts=data.opts = greenishSlides._extendOpts(data, opts);		

		if(!update) context.slides("_triggerCallback","init"); // #CALLBACK

		if(newActive && opts.active !== false){
			if(opts.active === true) opts.active=0;
			if($("."+opts.classes.active, context).length)
				$("."+opts.classes.active, context).eq(0).removeClass(opts.classes.active).trigger(opts.events.activate, true);
			else if(opts.active !== false) {
				!isNaN(opts.active) ? 
					slides.eq(opts.active).removeClass(opts.classes.active).trigger(opts.events.activate, true):
					$(opts.active, context).eq(0).removeClass(opts.classes.active).trigger(opts.events.activate, true);
			}
		}
		else if(opts.active === false && data.ai >= 0) $("."+opts.classes.active, context).eq(0).trigger(opts.events.deactivate, true);
		else gS.update(data);
////	/First Initialisation / update
		if(!update) context.slides("_triggerCallback","postInit"); // #CALLBACK
	},
/*///////////////////////////////////////////////////////////////////////////////
*/
	_extendOpts : function (data, opts, noDefaults) {
		return noDefaults ? 
			$.extend(true,{}, data.opts||{}, opts||{}):
			$.extend(true,{}, this.defaults, data.opts||{}, opts||{});
	},
/*///////////////////////////////////////////////////////////////////////////////
*/
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
			target[0].slides("_triggerCallback","activateEvent"); // #CALLBACK
			target[0].slides("activate");
		}
		else if(!opts.stayOpen && (e.type == "focusout" || e.type==opts.events.deactivate) && target && target[0].hasClass(opts.classes.active) && target[1].has(e.relatedTarget).length <=0 && target[1] != e.relatedTarget) {
			target[0].slides("_triggerCallback","deactivateEvent"); // #CALLBACK
			target[0].slides("deactivate");
		}
	},
/*///////////////////////////////////////////////////////////////////////////////
*/
	activate : function (data) {
		var gS=greenishSlides,
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
		
		slide.slides("_triggerCallback","preActivate"); // #CALLBACK
		
		gS.update(data,"activate");
	},
/*///////////////////////////////////////////////////////////////////////////////
*/
	deactivate : function (data) {
		var gS=greenishSlides,
			slide=$(this),
			context=data.context,
			opts=data.opts;
		!slide.is("."+opts.classes.slide+", ."+opts.classes.slide+opts.handle)?
			slide=$("."+opts.classes.slide).has($(slide)):
			slide=$(slide);

		if(!slide.hasClass(opts.classes.active)) return;
		slide.removeClass(opts.classes.active).addClass(opts.classes.deactivating);
		slide.slides("_triggerCallback","preDeactivate");// #CALLBACK
		data.active=$();
		data.ai="-1";

		gS.update(data, "deactivate");
	}, 
/*///////////////////////////////////////////////////////////////////////////////
*/
	prev : function (data, fromSlide) {
		var gS=greenishSlides,
			context=data.context,
			opts=data.opts,
			slide,
			slideId=gS._step(data, -1, fromSlide);
		if(slideId === undefined) slideId=context.children().length-1;
		slideId=context.slides("_triggerCallback","prev",slideId); //callback
		slide=context.children().eq(slideId);
		if(slideId!==false && !slide.hasClass(opts.classes.active)) slide.slides("activate");
	},
/*///////////////////////////////////////////////////////////////////////////////
*/
	next : function (data, fromSlide) {
		var gS=greenishSlides,
			context=data.context,
			opts=data.opts,
			slide,
			slideId=gS._step(data, 1, fromSlide);
		if(slideId === undefined) slideId=0;
		slideId=context.slides("_triggerCallback","next",slideId);
		slide=context.children().eq(slideId);

		if(slideId!==false && !slide.hasClass(opts.classes.active)) slide.slides("activate");
	},
/*///////////////////////////////////////////////////////////////////////////////
*/
	_step : function (data, number, fromSlide) {
		var gS=greenishSlides,
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
/*///////////////////////////////////////////////////////////////////////////////
*/
	bindCallback : function (data, callback, func) {
		func=typeof(func)=="function"?[func]:func;
		data.callbacks[callback]=data.callbacks[callback]||[];
		for(var key in func) data.callbacks[callback].push(func[key]);
	},
/*///////////////////////////////////////////////////////////////////////////////
*/
	_triggerCallback : function (data, callback, param) {
		if(!data.callbacks[callback] || data.callbacks[callback].length <= 0) return param;
		for(var key in data.callbacks[callback]) 
			if((param=data.callbacks[callback][key].apply(this, [data,param])) !== false) continue;
			else throw "callbackReturnedFalse";
		return param;
	},
/*///////////////////////////////////////////////////////////////////////////////
*/
	_cssFloat : function (obj, value) {
		var mins={"minWidth":true,"min-width":true,"minHeight":true,"min-height":true},
			min=mins[value];
		value=obj.css(value);
		if(min && value=="0px") return undefined;
		value=parseFloat(value.replace(["px","%"],""));
		return (!isNaN(value) ? value : undefined);
	},
/*///////////////////////////////////////////////////////////////////////////////
*/
	_capitalize : function (word) {
		return word.charAt(0).toUpperCase() + word.slice(1);
	},
/*///////////////////////////////////////////////////////////////////////////////
*/
	clearCache : function (data) {
		data.dcss={};
		data.limits={};
	},
/*///////////////////////////////////////////////////////////////////////////////
	Sets the new _positioning for each slide and gets the css values of the current state
*/
	_getCSS : function (data, i) {
		var gS = greenishSlides,
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
/*///////////////////////////////////////////////////////////////////////////////
	Changes the origin/positioning of a slide to "active", "left/top" or "right/bottom".
	This has no visual effect on the slide.
*/
	_positioning : function (data, i, bind, active) {
		var gS=greenishSlides,
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
/*///////////////////////////////////////////////////////////////////////////////
	Calculates the minWidth/minHeight and maxWidth/maxHeight for each slide.
*/
	_getLimits : function (data, i) {
		var gS = greenishSlides,
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
				
				if(!isNaN(cssMax)) data.limits[i].max=cssMax;
				else if(opts.limits[i] && !isNaN(opts.limits[i].max) && opts.limits[i].max !== false) data.limits[i].max=opts.limits[i].max; 
				else if(opts.limits[k] && !isNaN(opts.limits[k].max) && opts.limits[k].max !== false) data.limits[i].max=opts.limits[k].max; 
				else if(!isNaN(opts.limits.max) && opts.limits.max !== false) data.limits[i].max=opts.limits.max; 
				else data.limits[i].max= undefined;
		
				if(!isNaN(cssMin)) data.limits[i].min=cssMin; 
				else if(opts.limits[i] && !isNaN(opts.limits[i].min) && opts.limits[i].min !== false) data.limits[i].min=opts.limits[i].min; 
				else if(opts.limits[k] && !isNaN(opts.limits[k].min) && opts.limits[k].min !== false) data.limits[i].min=opts.limits[k].min; 
				else if(!isNaN(opts.limits.min) && opts.limits.min !== false) data.limits[i].min=opts.limits.min; 
				else data.limits[i].min = undefined;

				if(cssMin && cssMin > data.limits[i].max) data.limits[i].max=cssMin;
				if(cssMax && cssMax < data.limits[i].min) data.limits[i].min=cssMax;
				if(data.limits[i].min || data.limits[i].max) data.limited=true;
			}
////	Resize event
		if(opts.resizable) 
			if(data.limited) { 
				if(!data.resizeEventSet) {
					$(window).bind("resize.gS", function(){
						context.slides("update");
					});
					data.resizeEventSet=true;	
				}
			}
			else if(data.resizeEventSet) {
				$(window).unbind("resize.gS");
				data.resizeEventSet=false;	
			}
////	/Resize event

	},
/*///////////////////////////////////////////////////////////////////////////////
	Calculates the NEW css values for each Slide.
*/
	_getDCss : function (data) {
		var gS = greenishSlides,
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
/*///////////////////////////////////////////////////////////////////////////////
	generates all data that is needed to animate the slides. 
	and stores it in the data object
	Checks chache and calls other "getter" functions
*/
	_getData : function (data) {
		var gS=greenishSlides,
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
		if(slides.length != data.slides.length) {
			data.slides=[];
			for(i=slides.length-1; i >=0 ; i--) 
				data.slides[i] = {	
						obj:slides.eq(i)
					};
		}
//		Get Limits if defined for each slide
		gS._getLimits(data);
//		Get current css values for each slide
		gS._getCSS(data);
//		Get new css values for each slide		
		data.dcss[ai] = data.dcss[ai] || gS._getDCss(data);
	},
/*///////////////////////////////////////////////////////////////////////////////
*/
	update : function (data, action) {
		var gS=greenishSlides,
			context=data.context.stop(),
			slides=context.children(),
			active=data.active,
			ai=data.ai,
			opts=data.opts,
			postAnimation;
		active.slides("_triggerCallback","preUpdate"); // #CALLBACK

//		Get and store Data for the animation function
		gS._getData(data);
		
//		Set callbacks for either Activation or Deactivation.
		if(action == "deactivate") {
			active.slides("_triggerCallback","preDeactivateAnimation"); // #CALLBACK
			postAnimation = function () {context.slides("_postDeactivate");}; // #CALLBACK
		}
		else if(action == "activate") {  
			active.slides("_triggerCallback","preActivateAnimation"); // #CALLBACK
			postAnimation = function () {context.slides("_postActivate");}; // #CALLBACK
		}
		else {
			active.slides("_triggerCallback","preUpdateAnimation"); // #CALLBACK
			postAnimation = function () {active.slides("_triggerCallback","postUpdate");}; // #CALLBACK		
		}
//		Start Animation for Slides	
		context
			.css({textIndent:0})
			.animate({textIndent:100}, {duration:opts.transitionSpeed, easing:opts.easing, complete:postAnimation , step:gS._animationStep})
	},
/*///////////////////////////////////////////////////////////////////////////////
*/
	_postActivate : function (data) {
		if(data.ai>=0)
			data.active.slides("_triggerCallback","postActivate"); // #CALLBACK
		greenishSlides._postDeactivate(data);
	},
/*///////////////////////////////////////////////////////////////////////////////
*/
	_postDeactivate : function (data) {
		var deactive=data.context.find("."+data.opts.classes.slide+"."+data.opts.classes.deactivating);
		if(deactive.length>0) {
			deactive.slides("_triggerCallback","postDeactivate"); // #CALLBACK
			deactive.removeClass(data.opts.classes.deactivating);
		}
	},
/*///////////////////////////////////////////////////////////////////////////////
*/
	_animationStep : function (state, obj) {
		try{
			var data = $(obj.elem).data("greenishSlidesData"); 
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
			greenishSlides._triggerCallback(data, "step"); // #CALLBACK _triggerCallback needs try/catch wrapper to run properly.
		}
		catch(err){
			$(this).stop();
			return;
		}
		for(i=0; slide=data.slides[i]; i++) slide.obj.css(newCss[i]);		
	},
/*///////////////////////////////////////////////////////////////////////////////
*/
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
/*///////////////////////////////////////////////////////////////////////////////
*/
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
			width:"auto",
			height:"100%",
			top:0,
			left:"auto"
		},
		gSVertical:{
			width:"100%",
			height:"auto",
			top:"auto",
			left:0
		},
		gSHorizontalActive:{
			right:0,
			left:0
		},
		gSVerticalActive:{
			top:0,
			bottom:0
		}
	}
////////////////////////////////////////////////////////////////////////////////
});
////////////////////////////////////////////////////////////////////////////////
})(jQuery);


