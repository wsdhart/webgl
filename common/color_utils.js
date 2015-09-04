"use strict";

// for use with set_color(color)
var div = 1.0 / 255;

/**
 * Returns a JavaScript array containing WebGL compatible colors
 * from a grayscale palette, enough to cover every 3 vertices.
 * @param {faces} total number of vertices divided by 6.
 * @param {colors} optional predefined JavaScript array to extend.
 * @return {colors} colors to bind to vertices.
 */
function create_grayscale(faces , colors)
{
    if(!colors)
	colors = [];
    var step = 1.0 / faces;
    for(var i = colors.length / 9 ; i < faces ; i++)
    {
	var i_step = i * step;
	for(var j = 0 ; j < 9 ; j++)
	    colors.push(i_step);
    }
    return colors;
}

/**
 * Returns a JavaScript array containing WebGL compatible colors
 * from an rgb palette, enough to cover every 3 vertices.
 * @param {faces} total number of vertices divided by 6.
 * @param {colors} optional predefined JavaScript array to extend.
 * @return {colors} colors to bind to vertices.
 */
function create_rgb(faces , colors)
{
    if(!colors)
	colors = [];
    var step = 1.0 / faces;
    for(var i = colors.length / 9 ; i < faces ; i++)
    {
	colors.push(0.0);
	colors.push(0.0);
	colors.push(1.0);
	colors.push(0.0);
	colors.push(1.0);
	colors.push(0.0);
	colors.push(1.0);
	colors.push(0.0);
	colors.push(0.0);
    }
    return colors;
}

/**
 * Converts HTML color to color array in range 0 - 1.
 * @param {color} HTML color.
 * @return {colors} JavaScript array containing colors in rangle 0 - 1.
 */
function set_color(color)
{
    var red = parseInt(color.substring(1 , 3) , 16);
    var green = parseInt(color.substring(3 , 5) , 16);
    var blue = parseInt(color.substring(5 , 7) , 16);

    var colors = [red * div , green * div , blue * div , 1.0];

    return colors;
}

/**
 * Converts color array in range 0 - 1 to HTML color.
 * @param {colors} JavaScript array containing colors in rangle 0 - 1.
 * @return {color} HTML color.
 */
function get_color(colors)
{
    var r = Math.round(colors[0] * 255);
    var g = Math.round(colors[1] * 255);
    var b = Math.round(colors[2] * 255);

    var rs = r.toString(16);
    if(rs.length == 0)
	rs = "00";
    else if(rs.length == 1)
	rs = "0" + rs;
    else if(rs.length > 2)
	rs = rs.substring(0 , 2);

    var gs = g.toString(16);
    if(gl.length == 0)
	gs = "00";
    else if(gs.length == 1)
	gs = "0" + gs;
    else if(gs.length > 2)
	gs = gs.substring(0 , 2);

    var bs = b.toString(16);
    if(bs.length == 0 )
	bs = "00";
    else if(bs.length == 1)
	bs = "0" + bs;
    else if(bs.length > 2)
	bs = bs.substring(0 , 2);

    return "#" + rs + gs + bs;
}

/**
 * Creates a checkerboard pattern array with 8*8 squares.
 * @param {width} desired width, preferably 2^n >= 2^5.
 * @param {height} desired height, preferably 2^n >= 2^5.
 * @return {image} JavaScript array containing a checkerboard pattern.
 */
function create_checkerboard(width , height)
{
    var image = [];
    for(var j = 0 ; j < height ; j++)
    {
	for(var i = 0 ; i < width ; i++)
	{
	    var c = (((j & 8) == 0) ^ ((i & 8) == 0)) ? 224 : 32;
	    image.push(c);
	    image.push(c);
	    image.push(c);
	    image.push(255);
	}
    }
    return image;
}

/**
 * Loads an image with callback.
 * param {src} source of the image.
 * param {callback} callback function.
 * return {image} returns the loaded image var.
 */
function load_image(src , callback)
{
    var image = new Image();
    image.onload = callback;
    image.src = src;
    return image;
}
