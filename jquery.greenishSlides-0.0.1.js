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
		comment=comment||"";
		var timer = new Date()
		$.gS.timer[key] = $.gS.timer[key]|| new Date();
				
		var time = timer - $.gS.timer[key];
		
		$.gS.timer[key]=timer;
		if(false && !hide) {
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
		queue:true
	},
////////////////////////////////////////////////////////////////////////////////
	init : function (context, opts) {
		context=$(context);
		var gS=$.gS,
			slides = context.css(gS.css.context).children().addClass("gSSlide").css(gS.css.gSSlide);
		
		gS.timing("init" , "Start");
////	Extends defaults into opts.
		this.opts=this.setOpts(opts);
		
////	Sets css and classes
		if(gS.opts.vertical) {
			slides.addClass("gSVertical").css(gS.css.gSVertical);
			$.extend(gS.opts, gS.orientation.vertical)
		}
		else {
			slides.addClass("gSHorizontal").css(gS.css.gSHorizontal);
			$.extend(gS.opts, gS.orientation.horizontal)
		}
////	/Sets css and classes
////	Set hooks.
		$.each(this.opts.hooks,function(name,func) {
			context.bind(name, function (e, param1, param2){
				$.proxy(func, e.target)(param1, param2, e);
			});
		});
////	/Set hooks.
////	Keyboard and Swipe events.		
		if(gS.opts.keyEvents) $(document).bind("keydown", function(event) {
			if(event.which == 39 || event.which == 40) gS.next(context);
			else if(event.which == 37 || event.which == 38) gS.prev(context);
		});
		
		if(gS.opts.swipeEvents && typeof($().swipe)=="function") context.swipe({
			threshold: gS.opts.swipeThreshold,
			swipeLeft: function(){gS.next(context)},
			swipeRight: function(){gS.prev(context)}
		});
////	/Keyboard and Swipe events.

////	Define hover
		if(gS.defaults.hover.mouseover!=gS.opts.hover.mouseover || gS.defaults.hover.mouseout!=gS.opts.hover.mouseout)
			$(gS.opts.handle).live("mouseover mouseout", function(event) {
				var context=$(this);
				if(gS.defaults.handle!=gS.opts.handle) context=$(".gSSlide").has(context);

				event.type == "mouseover" ? 
					$.proxy(gS.opts.hover.mouseover, context)(): 
					$.proxy(gS.opts.hover.mouseout, context)();
			});

////	Define Activate Event
		$(gS.opts.handle).bind(gS.opts.events.activate, function (event){
			gS.activate($(this));
		});
////	Define Deactivate Event
		if(!gS.opts.stayOpen) $(gS.opts.handle).bind(gS.opts.events.deactivate, function (event){
			gS.deactivate($(this));
		});
		
////	First Initialisation	
		$(".active", context) ? 
			gS.activate($(".active", context).eq(0).removeClass("active")):
			gS.setSlides(context);
		
		
		gS.timing("init" , "Done");
	},
	
	
////////////////////////////////////////////////////////////////////////////////
	setOpts : function (opts) {
////	Extends defaults into opts.
		return $.extend(true,{},this.defaults, this.opts||{}, opts||{});
	},
////////////////////////////////////////////////////////////////////////////////
	activate : function (slide) {
		var gS=$.gS;
		gS.timing("activate", "Start", true);
		gS.timing("activation" , "Start");
		gS.defaults.handle!=gS.opts.handle && !slide.hasClass("gSSlide")?
			slide=$(".gSSlide").has($(slide)):
			slide=$(slide);

		if(slide.hasClass("active")) return;
		slide.siblings().removeClass("active");
		
		var deactivated=slide.siblings(".deactivated");
		if(deactivated.length > 0) {
			deactivated.removeClass("deactivated");
			slide.trigger("postDeactivate"); //hook
		}
		gS.timing("activate" , "prehook");
		slide.addClass("active").trigger("preActivate"); // hook
		
		gS.timing("activate" , "activate");
		
		gS.setSlides(slide.parent());
 	},
