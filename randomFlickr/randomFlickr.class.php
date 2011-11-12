<?php
/**
 *  randomFlickr
 *
 *  Does what the flickr api misses out on: get one random image of your photostream and do
 *  lots of great magic stuff with it. AMAZING!
 *
 *  for the output of the HTML the class uses an internal template-string. the default string:
 *  <a href="{url}" title="{title}" class="{class}"><img src="{src}" title="{title}" alt="{title}" {html_dim} /></a>
 *
 *  the string to be used can be changed permanently with setDefaultHtml() or for one single
 *  output by passing it as the first parameter to getHtml(). There are several template tags
 *  available for use in the string. Those are:
 *
 *  {title} ...... title fetched from flickr
 *  {url} ........ url for the link the image is wrapped with
 *  {src} ........ image's src
 *  {html_dim} ... image's dimensions as html attributes (see getHtml() for details)
 *  {width} ...... image's width
 *  {height} ..... image's height
 *  {hwidth} ..... width value used for the html-attributes (image's width or fix width)
 *  {hheight} .... height value used for the html-attributes (image's width or fix width)
 *  {fixwidth} ... value passed to getHtml() to use for width-attribute
 *  {fixheight} .. value passed to getHtml() to use for height-attribute
 *  {class} ...... a string for a css-class
 *
 *  the default badge url used will fetch one random image from all your public photos. This
 *  can be changed with the method setBadgeUrl(). When fetching an image the fetch()-method will
 *  attach "&user=" plus the user-id specified in the constructor or as a parameter for fetch().
 *  if no userid has been specified the badge url will be used anyways. The two following
 *  examples produce the exact same result, but have different effects on the object:
 *
 *  @author Christian Knoflach
 *  @version 1.0
 *  @package randomFlickr
*/
 
/**
 * @package randomFlickr
 */
class randomFlickr
{
    /**
     * constant to identify square pictures (height == width)
     * @constant
     */
    const SQUARE = 0;

    /**
     * constant to identify portrait-format pictures (height > width)
     * @constant
     */
    const PORTRAIT = 1;

    /**
     * constant to identify landscape pictures (height < width)
     * @constant
     */
    const LANDSCAPE = 2;
    
    /**
     * constant for the regex to fetch the image's url & id
     * @constant
     */
    const REGEX_SRC = '|http://farm[0-9].static.flickr.com/[0-9]+/([^_]+)_[^_]+|';

    /**
     * constant for the regex to fetch the image's url & id
     * @constant
     */
    const REGEX_URL = '|href="([^"]+)"|';

    /**
     * constant for the regex to fetch the image's title
     * @constant
     */
    const REGEX_TITLE = '|title="([^"]+)|';
    
    /**
     * file handle for the image - used for manipulation
     * @access private
     * @var resource
     */
    private $rHandle;
    
    /**
     * holds information about the image's format (see constants SQUARE, PORTRAIT, LANDSCAPE)
     * @access private
     * @var integer
     */
    private $iFormat;

    /**
     * holds the badge base url - by default that's the url to fetch 1 photo, medium sized
     * see setBadgeUrl() to override
     * @access private
     * @var string
     */
    private $sBadgeUrl = 'http://www.flickr.com/badge_code_v2.gne?count=1&display=random&size=m&layout=x&source=user';

    /**
     * the user id-string flickr uses
     * @access private
     * @var sUser
     */
    private $sUser;
    
    /**
     * is the object ready, thus initiated?
     * @access private
     * @var boolean
     */
    private $bReady;

    /**
     * the html used for the getHtml()-method. see setDefaultHtml() to override
     * @access private
     * @var string
     */
    private $sDefaultHtml = '<a href="{url}" title="{title}" class="{class}"><img src="{src}" title="{title}" alt="{title}" {html_dim} /></a>';
    
    /**
     * the image's url
     * @var string
     */
    public $sSrc;

    /**
     * the image's url
     * @var string
     */
    public $sUrl;

    /**
     * the image's id
     * @var integer
     */
    public $iId;

    /**
     * the image's title
     * @var string
     */
    public $sTitle;

    /**
     * the image's width
     * @var integer
     */
    public $iWidth;

    /**
     * the image's height
     * @var integer
     */
    public $iHeight;

    /**
     *  constructor, may the user is already specified here
     *
     *  @param  string  $user       the flickr-user-id
     */
    function __construct( $user = NULL )
    {
        if ( $user )
        {
            $this->sUser = $user;
        }
    }
    
