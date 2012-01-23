<!DOCTYPE html>
<html>
 	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>greenishSlides</title>
		<link rel="stylesheet" type="text/css" href="design.css">
		<script type="text/javascript" src="jquery-1.6.min.js"></script>
		<script type="text/javascript" src="jquery.greenishSlides-v0.2-beta.js"></script>

		<script type="text/javascript">
			(function($) {
				$(document).ready(function() {
					$(".anything").greenishSlides({
						vertical:false,
						stayOpen:false,
						resizable:true,
						circle:false,
						keyEvents:true,
						active:-2,
						events:false,
						bla:{
							activate:"mouseover",
							deactivate:"mouseout"
						},
						limits:{
								0:{
									min:30,
									max:30
								}
						}
						
						
						
					});
				});
			})(jQuery);
		</script>		
	</head>
	<body>
		<ul class="anything">
			<li><div><img src="//placekitten.com/300/300" alt=""></div></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
		</ul>
	</body>
</html>
