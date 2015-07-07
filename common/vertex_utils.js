"use strict";

/**
 * Creates and returns a JavaScript array containing vertices rotated by angle.
 * @param {vertices} vertices to rotate.
 * @param {angle} angle in radians to rotate vertices by.
 * @return {nodes} rotated vertices.
 */
function rotate_points(vertices , angle)
{
    var nodes = [];
    var sin = Math.sin(angle);
    var cos = Math.cos(angle);
    for(var i = 0 ; i < vertices.length ; i+=2)
    {
	var x = vertices[i];
	var y = vertices[i + 1];
	var yp = (x * sin) + (y * cos);
	var xp = (x * cos) - (y * sin);
	nodes[i] = xp;
	nodes[i + 1] = yp;
    }
    return nodes;
}

/**
 * Creates and returns a JavaScript array containing vertices twisted by angle.
 * @param {vertices} vertices to twist.
 * @param {angle} angle in radians to twist vertices by.
 * @return {nodes} twisted vertices.
 */
function twist_points(vertices , angle)
{
    var nodes = [];
    for(var i = 0 ; i < vertices.length ; i+=2)
    {
	var x = vertices[i];
	var y = vertices[i + 1];
	var distance = Math.sqrt((x * x)+(y * y));
	var delta = angle * distance;
	var sin = Math.sin(delta);
	var cos = Math.cos(delta);
	var yp = (x * sin) + (y * cos);
	var xp = (x * cos) - (y * sin);
	nodes[i] = xp;
	nodes[i + 1] = yp;
    }
    return nodes;
}
