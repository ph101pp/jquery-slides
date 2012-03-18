<!DOCTYPE html>
<html>
 	<head>
		<meta http-equiv="content-type" content="text/html; charset=utf-8"/>
		<title>greenishSlides - pictureGrid</title>
		<link rel="stylesheet" type="text/css" href="design.css">
		<script type="text/javascript" src="../libs/jquery-1.6.min.js"></script>
		<script type="text/javascript" src="../greenishSlides/jquery.greenishSlides-v0.2-beta.js"></script>
		<script type="text/javascript" src="jquery.greenishSlides.pictureGrid-v0.1-alpha.js"></script>
		<script type="text/javascript">
			(function($) {
				$(document).ready(function() {
					$(".pictureGrid").pictureGrid({
						resizable:true,
					});
				});
			})(jQuery);
		</script>		
	</head>
	<body>
		<ul class="pictureGrid">
			<li>		
				<ul class="vertical">
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
				</ul>
			</li>
			<li>		
				<ul class="vertical">
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
						<li style="background-image:url(<?php echo $x->sSrc; ?>); background-position:center; background-size:cover"></li>
				</ul>
			</li>
		</ul>
	</body>
</html>
