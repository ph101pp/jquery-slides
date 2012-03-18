<!DOCTYPE html>
<html>
 	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>greenishSlides</title>
		<link rel="stylesheet" type="text/css" href="example.css">
		<script type="text/javascript" src="../libs/jquery-1.6.min.js"></script>
		<script type="text/javascript" src="jquery.greenishSlides-v0.2-beta.js"></script>

		<script type="text/javascript">
			(function($) {
				$(document).ready(function() {
					$(".myElement").greenishSlides({

/*/////////////////////// Example 7: resizable
						resizable:true,
						events:{
							activate:"click",
							deactivate:"click"
						}
/*/////////////////////// Example 7: resizable
						resizable:true,
						events:{
							activate:"click",
							deactivate:"click"
						}
					});
				});
			})(jQuery);
		</script>		
	</head>
	<body>
		<ul class="myElement fullscreen">
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
