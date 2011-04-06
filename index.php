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
		<script type="text/javascript" src="jquery.easing.1.3.js"></script>
<!--		<script type="text/javascript" src="jquery.jswipe-0.1.2.js"></script>-->
		<script type="text/javascript">
			(function($) {
				$(document).ready(function() { 
 					$(".greenishSlides").greenishSlides({	
 						stayOpen:false,
 						keyEvents:false,
 						circle:false,
 						easing:"swing",
 						events:{
 							activate:"mouseover",
 							deactivate:"mouseout"
 						},
 						transitionSpeed:600,
 						vertical:false,
 						limits: {
 							min:20
 						},
				 		hovder: {
				 			mouseover:function () {
				 				if($(this).hasClass("active")) return;
				 				var limits= {}
				 				limits[$(this).index()] = {min:40};
 								$.gS.options=$.gS.setOpts({limits:limits});
								$.gS.update($(this).parent(),{transitionSpeed:1000});
							},
				 			mouseout:function () {
				 				if($(this).hasClass("active")) return;
								$.gS.activate($(this).parent().find(".active").removeClass("active"));
				 			}
				 		},
						hodoks: {
 							preActivate: function () {
 								var slide=$(this);
									ai=slide.index()
									width=(40/0.7)+1;
									limits = {};

								for(var i=0; i<=slide.siblings().length; i++) {
									width=width*0.7-1;
									if(width<1) width=0;
									width=Math.ceil(width);
									if((ai-i) >=0) limits[ai-i]={min:width};
									if((ai+i) <= slide.siblings().length)limits[ai+i]={min:width};
								}
 					 			slide.parent().queue("gSpreAnimation", function (next) {
									var slides=$(this).children(),
										slide;
									for(var k=0; k<slides.length; k++) {
										slide=slides.eq(k)
										if(slide.hasClass("active")) var color="#FFFFFF";
										else {
											var colors=["#EEEEEE","#DDDDDD","#CCCCCC","#BBBBBB","#AAAAAA","#999999","#888888","#777777","#666666","#555555","#444444","#333333","#222222","#111111"];
											var i=slide.parent().find(".active").index();
											i<slide.index() ? i=slide.index()-i :i-=slide.index();
											var color=colors[i] || "#444444";
										}							
										slide.animate({backgroundColor:color},{queue:false});
									}
			
									next();									 
								});
 								$.gS.opts=$.gS.setOpts({limits:limits});
 								return true;
 							}
 						}	
 					});
					
					$(window).resize(function () {
//						$.gS.update($(".greenishSlides"));
					});
				});
			})(jQuery);
		</script>		
	</head>
	<body>
		<ul class="greenishSlides" id="greenishSlides">
			<li class="one "><img src="http://placehold.it/500x300"></li>
			<li class="two"><img src="http://placekitten.com/200/300"></li>
			<li class="three active"><img src="http://placehold.it/500x300"></li>
			<li class="four"><img src="http://placekitten.com/200/300"></li>
			<li class="two"><img src="http://placekitten.com/200/300"></li>
			<li class="three "><img src="http://placehold.it/500x300"></li>
			<li class="four"><img src="http://placekitten.com/200/300"></li>
			<li class="two " style="min-width:400px;"><img src="http://placekitten.com/200/300"></li>
		</ul>
	</body>
</html>
