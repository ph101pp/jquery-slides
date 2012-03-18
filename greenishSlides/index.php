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
/**//*///////////////// Example 2: Vertical Click
						vertical:true,
						events: {
							activate:"click",
							deactivate:"click"
						}
/**//*///////////////// Example 3: Limits
						limits: {
							min:30,
						}
/**//*///////////////// Example 4: Limits advanced
						limits: {
							min:10,
							0: {
								min:180
							},
							2: {
								min:180
							},
							4: {
								min:180
							},
							"-1": {
								min:180
							}
						}
/**//*///////////////// Example 5: Limits, stayOpen, keyEvents
						active:0,	
						stayOpen:true,
						keyEvents:true,
						limits: {
							max:400,
						}
/**//*///////////////// Example 6: Navigation Left (click)
						stayOpen:true,
						events: {
							activate:"click",
							deactivate:"click"
						},
						limits: {
							0: {
								min:30,
								max:30
							}
						}
/**//////////////////// Example 7: resizable
						resizable:true,
						events:{
							activate:"click",
							deactivate:"click"
						}
/**////////////////////
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
