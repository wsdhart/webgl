"use strict";

/**
 * Create and return the vertices of an n-sided polygon as a JavaScript array.
 * @param {faces} number of sides to create.
 * @return {nodes} the vertices of the polygon as a JavaScript array.
 */
function create_polygon(faces)
{
    var nodes = [];
    var pos = Math.PI / 2;
    var angle = (2 * Math.PI) / faces;
    for(var i = 0 ; i < (faces * 6) ; i+=6)
    {
	nodes[i] = 0.0;
	nodes[i + 1] = 0.0;
	nodes[i + 2] = Math.cos(pos);
	nodes[i + 3] = Math.sin(pos);
	pos -= angle;
	nodes[i + 4] = Math.cos(pos);
	nodes[i + 5] = Math.sin(pos);
    }

    return nodes;
}

/**
 * Given two points, return the position half way between the two.
 * @param {x1}
 * @param {x2}
 * @return point between x1 and x2.
 */
function midpoint(x1 , x2)
{
    return x1 + ((x2 - x1) / 2.0);
}

/**
 * Step through an array of vertices, replacing each triangle with smaller ones
 * @param {vertices} JavaScript array of vertices.
 * @param {holes} boolean indicating wether or not to remove center triangle.
 * @param {nodes} new JavaScript array of vertices.
 */
function split_vertices(vertices , holes)
{
    var nodes = [];
    for(var i = 0 ; i < vertices.length ; i+=6)
    {
	var x1 = vertices[i];
	var y1 = vertices[i + 1];
	var x2 = vertices[i + 2];
	var y2 = vertices[i + 3];
	var x3 = vertices[i + 4];
	var y3 = vertices[i + 5];
	var split = split_triangle(x1 , y1 , x2 , y2 , x3 , y3 , holes);
	for(var j = 0 ; j < split.length ; j++)
	    nodes.push(split[j]);
    }
    return nodes;
}

/**
 * Function used by split_vertices(vertices , holes) to split each triangle.
 * @param {x1} x coordinate of first vertex. 
 * @param {y1} y coordinate of first vertex.
 * @param {x2} x coordinate of second vertex.
 * @param {y2} y coordinate of second vertex.
 * @param {x3} x coordinate of third vertex.
 * @param {y4} y coordinate of third vertex.
 * @param {hole} boolean indicating wether or not to remove center triangle.
 * @return {array} JavScript array containing new triangles.
 */
function split_triangle(x1 , y1 , x2 , y2 , x3 , y3 , hole)
{
    var mx1 = midpoint(x1 , x2);
    var my1 = midpoint(y1 , y2);
    var mx2 = midpoint(x2 , x3);
    var my2 = midpoint(y2 , y3);
    var mx3 = midpoint(x1 , x3);
    var my3 = midpoint(y1 , y3);

    var array = [];

    array.push(x1);
    array.push(y1);
    array.push(mx1);
    array.push(my1);
    array.push(mx3);
    array.push(my3);

    array.push(mx1);
    array.push(my1);
    array.push(x2);
    array.push(y2);
    array.push(mx2);
    array.push(my2);

    array.push(mx3);
    array.push(my3);
    array.push(mx2);
    array.push(my2);
    array.push(x3);
    array.push(y3);

    if(!hole)
    {
	array.push(mx1);
	array.push(my1);
	array.push(mx2);
	array.push(my2);
	array.push(mx3);
	array.push(my3);
    }

    return array;
}
