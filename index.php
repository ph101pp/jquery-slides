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
							console.log(e);
							return false;
							
							
							var slide=$(this);
								ai=slide.index();
								$(".vertical").each(function(){
									$.gS.activate($(this).children().eq(ai));								
								});
								
							return false;
						},
						config= {
							cache:true,
							events: {
								activate:"click",
								deactivate:"click"
							},
							limits: {
								min:20
							},
							hooks:{
								preActivate:preActivate
							}
						};
					
					
 					$(".horizontal").greenishSlides($.extend(config,{	
 						vertical:false
					}));
					$(".vertical").greenishSlides($.extend(config,{
						vertical:true
					}));	
				});
			})(jQuery);
		</script>		
	</head>
	<body>
		<ul class="horizontal">
			<li>		
				<ul class="vertical">
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
						<li><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
				</ul>
			</li>
		</ul>
	</body>
</html>