    /**
     *  decides, based upon the passed width/height which flickr-image-size would
     *  be best suited for the desired size, thus returning the next bigger or 
     *  the original size, so this function might be extremely useless if used
     *  either with a close-to-square display format or very extreme formatted
     *  original pictures like e.g. panoramas. Everything up to 3:2 should work
     *  just fine though.
     *
     *  The experimental $bROUGH-parameter might help with those, but don't rely
     *  on it ...
     *
     *  Note that the script neither checks for the existence of the corresponding
     *  sizes, nor for the original's actual dimensions!
     *
     *  @param  integer    $iW       the destination width
     *  @param  integer    $iH       the destination height
     *  @param  boolean    $bROUGH   make the smaller side fit
     *  @return string               the string to append to the URL (see constants)
     */
    public static function getClosestSize( $iW, $iH, $bROUGH = false )
    {
        if ( $iW >= $iH )
        {
            $b = $iW;
            $s = $iH;
        }
        else
        {
            $b = $iH;
            $s = $iW;
        }
        
        if ( $b <= 75 && ( !$bROUGH || $s <= 75 ) )              { $f = 'xxs'; /* 75 by 75 */  } else
        if ( $b <= 100 && ( !$bROUGH || $s <= ( 100 * 2/3 ) ) )  { $f = 'xs'; /* 100 by 75 */ } else
        if ( $b <= 240 && ( !$bROUGH || $s <= ( 240 * 2/3 ) ) )  { $f = 's'; /* 240 by 180 */ } else
        if ( $b <= 500 && ( !$bROUGH || $s <= ( 500 * 2/3 ) ) )  { $f = 'm'; /* 500 by x */ } else
        if ( $b <= 1024 && ( $bROUGH || $s <= ( 1024 * 2/3 ) ) ) { $f = 'l'; /* 1024 by x */ } else
                                                                { $f = 'xl'; }
        
        return $f;
    }
    
    /**
     *  determines if the image is square, landscape or portrait. by default the object is
     *  being updated with the result, specifying $bSave as false avoids this
     *
     *  @param boolean $bSave       shall the object be updated? true default
     *  @return integer             the result, see constants LANDSCAPE, PORTRAIT, SQUARE
     */
    private function calcFormat ( $bSave = true )
    {
        if ( $this->iWidth > $this->iHeight ) $_format = self::LANDSCAPE;
        if ( $this->iWidth < $this->iHeight ) $_format = self::PORTRAIT;
        if ( $this->iWidth == $this->iHeight ) $_format = self::SQUARE;
        
        if ( $bSave ) $this->iFormat = $_format;
        
        return $_format;
    }
    
    /**
     *  establishes a CURL-connection to the remote file, reads and returns it's contents
     *
     *  @param string $sUrl         the remote file's URL
     *  @return string              the file contents
     */
    private function curlAccess ( $sUrl )
    {
        $ch = curl_init();
        $timeout = 5;
        
        curl_setopt ($ch, CURLOPT_URL, $sUrl);
        curl_setopt ($ch, CURLOPT_CONNECTTIMEOUT, $timeout);
        
        ob_start();
        curl_exec($ch);
        curl_close($ch);
        
        return ( ob_get_clean() );
    }
    
    /**
     *  fetches a random image's data utilizing the specified  badge url
     *
     *  @param  string  $user       the user's name, if not already specified
     *  @return object              the object for chaining
     */
    public function fetch ( $user = NULL )
    {
        if ( !$user ) $user = $this->sUser;
        
        
        /*
         * check if accessing remote files via file_get_contents is possible. If not
         * try to fall back to CURL, or throw an exception
        */
        if ( ini_get('allow_url_fopen') )
        {
            $sBadge = file_get_contents($this->sBadgeUrl . ( $user ? "&user=$user" : '' ));
        }
        elseif ( function_exists('curl_init') )
        {
            $sBadge = $this->curlAccess($this->sBadgeUrl . ( $user ? "&user=$user" : '' ));
        }
        else
        {
            throw new Exception('allow_url_fopen disabled and CURL not found. Cannot access remote url '. $this->sBadgeUrl . ( $user ? "&user=$user" : '' ));
        }
        
        preg_match(self::REGEX_SRC, $sBadge, $matches);
        
        $this->sSrc = $matches[0] . '.jpg';
        $this->iId = $matches[1];
        
        preg_match(self::REGEX_URL, $sBadge, $matches);
        $this->sUrl = $matches[1];
        
        preg_match(self::REGEX_TITLE, $sBadge, $matches);
        
        $this->sTitle = stripslashes($matches[1]);
        
        if ( !$this->iId )
        {
            throw new Exception('could not fetch data from badge '. $this->sBadgeUrl . ( $user ? "&user=$user" : '' ));
        }
        
        if ( ini_get('allow_url_fopen') )
        {
            list ( $this->iWidth, $this->iHeight) = getimagesize($this->sSrc);
        }
        elseif ( function_exists('curl_init') ) {
            $im_raw = $this->curlAccess($this->sSrc);
            
            $image = imagecreatefromstring($im_raw);
            
            if ( !$image ) 
            {
                throw new Exception('could not find valid image data at '. $this->sSrc);
            }
            
            $this->iWidth = imageSX($image);
            $this->iHeight = imageSY($image);
        }
        
        $this->bReady = true;
        $this->sUser = $user;
        
        $this->calcFormat();
        
        return $this;
    }
    
