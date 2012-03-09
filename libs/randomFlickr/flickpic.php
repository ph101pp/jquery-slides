<?php
/**
 *  randomFlickr.class.php usage sample
 */
 
require_once('randomFlickr.class.php');

if ( !isset($_GET['imageUrl']) )
{
    try
    {
        $x = new randomFlickr($user);
        if ( $badge )
        {
            $x->setBadgeUrl($badge);
        }
        $x->fetch();
    }
    catch (Exception $e)
    {
        print('no pic: '. $e->getMessage()); 
    }
    
    $src_post = ( $width ? "&width=$width" : '' ) . ( $height ? "&height=$height" : '' ) . ( $gray ? '&grayscale' : '' ) . ( $size ? "&size=$size" : '' );

    $http = 'http://'. $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI'] . 'x') .'/'. $relpath;
    
    print ( $x->getHtml(false, array('src_pre' => $http .'flickpic.php?imageUrl=', 'src_post' => $src_post, 'fixwidth' => $width, 'fixheight' => $height)));
} 
else
{
    try
    {
        if ( !isset($_REQUEST['size']) || $_REQUEST['size'] == 'auto' )
        {
            $_REQUEST['size'] = randomFlickr::getClosestSize($_REQUEST['width'], $_REQUEST['height'], true);
        }
        
        $x = new randomFlickr();
        $x->init($_REQUEST['size'], urldecode($_REQUEST['imageUrl']));
        
        if ( isset($_REQUEST['width']) || isset($_REQUEST['height']) ) 
        {
            $x->resize(( isset($_REQUEST['width'])   ? $_REQUEST['width']  : false ), 
                       ( isset($_REQUEST['height'])  ? $_REQUEST['height'] : false ));
        }
        
        if ( isset($_REQUEST['grayscale']) )
        {
            $x->applyFilter(IMG_FILTER_GRAYSCALE); 
        }
        
        $x->send( 90 );
    }
    catch (Exception $e)
    {
        print('no pic: '. $e->getMessage());
    }
}