#greenishSlides
This is a pretty flexible and customizable slideshow/accordion plugin for jQuery.
 It is inspired by the jQuery UI Accordion and Kwicks for jQuery.

##General

All child elements of the greenishSlides element will be turned into slides.
So the following:

	<script>
		jQuery(document).ready(function(){
			$("myElement").greenishSlides();
		});
	</script>

Will turn this:

	<ul class="myElement">
		<li></li>
		<li></li>
	</ul>

This:

	<div class="myElement">
		<div></div>
		<div></div>
	</div>

And also this: 

	<div class="myElement">
		<a></a>
		<div></div>
	</div>

Into a slider that will look like this:

	<ul class="myElement greenishSlides">
		<li class="gSSlide gSHorizontal/gSVertical [active] [positionActive] [top/left] [bottom/right]"></li>
		<li class="gSSlide gSHorizontal/gSVertical [active] [positionActive] [top/left] [bottom/right]"></li>
	</ul>

##Options