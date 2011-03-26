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
 						keyEvents:true,
				 		activateEvent: "click",
				 		handle: "img",
				 		hover: {
				 			mouseover:function () {
				 			
				 				var limits= {}
				 				limits[$(this).index()] = {min:200};
								$.gS.setOptions({limits:limits});
								$.gS.setSlides($(this).parent(),200);
							},
				 			mouseout:function () {
								$.gS.activate($(this).parent().find(".active").removeClass("active").find("img"));
				 			}
				 		},
						hooks: {
 							preActivate: function () {
 								var slide= $(this);
 								var colors=["#EEEEEE","#DDDDDD","#CCCCCC","#BBBBBB","#AAAAAA","#999999","#888888","#777777","#666666","#555555","#444444","#333333","#222222","#111111"];
								var ai=slide.css({"backgroundColor":"#ffffff"}).index();
								var width=40;
								var limits = {};
									

								for(var i=1; i<=20; i++) {
									width=Math.ceil(width*0.7);
									if(width<=1) width=0;
									limits[ai+i]=limits[ai-i]={};
									
									if(ai-i >=0) {
										limits[ai-i].min=width;
										slide.siblings().eq(ai-i).css({backgroundColor:colors[i]});
									}
									if(ai+i < slide.siblings().length) {
										limits[ai+i].min=width;
										slide.siblings().eq(ai+i).css({backgroundColor:colors[i]});
									}								
								}
 								
 								
 								$.gS.setOptions({limits:limits});
 								
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
			<section class="one minWidth"><img src="http://placehold.it/500x300"></section>
			<section class="two"><img src="http://placekitten.com/200/300"></section>
			<section class="three active"><img src="http://placehold.it/500x300"></section>
			<section class="four"><img src="http://placekitten.com/200/300"></section>
			<section class="two"><img src="http://placekitten.com/200/300"></section>
			<section class="three active"><img src="http://placehold.it/500x300"></section>
			<section class="four"><img src="http://placekitten.com/200/300"></section>
			<section class="two "><img src="http://placekitten.com/200/300"></section>
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