    /**
     *  initializes the image, creating the handle and getting the dimensions. if $path is
     *  specified, this url will be used instead of the internally saved (if one)
     *
     *  @param  string  $path       an image url to create object from, optional
     *  @return object              the object for chaining
     */
    public function init ( $size = '', $path = NULL )
    {
        if ( !$path ) $path = $this->sSrc;
        
        if ( $size )
        {
            switch ($size)
            {
                case 'xxs': $size = '_s'; break;
                case 'xs' : $size = '_t'; break;
                case 's'  : $size = '_m'; break;
                case 'm'  : $size = '';   break;
                case 'l'  : $size = '_b'; break;
                case 'xl' : $size = '_o'; break;
            }
            
            $path = substr_replace($path, $size . ".jpg", -4);
        }
        
        if ( ini_get('allow_url_fopen') )
        {
            $this->rHandle = imagecreatefromjpeg($path);
        }
        elseif ( function_exists('curl_init') )
        {
            $this->rHandle = imagecreatefromstring($this->curlAccess($path . $size));
        }
        
        if ( !$this->rHandle) 
        {
            throw new Exception('could not create from '. $path);
        }
        
        $this->bReady = true;
        
        $this->iWidth = imagesx ( $this->rHandle );
        $this->iHeight = imagesy ( $this->rHandle );
        
        $this->calcFormat();
        
        return $this;
    }
    
    /**
     *  wrapper for the imagefilter()-function, see PHP-documentation for details
     *
     *  @param int $type            the type of the filter, see PHP-documentation for details
     *  @param mixed $more          any parameters to pass to imagefilter
     *  @return object              the object for chaining
     */
    public function applyFilter( $type )
    {
        if ( func_num_args() > 1 )
        {
            $args = func_get_args();
            $args = array_values($args);
        }
        
        switch ( func_num_args() )
        {
            case 1:
                $success = imagefilter($this->rHandle, $type); 
                break;
                
            case 2:
                $success = imagefilter($this->rHandle, $type, $args[1]);
                break;
                
            case 3:
                $success = imagefilter($this->rHandle, $type, $args[1], $args[2]);
                break;
                
            case 4:
                $success = imagefilter($this->rHandle, $type, $args[1], $args[2], $args[3]);
                break;
                
            case 5:
                $success = imagefilter($this->rHandle, $type, $args[1], $args[2], $args[3], $args[4]);
                break;
        }
        
        if ( !$success ) 
        {
            throw new Exception('Could not apply filter');
        }
        
        return $this;
    }
    
    /**
     *  resizes (for real resamples) the image to specified dimensions. crops to avoid distortion.
     *
     *  the image will be shrinked (or extended!) so it still fills the whole format, then it 
     *  will be cropped. If only width or height are being specified (setting the other to 0)
     *  the image will be proportionally shrinked/extended
     *
     *  @param  string  $user       the user's name, if not already specified
     *  @return object              the object for chaining
     */
    public function resize($w, $h, $crop = true)
    {
        if ( $w == 0 && $h == 0 )
        {
            throw new Exception("Cant resize to dimensions $w x $h (width x height)");
        }
        
        $ratio = ( ( $_rw = $w > 0 ? $this->iWidth / $w : $this->iWidth ) > ($_rh = $h > 0 ? $this->iHeight / $h : $this->iWidth) ) ? $_rh : $_rw;
        
        $toW = ( $w > 0 ? $w : $this->iWidth / $ratio );
        $toH = ( $h > 0 ? $h : $this->iHeight / $ratio );
        
        $_t = imagecreatetruecolor($toW, $toH);
        
        if ( !$crop )
        {
            $sample_w = $toW;
            $sample_h = $toH;
            $off_x = $off_y = 0;
        }
        else
        {
            $sample_w = $this->iWidth / $ratio;
            $sample_h = $this->iHeight / $ratio;
            
            $off_x = ( $_rw > $_rh ) ? ( $sample_w - $toW ) / 2 : 0;
            $off_y = ( $_rh > $_rw ) ? ( $sample_h - $toH ) / 2 : 0;
        }
        
        if ( imagecopyresampled($_t, $this->rHandle, -$off_x, -$off_y, 0, 0, $sample_w, $sample_h, $this->iWidth, $this->iHeight) )
        {
            $this->iWidth = $w;
            $this->iHeight = $h;
            $this->rHandle = $_t;
        }
        else
        {
            throw new Exception('could not resize image');
        }
        
        return $this;
    }
    