////////////////////////////////////////////////////////////////////////////////
 	deactivate : function (slide) {
		var gS=$.gS;
		gS.defaults.handle!=gS.opts.handle && !slide.hasClass("gSSlide")?
			slide=$(".gSSlide").has($(slide)):
			slide=$(slide);

		if(!slide.hasClass("active")) return;
		slide.removeClass("active").addClass("deactivated").trigger("preDeactivate"); // hook
		
		gS.setSlides(slide.parent());
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
			slides=$(context).children();
		fromSlide=fromSlide || slides.filter(".gSSlide.active");
		if(slides.filter(fromSlide).length <= 0) return;
		var next = $(fromSlide).index()+(parseFloat(number)%slides.length);
		
		if(next < 0) gS.opts.circle ? 
			next = slides.length+next:
			next = 0;
		else if(next>=slides.length) gS.opts.circle ? 
				next = next-slides.length: 
				next = slides.length-1;
				
		gS.activate(slides.eq(next));
	},
////////////////////////////////////////////////////////////////////////////////
	cssFloat : function (context, value) {
		return parseFloat($(context).css(value).replace("px","")) || undefined;
	},
	capitalize : function (word) {
		return word.charAt(0).toUpperCase() + word.slice(1);
	},
////////////////////////////////////////////////////////////////////////////////
	getCSS : function (context) {
		$.gS.timing("getCSS" , "Start",true);
		
		var gS=$.gS,
			opts=gS.opts,
			slides=$(context).children(),
			count=slidesLength=slides.length,
			ai=slides.filter(".gSSlide.active").index(),
			fullSize=cS=$(context)[opts.WoH](),
			alignLoT, posAct, newSize,
			data = [],
			limits ={},
			dcss={},
			skip={},
			c=0;


//		Get Data
		for(var i=slidesLength-1; i >=0 ; i--) {
			data[i]={
				obj:slides.eq(i),
				dcss:{},
				css:{},
				active:false
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
		
		gS.timing("getCSS" , "GetData");

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
			for(var i=0; i < slidesLength; i++) 
				if(!skip[i]) dcss[i][opts.WoH]=newSize;
		}
		gS.timing("getCSS" , "Got Width");

//		Calculate Position
		alignLoT= data[ai].obj.css(opts.RoB)=="auto";		
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
				if(!slide.obj.hasClass("left") || posAct) 
					slide=gS.positioning(context,  slide, opts.LoT);

				slide.align=opts.LoT;
				slide.css[opts.LoT]=gS.cssFloat(slide.obj, opts.LoT);
				dcss[i][opts.LoT]=c-dcss[i][opts.WoH];
			}
			else {
				if(!slide.obj.hasClass("right") || posAct)  
					slide=gS.positioning(context, slide, opts.RoB);
				
				slide.align=opts.RoB;
				slide.css[opts.RoB]=gS.cssFloat(slide.obj, opts.RoB);
				dcss[i][opts.RoB]=cS-c;
			}
			slide.dcss=dcss[i];
		}
		gS.timing("getCSS" , "Got Position");
		return data;
	},
