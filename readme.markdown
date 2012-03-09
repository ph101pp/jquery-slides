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
	<li class="gSSlide gSHorizontal/gSVertical [active] [positionActive] [top/left] [bottom/right]"></li>
	<li class="gSSlide gSHorizontal/gSVertical [active] [positionActive] [top/left] [bottom/right]"></li>
</ul>
```


##Options

Options can be set or changed at any time by passing an object to the greenishSlides function:

``` javascript
$(".myElement").greenishSlides({
		vertical:false,
		keyEvents:true,
		stayOpen:false
	});
```

Possible Options:

``` javascript
stayOpen				boolean				Default: false
```

If __true__ the there is always one active slide. So no deactivation is possible.

-------------------------