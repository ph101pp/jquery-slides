<!DOCTYPE html>
<html>
 	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>greenishSlides</title>
		<link rel="stylesheet" type="text/css" href="design.css">
		<script type="text/javascript" src="jquery-1.5.1.min.js"></script>
		<script type="text/javascript" src="jquery.greenishSlides-1.0.0-beta.js"></script>

<!--		<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.5.1/jquery.min.js"></script>
		<script type="text/javascript" src="http://jmar777.googlecode.com/svn/trunk/js/jquery.easing.1.3.js"></script>-->
		<script type="text/javascript" src="jquery-ui-1.8.11.custom.min.js"></script>
		<script type="text/javascript" src="jquery.easing.1.3.js"></script>
<!--		<script type="text/javascript" src="jquery.jswipe-0.1.2.js"></script>-->
		<script type="text/javascript">
			(function($) {
				$(document).ready(function() { 
 					$(".greenishSlides").greenishSlides({	
 						stayOpen:true,
 						keyEvents:true,
 						circle:true,
 						activeClass:"mySuperActiveClass",
 						active:false,
 						easing:"swing",
 						transitionSpeed:600,
 						vertical:false,
 						active:1,
 						cache:false,
				 		hoer: {
				 			mouseover:function () {
				 				if($(this).hasClass("active")) return;
				 				var limits= {}
				 				limits[$(this).index()] = {min:40};
 								$.gS.options=$.gS.setOpts({limits:limits});
								$.gS.update($(this).parent(),{transitionSpeed:1000});
							},
				 			mouseout:function () {
				 				if($(this).hasClass("active")) return;
								$.gS.update($(this).parent());
				 			}
				 		},
						hooks: {
							prev : function (slideId) {
								var slide=$(this).children().eq(slideId);
								if(slide.hasClass("handle")) {
									$.gS.prev($(this), slide);
									return false;
								}
								else return slideId;
							},
							next : function (slideId) {
								var slide=$(this).children().eq(slideId);
								if(slide.hasClass("handle")) {
									$.gS.next($(this), slide);
									return false;
								}
								else return slideId;
							},
 							preActivate: function () {
								var slide=$(this),
									ai=slide.index(),
									width=40,
									limits = {},
									slides=slide.siblings().andSelf(),
									spreads=slide.attr("id")? slides.filter("."+slide.attr("id")) : {length:0},
									min=ai,
									max=ai+spreads.length,
									k=slides.slice(0,ai).filter(".handle").length,
									j=0;
										
									
								for(var i=0; i<slides.length; i++) {
									if(i<min) {
										width=Math.pow(40,Math.pow(0.91,(min-k)));
										if(width<3) width=0;
										width=Math.ceil(width);
										limits[i]={min:width, max:width};
										
										if(!slides.eq(i).hasClass("handle")) k++;										
									}
									else if(i>max) {
										width=Math.pow(40,Math.pow(0.91,(i-max-j))),
										if(width<3) width=0;
										width=Math.ceil(width);
										limits[i]={min:width, max:width};

										if(slides.eq(i).hasClass("handle")) j++;
									}
									else limits[i]={min:0,max:33333333333333};									
								}
									
								slide.parent().queue("gSpreAnimation", function (next) {
									var slides=$(this).children(),
										active=slides.filter(".mySuperActiveClass").eq(0),
										ai=active.index(),
										spreads=active.attr("id")? slides.filter("."+active.attr("id")) : {length:0},
										min=ai,
										max=ai+spreads.length,
										k=1+slides.slice(0,ai).filter(".handle").length,
										j=1,
										colors=["#EEEEEE","#DDDDDD","#CCCCCC","#BBBBBB","#AAAAAA","#999999","#888888","#777777","#666666","#555555","#444444","#333333","#222222","#111111"],
										color;
									for(var i=0; i<slides.length; i++) {
										if(i<min) {
											color=colors[min-k] || "#000000";
											if(!slides.eq(i).hasClass("handle")) k++;
										}
										else if(i>max) {
											color=colors[i-max-j] || "#000000";
											if(slides.eq(i).hasClass("handle")) j++;

										}
										else color="#ffffff";
										slides.eq(i).animate({backgroundColor:color},{queue:false});
									}
			
									next();									 
								});
 								$.gS.opts=$.gS.setOpts(slide.parent(),{limits:limits});
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
			<li id="one" class="one handle"><div class="marker">2008</div></li>
			<li class="one"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="one"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="one"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="one"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="one"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="one"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="one"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="one"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li id="two"  class="two handle"><div class="marker">2009</div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li class="two"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
			<li id="three"  class="three handle"><div class="marker">2010</div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li class="three"><div class="liLiner"><img src="http://placehold.it/500x300"></div></li>
			<li id="four"  class="four handle"><div class="marker">2011</div></li>
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
			<li class="four"><div class="liLiner"><img src="http://placekitten.com/200/300"></div></li>
		</ul>
	</body>
</html>
