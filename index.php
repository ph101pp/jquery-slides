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
		<script type="text/javascript" src="jquery-ui-1.8.11.custom.min.j"></script>
		<script type="text/javascript" src="jquery.jswipe-0.1.2.js"></script>
		<script type="text/javascript">
			(function($) {
				$(document).ready(function() { 
 					$(".greenishSlides").greenishSlides({	
 						stayOpen:true,
 						keyEvents:false,
				 		activateEvent: "click",
				 		handle: "img",
				 		hover: {
				 			mouseover:function () {
								$(this).stop().animate({"width":40},"slow").css({zndex:10,"min-width":40});
								$.gS.setSlides($(this).parent());
							},
				 			mouseout:function () {
								$(this).css({"min-width":0, zIndex:0});
								$.gS.activate($(this).parent().find(".active").removeClass("active").find("img"));
				 			}
				 		},
						hooks: {
 							preActivate: function () {
 								var slide= $(this);
 								var colors=["#EEEEEE","#DDDDDD","#CCCCCC","#BBBBBB","#AAAAAA","#999999","#888888","#777777","#666666","#555555","#444444","#333333","#222222","#111111"];
								var context=slide.parent().children().stop().animate({"width":"0px"},"slow").css({"min-width":"0px", backgroundColor:"#000000"}).end();
								var ai=slide.css({"backgroundColor":"#ffffff"}).index();
								var width=40;
									

								for(var i=1; i<=20; i++) {
									width*=0.8;
									if(width<1) width=0;
									if(ai-i >=0) context.children().eq(ai-i).stop().animate({"width":width},"slow").css({"min-width":width, backgroundColor:colors[i]});
									
									if(ai+i <= context.children().length) context.children().eq(ai+i).stop().animate({"width":width},"slow").css({"min-width":width, backgroundColor:colors[i]});
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
			<section class="two"><img src="http://placekitten.com/200/300"></section>
			<section class="three active"><img src="http://placehold.it/500x300"></section>
			<section class="four"><img src="http://placekitten.com/200/300"></section>
			<section class="two"><img src="http://placekitten.com/200/300"></section>
			<section class="three active"><img src="http://placehold.it/500x300"></section>
			<section class="four"><img src="http://placekitten.com/200/300"></section>
			<section class="two"><img src="http://placekitten.com/200/300"></section>
			<section class="three active"><img src="http://placehold.it/500x300"></section>
			<section class="four"><img src="http://placekitten.com/200/300"></section>
			<section class="two"><img src="http://placekitten.com/200/300"></section>
			<section class="three active"><img src="http://placehold.it/500x300"></section>
			<section class="four"><img src="http://placekitten.com/200/300"></section>
			<section class="two"><img src="http://placekitten.com/200/300"></section>
			<section class="three active"><img src="http://placehold.it/500x300"></section>
			<section class="four"><img src="http://placekitten.com/200/300"></section>
			<section class="five"><img src="http://placehold.it/500x300"></section>
		</article>
	</body>
</html>
