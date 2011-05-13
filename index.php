<!DOCTYPE html>
<html>
 	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>greenishSlides</title>
		<link rel="stylesheet" type="text/css" href="design.css">
		<script type="text/javascript" src="jquery-1.5.1.min.js"></script>
		<script type="text/javascript" src="jquery.greenishSlides-v0.1-beta.js"></script>

		<script type="text/javascript">
			(function($) {
				$(document).ready(function() {
					$(".anything").greenishSlides({
						vertical:false,
						resizable:true,
						limits:{
						},
						hooks:{
							preActivateAnimation: function(){
							}
						}
					
					
					});
				});
			})(jQuery);
		</script>		
	</head>
	<body>
		<ul class="anything">
			<li><img src="//placekitten.com/300/300" alt=""></li>
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