    /**
     *  update default Html
     *
     *  @param  string  $html       the new string to use for output
     *  @return object              the object for chaining
     */
    public function setDefaultHtml ( $html )
    {
        $this->sDefaultHtml = $html;
        
        return $this;
    }
    
    /**
     *  update the badge url
     *
     *  @param  string  $html       the new string to use for output
     *  @return object              the object for chaining
     */
    public function setBadgeUrl ( $url )
    {
        $this->sBadgeUrl = $url;
        
        return $this;
    }
    
    /**
     *  returns html code based on the default html specified
     *
     *  @param  string  $sFormat    the new format - anything you want, that is
     *  @param  array   $aParams    an array specifying parameters to override. available:
     *                              'fixwidth': for the width="" attribute of the <img>
     *                              'fixheight': for the height="" attribute of the <img>
     *                              'nativedim': the image's real dimensions will be used
     *                                           for width="" & height=""
     *                              'class': for the <a>, by default
     *                              'src_pre': inserted just before the image's src
     *                              'src_post': inserted right after the image's src
     *                              'url_pre': inserted right before the url to the image
     *  @return object              the object for chaining
     */
    public function getHtml ( $sFormat = NULL, $aParams = array() )
    {
        if ( ! $sFormat || trim(strtolower($sFormat)) == 'default') $sFormat = $this->sDefaultHtml;

        /*
         * build a valid XHTML1.1 src-url
        */
        $xmlsrc = $this->sSrc;
        $xmlsrc = ( isset($aParams['src_pre']) ? $aParams['src_pre'] : '' ) . $xmlsrc;
        $xmlsrc = $xmlsrc . ( isset($aParams['src_post']) ? $aParams['src_post'] : '' );

        if ( $qmpos = strpos($xmlsrc, '?') )
        {
            $xmlsrc = substr($xmlsrc, 0, $qmpos + 1) . htmlentities(substr($xmlsrc, $qmpos + 1));
        }

        /*
         * check which dimensions to use for html:
         * first check if fixed values have been submitted
        */
        $fwidth = ( isset($aParams['fixwidth']) ? $aParams['fixwidth'] : false );
        $fheight = ( isset($aParams['fixheight']) ? $aParams['fixheight'] : false );

        /*
         * now see if the native dimensions shall be used instead
        */
        $hwidth = ( isset($aParams['nativedim']) ? $this->iWidth : $fwidth );
        $hheight = ( isset($aParams['nativedim']) ? $this->iHeight : $fheight );
        
        /*
         * build the dimension stuff
        */
        $htmlw = ( $hwidth ? 'width="'. $hwidth .'"' : false );
        $htmlh = ( $hheight ? 'height="'. $hheight .'"' : false );
        $htmld = $htmlw . ( $htmlw && $htmlh ? ' ' : '' ) . $htmlh;
        
        /*
         * build the link url
        */
        $url = ( key_exists('url_pre', $aParams) ? $aParams['url_pre'] : '' ) . $this->sUrl;
        
        /*
         * template-variable replacement
        */
        $search = array('{title}', '{url}', '{src}', '{html_dim}',
                        '{width}', '{height}','{hwidth}','{hheight}', '{fixwidth}', '{fixheight}', 
                        '{class}');
                        
        $replace = array(htmlentities($this->sTitle), $url, $xmlsrc, $htmld,
                         $this->iWidth, $this->iHeight, $hwidth, $hheight, $fwidth, $fheight,
                         ( key_exists('class', $aParams) ? $aParams['class'] : 'randomFlickr' )
                   );
                         
        $sFormat = str_replace($search, $replace, $sFormat);
        
        return $sFormat;
    }
    
    /**
     *  sends the image + no-caching headers. that's it.
     */
    public function send( $quality = 75 )
    {
        header('content-type: image/jpeg');
        header('Cache-Control: no-cache, must-revalidate'); // HTTP/1.1
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // past date

        gzencode(imagejpeg($this->rHandle, '', $quality), 9);
        imagedestroy($this->rHandle);
        exit;
    }
}
