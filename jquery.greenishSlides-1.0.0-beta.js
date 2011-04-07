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
		queue:false
	},
////////////////////////////////////////////////////////////////////////////////
	init : function (context, opts) {
		context=$(context);
		var gS=$.gS,
			slides = context.css(gS.css.context).children().addClass("gSSlide").css(gS.css.gSSlide),
			setEvents;
		
		gS.timing("init" , "Start");
////	Extends defaults into opts.
		opts=this.opts=this.setOpts(context,opts);
		
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
////	Set hooks.
		$.each(opts.hooks,function(name,func) {
			context.bind(name, function (e, param1, param2){
				$.proxy(func, e.target)(param1, param2, e);
			});
		});
////	/Set hooks.
////	Keyboard and Swipe events.		
		if(opts.keyEvents) $(document).bind("keydown", function(event) {
			if(event.which == 39 || event.which == 40) gS.next(context);
			else if(event.which == 37 || event.which == 38) gS.prev(context);
		});
		
		if(opts.swipeEvents && typeof($().swipe)=="function") context.swipe({
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
		(setEvent=function(slide) {
			var slide= slide || $(context).find(opts.handle);
////		Define Activate Event
			$(slide).bind(opts.events.activate, function (event){
				if($(this).hasClass("active")) return;
				gS.activate($(this));
////			Define Deactivate Event
				if(!opts.stayOpen) {
					$(this).unbind(event);
					$(this).bind(opts.events.deactivate, function (event){
//						if(event.currentTarget!=event.fromElement) return;
						gS.deactivate($(this));
						$(this).unbind(event);
						setEvent($(this));
					});
				}
			});
		})();
		
////	First Initialisation	
		$(".active", context).length >0 ? 
			$(".active", context).eq(0).removeClass("active").trigger(opts.events.activate):
			gS.update(context);
		
		
		gS.timing("init" , "Done");
	},
	
	
////////////////////////////////////////////////////////////////////////////////
	activate : function (slide) {
		$.gS.timing("activate", "Start", true);
		var gS=$.gS,
			opts=gS.opts,
			deactivated;
		!slide.is(".gSSlide"+opts.handle)?
			slide=$(".gSSlide").has($(slide)):
			slide=$(slide);

		if(slide.hasClass("active")) return;
		if(!opts.stayOpen) slide.siblings(".active").trigger(opts.events.deactivate);
		else gS.deactivate(slide.siblings(".active"));
		
		deactivated =slide.siblings(".deactivated");
		if(deactivated.length > 0) {
			deactivated.removeClass("deactivated");
			slide.trigger("postDeactivate"); //hook
		}
		slide.addClass("active").trigger("preActivate"); // hook

		gS.update(slide.parent());
 	},
////////////////////////////////////////////////////////////////////////////////
 	deactivate : function (slide) {
		var gS=$.gS;
		!slide.is(".gSSlide"+gS.opts.handle)?
			slide=$(".gSSlide").has($(slide)):
			slide=$(slide);

		if(!slide.hasClass("active")) return;
		slide.removeClass("active").addClass("deactivated").trigger("preDeactivate"); // hook
		
		gS.update(slide.parent());
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
		var gS=$.gS,
			slides=$(context).children(),
			next;
		fromSlide=fromSlide || slides.filter(".gSSlide.active");
		if(slides.filter(fromSlide).length <= 0) return;
		next = $(fromSlide).index()+(parseFloat(number)%slides.length);
		
		if(next < 0) gS.opts.circle ? 
			next = slides.length+next:
			next = 0;
		else if(next>=slides.length) gS.opts.circle ? 
				next = next-slides.length: 
				next = slides.length-1;
				
		gS.activate(slides.eq(next));
	},
////////////////////////////////////////////////////////////////////////////////
	setOpts : function (context,opts) {
		var merged=$.extend(true,{},this.defaults, this.opts||{}, opts||{});
////	Remove cached data.	
		context=$(context);
		context.removeData("data");
////	Extends defaults into opts.
		context.data("data",{opts:merged});
		return merged;		
	},
////////////////////////////////////////////////////////////////////////////////
	cssFloat : function (context, value) {
		return parseFloat($(context).css(value).replace("px","")) || undefined;
	},
////////////////////////////////////////////////////////////////////////////////
	capitalize : function (word) {
		return word.charAt(0).toUpperCase() + word.slice(1);
	},
////////////////////////////////////////////////////////////////////////////////
	getData : function (context, opts) {
		$.gS.timing("update" , "Start",true);
		var gS=$.gS,
			slides=$(context).children(),
			count=slidesLength=slides.length,
			active = slides.filter(".gSSlide.active"),
			ai=active.index(),
			fullSize=cS=$(context)[opts.WoH](),
			alignLoT, posAct, newSize,
			data = [],
			limits ={},
			dcss={},
			skip={},
			c=0,i;
	
//		Get Data
		for(i=slidesLength-1; i >=0 ; i--) {
			data[i]={
				obj:slides.eq(i),
				dcss:{},
				css:{},
				active:i==ai?true:false
			};
			dcss[i]={};
			data[i].css[opts.WoH]=data[i].obj[opts.WoH]();
			data[i].css["min-"+opts.WoH]=gS.cssFloat(data[i].obj,"min-"+opts.WoH);
			data[i].css["max-"+opts.WoH]=gS.cssFloat(data[i].obj,"max-"+opts.WoH);
			limits[i]={
				max:data[i].css["max-"+opts.WoH] || 
				(opts.limits[i] ? opts.limits[i].max : false) || 
				opts.limits.max || undefined,
				
				min:data[i].css["min-"+opts.WoH] || 
				(opts.limits[i] ? opts.limits[i].min : false) || 
				opts.limits.min || 0			
			};
			i != ai ? 
				c+=dcss[i][opts.WoH]=limits[i].min:
				dcss[i][opts.WoH]=limits[i].max;
		};
		
		gS.timing("update" , "Got Data");

//		Calculate Width
		if(ai>=0 && (!limits[ai].max || limits[ai].max>cS-c)) 
			dcss[ai][opts.WoH] = cS-c;
		else {
			newSize=Math.ceil(fullSize/count);
			for(i=0; limit = limits[i]; i++) {
				hitMax=(limit.max<newSize);
				if(!skip[i] && (limit.min>newSize || hitMax || i==ai)){
					skip[i]=true;
					count--;
					hitMax || i==ai? 
						fullSize-=dcss[i][opts.WoH]=limit.max:
						fullSize-=limit.min;
					newSize=Math.ceil(fullSize/count);
					i=-1;
				}
			}
			for(i=0; i < slidesLength; i++) 
				if(!skip[i]) dcss[i][opts.WoH]=newSize;
		}
		gS.timing("update" , "Got Width");

//		Calculate Position
		alignLoT= data[ai] && data[ai].obj.css(opts.RoB)=="auto";		
		for(i=c=0; slide=data[i]; i++) {
			c+=dcss[i][opts.WoH];
			posAct = slide.obj.hasClass("posAct");
			if(true && i==ai && !opts.vertical) {
				alignLoT ?
					slide=gS.positioning(context,  slide, opts.LoT, true):
					slide=gS.positioning(context,  slide, opts.RoB, true);
				
				dcss[i]["margin-"+opts.LoT]=c-dcss[i][opts.WoH];
				dcss[i]["margin-"+opts.RoB]=cS-c;
			}
			else if((i<ai) || ai<0 || (alignLoT && ai==i)){
				if(!slide.obj.hasClass(opts.LoT) || posAct) 
					slide=gS.positioning(context,  slide, opts.LoT);

				slide.align=opts.LoT;
				slide.css[opts.LoT]=gS.cssFloat(slide.obj, opts.LoT);
				dcss[i][opts.LoT]=c-dcss[i][opts.WoH];
			}
			else {
				if(!slide.obj.hasClass(opts.RoB) || posAct)  
					slide=gS.positioning(context, slide, opts.RoB);
				
				slide.align=opts.RoB;
				slide.css[opts.RoB]=gS.cssFloat(slide.obj, opts.RoB);
				dcss[i][opts.RoB]=cS-c;
			}
			slide.dcss=dcss[i];
		}
		gS.timing("update" , "Got Position");
		return data;
		
	},
////////////////////////////////////////////////////////////////////////////////
	positioning : function (context, data, bind, active) {
		$.gS.timing("positioning" , "Start",true);
		var gS=$.gS,
			opts=gS.opts,
			p = data.obj.position(),
			from = bind==opts.LoT ? opts.RoB : opts.LoT,
			cS = $(context)["inner"+gS.capitalize(opts.WoH)](),
			oS = data.obj["outer"+gS.capitalize(opts.WoH)]();

		if(active) {
			css={zIndex:0, position:"relative"};
			css[opts.WoH]="auto";
			css["margin-"+opts.LoT]=p[opts.LoT];
			css["margin-"+opts.RoB]=cS-p[opts.LoT]-oS;
			data.css["margin-"+opts.LoT]=css["margin-"+opts.LoT];
			data.css["margin-"+opts.RoB]=css["margin-"+opts.RoB];
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
			css["margin-"+opts.LoT]=0;
			css["margin-"+opts.RoB]=0;
			data.css[opts.WoH]=css[opts.WoH]=oS;
			data.css[bind]=css[bind];
			data.css[from]="auto";
			data.obj.removeClass("posAct");
		}
		css[from]="auto";
		data.obj.removeClass(from).addClass(bind).css(css);


		$.gS.timing("positioning" , "done");

		return data;
	},
////////////////////////////////////////////////////////////////////////////////
	update : function (context, opts) {
		context=$(context).stop();
		var gS=$.gS,
			slides=$(context).children(),
			active = slides.filter(".gSSlide.active"),
			ai = active.index(),
			postAnimation,
			storedData=context.data("data") || {},
			data;
	
		this.opts=opts=opts || !storedData.opts?
			$.gS.setOpts(opts):
			storedData.opts;
		
		data= gS.getData(context, opts);


	
//		Set hooks for either Activation or Deactivation.
		if(active.length <=0) {
			active.trigger("preDeactivateAnimation", data); // hook
			postAnimation = function () {
				var deactive=$(this).find(".gSSlide.deactivated");
				if(deactive.length>0) {
					deactive.trigger("postDeactivate"); // hook
					deactive.removeClass("deactivated");
				}
			}
		}
		else {  
			active.trigger("preActivateAnimation", data); // hook
			postAnimation = function () {
				var active=$(this).find(".gSSlide.active");
				if(active.length>0) {
					active.trigger("postActivate"); // hook
					if(!opts.vertical) active.css({width:"auto"});
				}
			}
		}

//		Store Data for the animation function
		context.data("data", {
			animation:data,
			opts:opts,
			cS:storedData.cS || $(context)[opts.WoH]()		
		});
		
		
//		Start Animation for Slides		
		context
			.dequeue("gSpreAnimation") // hook: custom queue that runs before the animation
			.css({textIndent:0})
			.animate({textIndent:100}, {duration:opts.transitionSpeed, easing:opts.easing, complete:postAnimation , step:gS.animation})
			.dequeue("gSpostAnimation"); // hook: custom queue that runs after the animation
	},
////////////////////////////////////////////////////////////////////////////////
	animation : function (state, obj) {
		$.gS.timing("step","start",true)
		var info= $(obj.elem).dequeue("gSanimationStep").data("data"), // hook: custom queue that runs once on every step of the animation (MAKE IT FAST!)
			opts=info.opts,
			data=info.animation,
			css={},
			slide, k, i, ai,
			calc=function(i, key) {
				return Math.round(data[i].css[key]+((data[i].dcss[key]-data[i].css[key])*(state[i] || state)));
			},
			getPosition = function(i, align) {
				return css[i] ? css[i][align]+css[i][opts.WoH] : 0;
			};
		
		if(false &&opts.queue) {
			done = parseInt(state/data.length);
			pos= state%data.length;
			state={}
			for(i=data.length-1; i>=0; i--) {
				if(i<=done) state[i]=1;
				else if(i==done+1) state[i]=pos/100;
				else state[i]=0;
			}
		}
		else state/=100;
		
//		Set Position
		for(i=data.length-1; slide=data[i]; i--) {
			css[i]={};
			if(!slide.active) {
				slide.css[slide.align] = slide.css[slide.align] || 0;
				css[i][slide.align]=calc(i, slide.align);
			}
			else ai=i;
		};
//		Set Width
		for(i=data.length-1; slide=data[i]; i--) if(!slide.active) {
			slide.align == opts.LoT ? k=i+1 : k=i-1;
			data[k] && !data[k].active ? 
				css[i][opts.WoH] = css[k][slide.align]-css[i][slide.align]:
				css[i][opts.WoH] = calc(i,opts.WoH);
			slide.obj.css(css[i]);		
		}
//		Set Active
		if(css[ai]) {
			if(!opts.vertical) {
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
			overflow:"hidden",
			zoom:1,
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