////////////////////////////////////////////////////////////////////////////////
	positioning : function (context, data, bind, active) {
		$.gS.timing("positioning" , "Start",true);
		var gS=$.gS,
			opts=gS.opts,
			p = data.obj.offset(),
			from = bind==opts.LoT ? opts.RoB : opts.LoT,
			cS = $(context)["inner"+gS.capitalize(opts.WoH)](),
			oS = data.obj["outer"+gS.capitalize(opts.WoH)]();

		if(active) {
			css={zIndex:0, position:"relative"};
			css[opts.WoH]="auto";
			data.css["margin-"+opts.LoT]=css["margin-"+opts.LoT]=p[opts.LoT];
			data.css["margin-"+opts.RoB]=css["margin-"+opts.RoB]=cS-p[opts.LoT]-oS;
			css[bind]=0;
			data.obj.addClass("posAct");
			data.active=true;
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
	setSlides : function (context, opts) {

		$.gS.timing("setSlides" , "start", true);

		context=$(context).stop();
		var slides=$(".gSSlide", context),
			gS=$.gS,
			opts=gS.setOpts(opts),
			active = $(".active.gSSlide", context),
			data=gS.getCSS(context);

		
		this.data = {
			queue:opts.queue,
			ai:active.index(),
			animation:data,
			cS:$(context)[opts.WoH]()
		}
		
		
		context.data("data", this);
		
		$.gS.timing("setSlides","gotCSS");

//		check if deactivation or activation and sets hooks.
		if(active.length <=0) {
			active.trigger("preDeactivateAnimation", data); // hook
			var postAnimation = function () {
				var deactive=$(this).find(".gSSlide.deactivated");
				if(deactive.length>0) {
					deactive.trigger("postDeactivate"); // hook
					deactive.removeClass("deactivated");
				}
			}
		}
		else {  
			active.trigger("preActivateAnimation", data); // hook
			var postAnimation = function () {
				var active=$(this).find(".gSSlide.active");
				if(active.length>0) {
					active.trigger("postActivate"); // hook
					if(!opts.vertical) active.css({width:"auto"});
				}
			}
		}

		$.gS.timing("setSlides","preanimation");

//		each slide gets animated			
		context
			.dequeue("gSpre") // "hook" custom queue that runs before the animation
			.css({textIndent:0})
			.animate({textIndent:100}, {duration:opts.transitionSpeed, easing:opts.easing, complete:postAnimation , step:gS.animation})
			.dequeue("gSpost"); // "hook" custom queue that runs after the animation

		$.gS.timing("setSlides","done");
		$.gS.timing("activation" , "Activation");

 	},
////////////////////////////////////////////////////////////////////////////////
	animation : function (state, obj) {
		$.gS.timing("step","start",true)
		var context=$(obj.elem),
			info= context.data("data"),
			opts=info.opts,
			data=info.data.animation,
			css={},
			ai=info.data.ai,
			key, slide, k;
		
		percent=state/100;
		
		
		if(false || false && state==100) {
			for(var i=data.length-1; i>=0; i--) {
				slide=data[i];
				css={};
				for(key in slide.dcss) {
					slide.css[key] = slide.css[key] || 0;
					css[key]=slide.css[key]+((slide.dcss[key]-slide.css[key])*percent)
				}
				slide.obj.css(css);		
			};
		}
		else if(false) {		
			for(var i=data.length-1; i>ai && ai>0; i--) {
				slide=data[i];
				css[i]={};
				prev=css[i+1];
				css[i]["width"]=slide.css["width"]+((slide.dcss["width"]-slide.css["width"])*percent);
				
				if(prev) css[i]["right"]=prev["right"]+prev["width"];
				else css[i]["right"]=0;
				
				slide.obj.css(css[i]);		
			};
			for(i=0; i<ai  || (ai<=0 && i<data.length); i++){
				slide=data[i];
				css[i]={};
				prev=css[i-1];
				css[i]["width"]=slide.css["width"]+((slide.dcss["width"]-slide.css["width"])*percent);
				
				if(prev) css[i]["left"]=prev["left"]+prev["width"];
				else css[i]["left"]=0;
				
				if(i!=ai) slide.obj.css(css[i]);		
			};
			
			css[ai]={}
			if(css[ai+1]) css[ai]["margin-right"]=css[ai+1]["right"]+css[ai+1]["width"];
			else css[ai]["margin-right"]=0;
			if(css[ai-1]) css[ai]["margin-left"]=css[ai-1]["left"]+css[ai-1]["width"];
			else css[ai]["margin-left"]=0;
			data[ai].obj.css(css[ai]);		
		}
		else {
			for(i=data.length-1; i>=0; i--) {
				slide=data[i];
				css[i]={};
				
				if(slide.active) {
					css[i]["margin-"+opts.LoT]=slide.css["margin-"+opts.LoT]+((slide.dcss["margin-"+opts.LoT]-slide.css["margin-"+opts.LoT])*percent);
					css[i]["margin-"+opts.RoB]=slide.css["margin-"+opts.RoB]+((slide.dcss["margin-"+opts.RoB]-slide.css["margin-"+opts.RoB])*percent);
				}
				else {
					slide.css[slide.align] = slide.css[slide.align] || 0;
					css[i][slide.align]=slide.css[slide.align]+((slide.dcss[slide.align]-slide.css[slide.align])*percent);
				}
			};
			for(i=data.length-1; i>=0; i--) {
				slide=data[i];
				slide.align == opts.LoT ? k=i+1 : k=i-1;

				if(!slide.active) {
					if(data[k].active) css[i][opts.WoH] =css[k]["margin-"+slide.align]-css[i][slide.align];
					else css[i][opts.WoH] = css[k][slide.align]-css[i][slide.align];
				}

				slide.obj.css(css[i]);		
			}
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
			zoom:1
		},
		gSSlide : {
			position:"absolute",
			margin:0,
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


