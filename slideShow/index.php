<!DOCTYPE html>
<html>
 	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>greenishSlides</title>
		<link rel="stylesheet" type="text/css" href="design.css">
		<script type="text/javascript" src="../libs/jquery-1.5.1.min.js"></script>
		<script type="text/javascript" src="../greenishSlides/jquery.greenishSlides-v0.2-beta.js"></script>

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
							resizable:true,
							events: {
								activate:"click",
								deactivate:"click"
							}
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
require_once("../libs/randomFlickr/randomFlickr.class.php");
$x = new randomFlickr();
$x->setBadgeUrl("http://www.flickr.com/photos/");
$x->fetch(); 
?>
		<ul class="vertical">
				<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
				<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
				<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
				<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
				<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
		</ul>
	</body>
</html>
