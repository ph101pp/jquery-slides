#jQuery Slides plugin

A pretty flexible and highly customizable slideshow/accordion plugin for jQuery.

This plugin is inspired by the [jQuery UI Accordion](http://jqueryui.com/demos/accordion/) and [Kwicks for Mootools](http://davidwalsh.name/mootools-kwicks) / [Kwicks for jQuery](http://www.jeremymartin.name/projects.php?project=kwicks).

The main reason to start to develop this plugin where a certain set of specifications and customizaitions I needed for [The Book in Motion](http://thebookinmotion.greenish.ch) website i've been developing, that none of the above where quite offering. 

----------------

So here are these specifications and features that this plugin provides - plus some others (I kinda got into it):

* The Slideshow is resizable without javascript -> so no jittering even when using a fullscreen slideshow.
* There are NO gaps and spaces between the slides during the animation.
* Limits (max-/min-width) can be set for all slides but also for one single slide (or two).
* The plugin doesn't require a predefined markup like an unordered list or h3 headers and divs.. it just takes what it gets.
* You can mess around with the css on runtime and the plugin still finds the proper position for each slide when its next event is triggered.
* Lots of options to turn things on and off..
* And a lots of callbacks and events that allow to customize, extend and manipulate the plugins behaviour to make it really flexible. Also its easy to add new callbacks where they're needed.
* Fully browser compatible: IE 7.0+ (haven't tested on IE6 - screw it!), Firefox 3+, Safari 3.1+, Opera 9.6+ and Google Chrome.

----------------

So as said above, this plugin has been developed for [The Book in Motion](http://thebookinmotion.com) website and this website is probably the best way to see what this plugin is capable of.

Also it's used on the frontpage of the [City University of New York - Graduate Center](http://www.gc.cuny.edu) as well as image gallery on some subpages.

What follows here is FINALLY the documentation of the plugin. It's been a lot of work that went into it and I'm very happy to finally make it available for everybody.

I'm happy for any feedback, suggestions and bug reports (well not happy, but grateful in the last case :) )

__And when you come to use the plugin: SHOW ME! I would love to see what you're doing with it!__

#Documentation

1.	General
----------------
	
To start off, get the newest version of the jQuery Slides plugin from Github and move it into your project folder.

Include the file into your HTML and you're ready to go:

``` javascript
jQuery(document).ready(function(){
	$(".myElement").slides();
});
```

All child elements of _.myElement_ element will be turned into slides.

So the code above will turn each one of these:

``` html
<ul class="myElement">
	<li></li>
	<li></li>
</ul>
```
``` html
<div class="myElement">
	<div></div>
	<div></div>
</div>
```

``` html
<div class="myElement">
	<a></a>
	<div></div>
</div>
```

Into a slideshow that's markup will look (in the first case: `<ul>`) like this:

``` html
<ul class="myElement greenishSlides">
	<li class="gsSlide gsHorizontal/gsVertical [gsActive] [gsPositionActive] [top/left] [bottom/right] [gsDeactivating]"></li>
	<li class="gsSlide gsHorizontal/gsVertical [gsActive] [gsPositionActive] [top/left] [bottom/right] [gsDeactivating]"></li>
</ul>
```
	
2.	Methods
----------------
	
``` javascript
$(".myElement").slides([Object options]);				
```

> ####Initialize / Update Options
>
> Initialize the jQuery Slides plugin on a set of HTML Elements.
>
> Optional you cann pass an object with options (see below) to the function.
>
> Also you can change options with this at any time after initialisation.

-------------------------
	
``` javascript
$(".mySlide",".myElement").slides("activate");				
```

> #### Activate Slide
>
> Activates the slide this method is called on.

-------------------------

``` javascript
$(".mySlide", ".myElement").slides("deactivate");				
```

> #### Deactivate Slide
>
> Deactivates the slide this method is called on.

-------------------------
			
``` javascript
$(".myElement").slides("update");				
```

> #### Update Slide Positions.
>
> Updates the position of all slides. 
>
> Needs to be called adding a new slide or after a resize happened without the resize option enabled.	

-------------------------

``` javascript
$(".myElement").slides("next", [Integer goFromSlideId]);				
```	
> #### Activates Next Slide.
>
> Activates the next slide to the left/bottom of the active slide.
> Optionaly you can pass the index of a slide to take its next. 	

-------------------------
	
``` javascript
$(".myElement").slides("prev", [Integer goFromSlideId]);				
```

> #### Activates Previous Slide.
>
> Activates the next slide to the right/top of the active slide.
> Optionaly you can pass the index of a slide to take its previous.

-------------------------
	
``` javascript
$(".myElement").slides("bindCallback", Function);				
```

> #### Bind a Callback/Event
>
> Registers or binds a callback function to a certain event. (see below). 

-------------------------
		
``` javascript
$(".myElement").slides("clearCache");				
```

> #### Clear Cache
>
> Removes all cached informations. (Caching can be enabled by option).

-------------------------	

3.	Options
----------------

Options can be set or changed by passing an object to the slides() function. This can be done on initialisation or afterwards to change any value (for example limits).

Here are all the possibile options (set to their __default values__):

``` javascript
$(".myElement").slides({
		vertical:false,
		resizable:false,
		active:false,
		transitionSpeed: 400,
		easing:"swing",
		events: {
			activate:"click",
			deactivate:"click"
		},
		handle:".gsSlide",
		stayOpen: false,
		keyEvents:false,
		circle : false,
		classes:{
			active:"gsAactive",
			vertical:"gsVertical",
			horizontal:"gsHorizontal",
			slide:"gsSlide",
			deactivating:"gsDeactivating",
			positionActive:"gsPositionActive"
		},
		cache:false,
		limits : {},
		callbacks : {}
	});
```

###Option Details

``` javascript
vertical:						Boolean									Default: false
```

> Defines the orientation of the Slides element.

-------------------------

``` javascript
resizable:						Boolean									Default: false
```

> Defines if the Slides element can be resized on runtime. 
> 
> If __true__ slides on the left side of the active slide will be positioned differently from the ones on the right, to allow resizing without javascript.
> 
> Still if there are limits set to any slide, resizing may need an event handler that will also be set if necessary.
> 
> Be aware that this needs some extra calculations and (more important) some DOM changes which will influence the performance so only switch this on if you really need it.

-------------------------
	
``` javascript
active:							Boolean									Default: false
								Object	(jQuery Object)				
								String	(jQuery Selector)				
								Integer	(Slide Index)				
```

> Defines the active Slide after initialisation.
> 
> __false__: No Slide (or the first Slide if stayOpen:true) is active.
>
> __true__: The first Slide is active.
>
> __0__ : The first Slide is active.
>
> __-1__ : The last Slide is active.

-------------------------

``` javascript
transitionSpeed:				Integer	(ms)							Default: 400
```

> Defines the duration of the animations in milliseconds.

-------------------------

``` javascript
easing:							String									Default: "swing"
```

> Defines what kind of easing algorythem should be used in the animations. Works with the jQuery easing plugin.

-------------------------

``` javascript
events: {												
	activate:					String									Default: "click"
	deactivate:					String									Default: "click"
}
```

> Lets you define what browser events will trigger the activation/deactivation events of a slide.

-------------------------

``` javascript
handle:	 						String	(jQuery Selector)				Default: ".gSSlide"
								Object	(jQuery Object)				
```

> Defines on which element the activation/deactivation events are bound.

-------------------------

``` javascript
stayOpen:						Boolean									Default: false
```

> If __true__ the there is always one active slide. No deactivation is possible so none will be triggered.

-------------------------

``` javascript
keyEvents:						Boolean									Default: false
```

> If __true__ the arrow keys can be used to move from one slide to the next. 

-------------------------

``` javascript
circle:							Boolean									Default: false
```

> Defines if after the last slide follows the first when the "next" event is triggered.

-------------------------

``` javascript
classes: {												
	active:						String									Default: "gsActive"
	vertical:					String									Default: "gsVertical"
	horizontal:					String									Default: "gsHorizontal"
	slide:						String									Default: "gsSlide"
	deactivating:				String									Default: "gsDeactivating"
	positionActive:				String									Default: "gsPositionActive"
}
```

> Lets you customize the css classes that are set by the plugin.

-------------------------

``` javascript
cache:							Boolean									Default: false
```

> Enables the caching functionality. Caches certain valus and calucalation. Use this if there are no runtime changes at all (no resizing, adding of slides etc.)
>
> To be honest I kind of expected more of a speed improvement from this than it actually does.. so its usefulness is questionable.. but it does definitely no harm so why not use it.

-------------------------

``` javascript
limits:	{																Default: {}
	min:						Integer	(px)
								String
	max:						Integer (px)
								String
	0: {
		min:					Integer	(px)
								String
		max:					Integer	(px)
								String
	}							
	"-1": {
		min:					Integer	(px)
								String
		max:					Integer	(px)
								String
	}	
}
```

> This allows you to set a minimum height/width and a maximum height/width (in px) for all slides or a single slide.
>
> __limits.min__: Sets a min width/height for every slide. So no slide can be smaller than i.e. 20px
>
> __limits[0].min__: Sets a min width/height for the first slide.
>
> __limits[-1].min__: Sets a min width/height for the last slide.
>
> All min/max definitions are optional and can be combined in any ways possible.
>
> Limits can also be set by css with min-width, max-width, min-height, max-height. Css limits always override limits that where set in the options. Also, limits for one single slide override the limits set for all slides.
>
> __min-width > limits[0].min > limits.min__
>
> Because min-width doesn't have a default like _none_, __0px is handled as undefined__ and limits[0].min will be used instead. To define __"min-width:0px" use 0%__ which will then override limits[0].min.

-------------------------	

``` javascript
callbacks: {																Default: {}
	"callbackName":				Function(callback function)
								Object	(multiple callback functions)
								Array	(multiple callback functions)	
}	
```

> Allows to register callback functions during initialisation. 
>
> To learn more about the available callbacks look at the Callbacks/Events chapter below.

-------------------------

4.	Callbacks/Events
----------------

During the runtime of the plugin a bunch of callbacks are fired. 

Callbacks can be registered by adding the functions to the options object or by calling the "bindCallback" method.

Every callback function receives the _data_ object as first parameter while the following parameters can change.

By returning __false__ in the callback the pluging cancels the current event and stopps its action. 

This is a list of all the callbacks that are available at the moment (to find them in the code search for _#CALLBACK_):

``` javascript
"preInit"						function(data)					Context: $(".myElement")
```

> Called on initialisation before anything else is done.

-------------------------

``` javascript
"init"							function(data)					Context: $(".myElement")
```

> Called on initialisation after all the classes and styles are set.

-------------------------

``` javascript
"postInit"						function(data)					Context: $(".myElement")
```

> Called after the initialisation is complete.

-------------------------

``` javascript
"activateEvent"					function(data)					Context: Slide Handle
```

> Called every time the activation event is triggered.

-------------------------

``` javascript
"deactivateEvent"				function(data)					Context: Slide Handle
```

> Called every time the deactivation event is triggered.

-------------------------

``` javascript	
"preActivate"					function(data)					Context: $(".mySlide", ".myElement")
```

> Called before a slide is activated.

-------------------------

``` javascript
"preDeactivate"					function(data)					Context: $(".mySlide", ".myElement")
```

> Called before a slide is deactivated.

-------------------------

``` javascript
"preUpdate"						function(data)					Context: $(".active", ".myElement")
```

> Called before all slides are updated

-------------------------

``` javascript
"preActivateAnimation"			function(data)					Context: $(".myElement")
"preDeactivateAnimation"		function(data)					Context: $(".myElement")
"preUpdateAnimation"			function(data)					Context: $(".myElement")
```

> Called after all calculations are done just before the animation starts.

-------------------------

``` javascript	
"postActivate"					function(data)					Context: $(".active", ".myElement")
```

> Called after a slide is activated.

-------------------------

``` javascript
"postDeactivate"				function(data)					Context: Deactivated Slide
```

> Called after a slide is deactivated.

-------------------------

``` javascript
"postUpdate"					function(data)					Context: $(".active", ".myElement")
```

> Called after all slides are updated

-------------------------

``` javascript
"step"							function(data)					Context: $(".active", ".myElement")
```

> Called at every step of the animation function. 
>
>The _data_ object contains the current position of everyslide at that moment of the animation. 
>
>Also have a look at the _step_ callback of the jQuery animation function.

-------------------------

###Add New Callback

If you need a new callback that is missing, feel free to add it in the code!
Just put the following at the place you need the call:

``` javascript
[context].slides("_triggerCallback","myCallbackName" [,parameterOne, parameterTwo, ...]);
```

Notice that the new callback will come with all the features of the default ones:
* The _data_ object will always be passed as the first parameter. (And you can add as many additional parameters as you wish.)
* return __false__ will stop the further execution of the acutal event.

__When you added a new callback, tell me about it! So I can consider adding it to the default callbacks.__
