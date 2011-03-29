<!DOCTYPE html>
<html>
 	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>greenishSlides</title>
		<link rel="stylesheet" type="text/css" href="design.css">
		<script type="text/javascript" src="jquery-1.5.1.min.js"></script>
		<script type="text/javascript" src="jquery.greenishSlides-0.0.1.js"></script>

<!--		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>
		<script type="text/javascript" src="http://jmar777.googlecode.com/svn/trunk/js/jquery.easing.1.3.js"></script>-->
		<script type="text/javascript" src="jquery-ui-1.8.11.custom.min.js"></script>
<!--		<script type="text/javascript" src="jquery.jswipe-0.1.2.js"></script>-->
		<script type="text/javascript">
			(function($) {
				$(document).ready(function() { 
 					$(".greenishSlides").greenishSlides({	
 						stayOpen:true,
 						keyEvents:true,
 						circle:false,
 						orientation:"vertical",
				 		hover: {
				 			mouseover:function () {
				 				if($(this).hasClass("active")) return;
				 				var limits= {}
				 				limits[$(this).index()] = {min:40};
								$.gS.setOptions({limits:limits});
								$.gS.setSlides($(this).parent(),200);
							},
				 			mouseout:function () {
				 				if($(this).hasClass("active")) return;
								$.gS.activate($(this).parent().find(".active").removeClass("active"));
				 			}
				 		},
						hooks: {
 							preActivate: function () {
 								var slide= $(this);
								var ai=slide.index();
								var width=(40/0.7)+1;
								var limits = {};

								for(var i=0; i<=slide.siblings().length; i++) {
									width=width*0.7-1;
									if(width<1) width=0;
									width=Math.ceil(width);
									if((ai-i) >=0) limits[ai-i]={min:width};
									if((ai+i) <= slide.siblings().length)limits[ai+i]={min:width};
								}
 					 			slide.parent().children().queue("gSpre", function (next) {
								
									if($(this).hasClass("active")) var color="#FFFFFF";
									else {
										var colors=["#EEEEEE","#DDDDDD","#CCCCCC","#BBBBBB","#AAAAAA","#999999","#888888","#777777","#666666","#555555","#444444","#333333","#222222","#111111"];
										var i=$(this).parent().find(".active").index();
										i<$(this).index() ? i=$(this).index()-i :i-=$(this).index();
										var color=colors[i] || "#444444";
									}							
									$(this).animate({backgroundColor:color},{queue:false});
			
									next();									 
								});
 								$.gS.setOptions({limits:limits});
 								return true;
 							}
 						}	
 					});
					
					$(window).resize(function () {
//						$.gS.setSlides($(".greenishSlides"));
					});
				});
			})(jQuery);
		</script>		
	</head>
	<body>
		<div class="greenishSlides">
			<div class="one minWidth"><img src="http://placehold.it/500x300"></div>
			<div class="two"><img src="http://placekitten.com/200/300"></div>
			<div class="three active"><img src="http://placehold.it/500x300"></div>
			<div class="four"><img src="http://placekitten.com/200/300"></div>
			<div class="two"><img src="http://placekitten.com/200/300"></div>
			<div class="three active"><img src="http://placehold.it/500x300"></div>
			<div class="four"><img src="http://placekitten.com/200/300"></div>
			<div class="two "><img src="http://placekitten.com/200/300"></div>
			<div class="three active"><img src="http://placehold.it/500x300"></div>
			<div class="four"><img src="http://placekitten.com/200/300"></div>
			<div class="two"><img src="http://placekitten.com/200/300"></div>
			<div class="three active"><img src="http://placehold.it/500x300"></div>
			<div class="four"><img src="http://placekitten.com/200/300"></div>
			<div class="two"><img src="http://placekitten.com/200/300"></div>
			<div class="three active"><img src="http://placehold.it/500x300"></div>
			<div class="four"><img src="http://placekitten.com/200/300"></div>
			<div class="two"><img src="http://placekitten.com/200/300"></div>
			<div class="three active"><img src="http://placehold.it/500x300"></div>
			<div class="four"><img src="http://placekitten.com/200/300"></div>
			<div class="five"><img src="http://placehold.it/500x300"></div>
		</div>
	</body>
</html>
