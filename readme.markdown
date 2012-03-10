#jQuery Plugin: greenishSlides
This is a pretty flexible and customizable slideshow/accordion plugin for jQuery.

It is inspired by the jQuery UI Accordion and Kwicks for jQuery.
	
1.	General
----------------

	All child elements of the greenishSlides element will be turned into slides.
	
	So the following:
	
	
	``` javascript
	jQuery(document).ready(function(){
		$(".myElement").greenishSlides();
	});
	```
	
	Will turn each one of these:
	
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
	
	Into a slider that will look (in the first case: `<ul>`) like this:
	
	``` html
	<ul class="myElement greenishSlides">
		<li class="gsSlide gsHorizontal/gsVertical [gsActive] [gsPositionActive] [top/left] [bottom/right] [gsDeactivating]"></li>
		<li class="gsSlide gsHorizontal/gsVertical [gsActive] [gsPositionActive] [top/left] [bottom/right] [gsDeactivating]"></li>
	</ul>
	```
	
1.	Methods
----------------
	
	``` javascript
	$(".myElement").greenishSlides([Object options]);				
	```
	
	> ####Initialize / Update Options
	>
	> Initialize the greenishSlides plugin on a set of HTML Elements.
	>
	> Optional you cann pass an object with options (see below) to the function.
	>
	> Also you can change options with this at any time after initialisation.
	
	-------------------------
		
	``` javascript
	$(".myElement").find(".mySlide").greenishSlides("activate");				
	```
	
	> #### Activate Slide
	>
	> Activates the slide this method is called on.
	
	-------------------------

	``` javascript
	$(".myElement").find(".mySlide").greenishSlides("deactivate");				
	```
	
	> #### Deactivate Slide
	>
	> Deactivates the slide this method is called on.
	
	-------------------------
				
	``` javascript
	$(".myElement").greenishSlides("update");				
	```
	
	> #### Update Slide Positions.
	>
	> Updates the position of all slides. 
	>
	> Needs to be called adding a new slide or after a resize happened without the resize option enabled.	
	
	-------------------------
	
	``` javascript
	$(".myElement").greenishSlides("next", [Integer goFromSlideId]);				
	```	
	> #### Activates Next Slide.
	>
	> Activates the next slide to the left/bottom of the active slide.
	> Optionaly you can pass the index of a slide to take its next. 	
	
	-------------------------
		
	``` javascript
	$(".myElement").greenishSlides("prev", [Integer goFromSlideId]);				
	```
	
	> #### Activates Previous Slide.
	>
	> Activates the next slide to the right/top of the active slide.
	> Optionaly you can pass the index of a slide to take its previous.
	
	-------------------------
		
	``` javascript
	$(".myElement").greenishSlides("bindHook", Function);				
	```
	
	> #### Bind a Hook/Event/Callback
	>
	> Registers or binds a function to a certain hook (see below). 

	-------------------------
			
	``` javascript
	$(".myElement").greenishSlides("clearCache");				
	```
	
	> #### Clear Cache
	>
	> Removes all cached informations. (Caching can be enabled by option).
	
	-------------------------	
	
1.	Options
----------------
	
	Options can be set or changed by passing an object to the greenishSlides function. This can be done on initialisation or afterwards to change any value (for example limits).
	
	Here are all the possibile options (set to their __default values__):
	
	``` javascript
	$(".myElement").greenishSlides({
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
			hooks : {}
		});
	```
	
	###Option Details
	
	``` javascript
	vertical:						Boolean									Default: false
	```
	
	> Defines the orientation of the greenishSlides element.
	
	-------------------------

	``` javascript
	resizable:						Boolean									Default: false
	```
	
	> Defines if the greenishSlides element can be resized on runtime. 
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
	hooks: {																	Default: {}
		"hookName":					Function(callback function)
									Object	(multiple callback functions)
									Array	(multiple callback functions)	
	}	
	```
	
	> Allows register hooks during initialisation. 
	>
	> To learn more about the available hooks look at the Hooks/Events/Callbacks chapter below.
	
	-------------------------

1.	Hooks/Events/Callbacks
----------------