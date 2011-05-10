<!DOCTYPE html>
<html>
 	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>greenishSlides</title>
		<link rel="stylesheet" type="text/css" href="design.css">
		<script type="text/javascript" src="jquery-1.5.1.min.js"></script>
		<script type="text/javascript" src="jquery.greenishSlides-v0.1-beta.js"></script>

<!--		<script type="text/javascript" src="jquery.jswipe-0.1.2.js"></script>-->
		<script type="text/javascript">
			(function($) {
				$(document).ready(function() {
 					$(".horizontal").greenishSlides({	
 						vertical:false,
 						
 						hooks:{
 							preActivate:function(data){console.log(data.ai); return data;}
 						}
					})
				});
			})(jQuery);
		</script>		
	</head>
	<body>
		<ul class="horizontal">
			<li>	
				<img src="//placekitten.com/400/400">
			</li>
			<li>	
				<img src="//placekitten.com/400/400">
			</li>
			<li>	
				<img src="//placekitten.com/400/400">
			</li>
			<li>	
				<img src="//placekitten.com/400/400">
			</li>
			<li>	
				<img src="//placekitten.com/400/400">
			</li>
			<li>	
				<img src="//placekitten.com/400/400">
			</li>
			<li>	
				<img src="//placekitten.com/400/400">
			</li>
			<li>	
				<img src="//placekitten.com/400/400">
			</li>
			<li>	
				<img src="//placekitten.com/400/400">
			</li>
			<li>	
				<img src="//placekitten.com/400/400">
			</li>
			<li>	
				<img src="//placekitten.com/400/400">
			</li>
			<li>	
				<img src="//placekitten.com/400/400">
			</li>
			<li>	
				<img src="//placekitten.com/400/400">
			</li>
			<li>	
				<img src="//placekitten.com/400/400">
			</li>
			<li>	
				<img src="//placekitten.com/400/400">
			</li>
		</ul>
	</body>
</html>
