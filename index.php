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
 					$(".greenishSlides1").greenishSlides({	
 						stayOpen:false,
 						keyEvents:true,
 						circle:true,
 						active:false,
 						easing:"swing",
 						transitionSpeed:600,
 						vertical:false,
 						active:1,
 						cache:false,
 						handle:"img",
						events: {
							activate:"click",
							deactivate:"click"
						},
 						limits:{
 							min:20
 						},
 						classes:{
 							active:"bla",
 							horizontal:"blub",
 							slide:"loveit"
 						}
 					});
					
					$(window).resize(function () {
//						$.gS.update($(".greenishSlides"));
					});
 				$(".greenishSlides2").greenishSlides({stayOpen:false});	
				});
			})(jQuery);
		</script>		
	</head>
	<body>
		<ul class="greenishSlides1" id="greenishSlides1">
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
		</ul>
		<ul class="greenishSlides2" id="greenishSlides2">
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
		</ul>
	</body>
</html>
