<!DOCTYPE html>
<html>
 	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>greenishSlides</title>
		<link rel="stylesheet" type="text/css" href="design.css">
		<script type="text/javascript" src="../libs/jquery-1.6.min.js"></script>
		<script type="text/javascript" src="../greenishSlides/jquery.greenishSlides-v0.2-beta.js"></script>

		<script type="text/javascript">
			(function($) {
				$(document).ready(function() {
					$(".anything").greenishSlides();
				});
			})(jQuery);
		</script>		
		
		<style>
		
			.bla {
				max-width:500px;
				min-width:0%;
				
			}
		</style>
	</head>
	<body>
		<ul class="anything">
			<li class="bla"><div><img src="http://placekitten.com/300/300" alt=""></div></li>
			<li></li>
			<li class="bla"></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
			<li></li>
		</ul>
	</body>
</html>
