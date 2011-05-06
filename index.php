<!DOCTYPE html>
<html>
 	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>greenishSlides</title>
		<link rel="stylesheet" type="text/css" href="design.css">
		<script type="text/javascript" src="jquery-1.5.1.min.js"></script>
		<script type="text/javascript" src="jquery.greenishSlides-v0.1-beta.js"></script>

		<script type="text/javascript" src="jquery-ui-1.8.11.custom.min.js"></script>
		<script type="text/javascript" src="jquery.easing.1.3.js"></script>
<!--		<script type="text/javascript" src="jquery.jswipe-0.1.2.js"></script>-->
		<script type="text/javascript">
			(function($) {
				$(document).ready(function() {
					var preActivate=function(e){
							var slide=$(e.target);
								ai=slide.index();
							$(".vertical").each(function(){
								var slide = $(this).children().eq(ai);
								if(!slide.hasClass("active")) $.gS.activate(slide);								
							});
						},
						preDeactivate= function () {
							$(".vertical").each(function(){
								$.gS.deactivate($(".active",this));								
							});
							
						
						},
						config= {
							cache:false,
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
		<ul class="horizontal">
			<li>		
				<ul class="vertical">
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
						<li></li>
				</ul>
			</li>
		</ul>
	</body>
</html>
