"use strict";

/**
 * Creates and returns a JavaScript array containing WebGL compatible colors
 * from a grayscale palette, enough to cover every 3 vertices.
 * @param {faces} total number of vertices divided by 6.
 * @return {colors} colors to bind to vertices.
 */
function create_grayscale(faces)
{
    var colors = [];
    var step = 1.0 / faces;
    for(var i = 0 ; i < faces ; i++)
    {
	var i_step = i * step;
	for(var j = 0 ; j < 9 ; j++)
	    colors.push(i_step);
    }
    return colors;
}

/**
 * Creates and returns a JavaScript array containing WebGL compatible colors
 * from an rgb palette, enough to cover every 3 vertices.
 * @param {faces} total number of vertices divided by 6.
 * @return {colors} colors to bind to vertices.
 */
function create_rgb(faces)
{
    var colors = [];
    var step = 1.0 / faces;
    for(var i = 0 ; i < faces ; i++)
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
