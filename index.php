<!DOCTYPE html>
<html>
 	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>greenishSlides</title>
		<link rel="stylesheet" type="text/css" href="design.css">
		<script type="text/javascript" src="jquery-1.5.1.min.js"></script>
		<script type="text/javascript" src="jquery.greenishSlides-v0.1-beta.js"></script>

<!--		<script type="text/javascript" src="jquery.jswipe-0.1.2.js"></script>-->
		<script type="text/javascript">
			(function($) {
				$(document).ready(function() {
					var preActivate=function(){
							var slide=$(this);
								ai=slide.index();
							$(".vertical").each(function(){
								var slide = $(this).children().eq(ai);
								if(!slide.hasClass("active")) slide.greenishSlides("activate");
							});
						},
						preDeactivate= function () {
							$(".vertical").each(function(){
								$(".active",this).greenishSlides("deactivate");
							});
						},
						config= {
							cache:false,
							percentage:true,
							events: {
								activate:"click",
								deactivate:"click"
							},
							limits: {
								min:0
							},
						};
					
 					$(".horizontal").greenishSlides($.extend({},config,{	
 						vertical:false,
 						handle:".vertical"
					}));
					$(".vertical").greenishSlides($.extend({},config,{
						vertical:true,
						hooks:{
							preActivateEvent:preActivate,
							preDeactivateEvent:preDeactivate
						}
					}));	
				});
			})(jQuery);
		</script>		
	</head>
	<body>
	
<?php 
require_once("randomFlickr/randomFlickr.class.php");
$x = new randomFlickr();
$x->setBadgeUrl("http://www.flickr.com/photos/");
?>

		<ul class="horizontal">
			<li>		
				<ul class="vertical">
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php $x->fetch(); echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
				</ul>
			</li>
		</ul>
	</body>
</html>
