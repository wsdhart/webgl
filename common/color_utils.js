"use strict";

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
