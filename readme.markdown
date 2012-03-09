#jQuery Plugin: greenishSlides
This is a pretty flexible and customizable slideshow/accordion plugin for jQuery.

It is inspired by the jQuery UI Accordion and Kwicks for jQuery.

##General

All child elements of the greenishSlides element will be turned into slides.

So the following:


``` javascript
jQuery(document).ready(function(){
	$(".myElement").greenishSlides();
});
```

Will turn each one of these:

*	 	
	``` html
	<ul class="myElement">
		<li></li>
		<li></li>
	</ul>
	```

* 
	``` html
	<div class="myElement">
		<div></div>
		<div></div>
	</div>
	```

* 
	``` html
	<div class="myElement">
		<a></a>
		<div></div>
	</div>
	```

Into a slider that will look (in the first case: `<ul>`) like this:

``` html
<ul class="myElement greenishSlides">
	<li class="gsSlide gsHorizontal/gsVertical [active] [positionActive] [top/left] [bottom/right] [gsDeactivating]"></li>
	<li class="gsSlide gsHorizontal/gsVertical [active] [positionActive] [top/left] [bottom/right] [gsDeactivating]"></li>
</ul>
```


##Options

Options can be set or changed by passing an object to the greenishSlides function. This can be done on initialisation but also afterwards to change for example limits.

Here are all the possibile options (set to their default value):

``` javascript
$(".myElement").greenishSlides({
		stayOpen: false,
		resizable:false,
		vertical:false,
		transitionSpeed: 400,
		easing:"swing",
		events: {
			activate:"click",
			deactivate:"click"
		},
		keyEvents:false,
		circle : false,
		hooks : {},
		limits : {},
		active:false,
		classes:{
			active:"gsAactive",
			vertical:"gsVertical",
			horizontal:"gsHorizontal",
			slide:"gsSlide",
			deactivating:"gsDeactivating",
			positionActive:"gsPositionActive"
		},
		handle:".gsSlide",
		cache:false
	});
```
So and because these are the default values this equals:

``` javascript
$(".myElement").greenishSlides();
```


###Option Details

``` javascript
resizable						Boolean									Default: false
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
vertical						Boolean									Default: false
```

> Defines the orientation of the greenishSlides element.

-------------------------

``` javascript
transitionSpeed					Integer										Default: 400
```

> Defines the duration of the animations in milliseconds.

-------------------------

``` javascript
easing							String									Default: "swing"
```

> Defines what kind of easing algorythem should be used in the animations. Works with the jQuery easing plugin.

-------------------------

``` javascript
events: {						Object						
	activate					String									Default: "click"
	deactivate					String									Default: "click"
}
```

> Lets you define what browser events will trigger the activation/deactivation events of a slide.

-------------------------

``` javascript
handle: 						String	(jQuery Selector)				Default: ".gSSlide"
								Object	(jQuery Object)				
```

> Defines on which element the activation/deactivation events are bound.

-------------------------

``` javascript
stayOpen						Boolean									Default: false
```

> If __true__ the there is always one active slide. No deactivation is possible so none will be triggered.

-------------------------

``` javascript
keyEvents						Boolean									Default: false
```

> If __true__ the arrow keys can be used to move from one slide to the next. 

-------------------------

``` javascript
circle							Boolean									Default: false
```

> Defines if after the last slide follows the first when the "next" event is triggered.

-------------------------

``` javascript
active							Boolean							Default: false
								Object	(jQuery Object)				
								String	(jQuery Selector)				
								Integer	(Slide Index)				
```

> Defines the active Slide after initialisation.
> 
> __false__: No Slide or the first Slide (stayOpen) are active.
>
> __true__: The first Slide is active.
>
> 0 : The first Slide is active.
>
> -1 : The last Slide is active.

-------------------------