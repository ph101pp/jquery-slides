<!DOCTYPE html>
<html>
 	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>greenishSlides</title>
		<link rel="stylesheet" type="text/css" href="design.css">
		<script type="text/javascript" src="jquery-1.5.0.js"></script>

<!--		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>
		<script type="text/javascript" src="http://jmar777.googlecode.com/svn/trunk/js/jquery.easing.1.3.js"></script>-->
		<script type="text/javascript" src="jquery.greenishSlides-0.0.1.js"></script>
		<script type="text/javascript" src="jquery.jswipe-0.1.2.j"></script>
		<script type="text/javascript">
			(function($) {
				$(document).ready(function() { 
 					$(".greenishSlides").greenishSlides({	
 						stayOpen:true,
 						keyEvent:true,
				 		activateEvent: "click",
						hooks: {
 							preActivate: function (slide, css) {
								var context=slide.parent();
								var ai=context.find(".active").index();
								var width=40;
								for(var i=1; i<=6; i++) {
									width/=2;
									if(ai-i >=0) context.children().eq(ai-i).css({"min-width":width});
									context.children().eq(ai+i).css({"min-width":width});
								}
 								
 								
 								
 								
 								return true;
 							},
 						},	
 					});
					
					$(window).resize(function () {
						$.gS.setSlides($(".greenishSlides"));
					});
				});
			})(jQuery);
		</script>		
	</head>
	<body>
		<article class="greenishSlides">
			<section class="one"><img src="http://placehold.it/500x300"></section>
			<section class="two"><img src="http://placekitten.com/200/300"></section>
			<section class="three active"><img src="http://placehold.it/500x300"></section>
			<section class="four"><img src="http://placekitten.com/200/300"></section>
			<section class="five"><img src="http://placehold.it/500x300"></section>
		</article>
	</body>
</html>
