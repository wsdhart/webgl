"use strict";

function Cube(gl , program)
{
    this.gl = gl;
    this.program = program;
}

Cube.prototype = new Shape();

Cube.prototype.create_shape = function()
{
    var nodes =
	[
	    (-1.0) , (-1.0) , 1.0 ,
	    (-1.0) , 1.0 , 1.0 ,

	    1.0 , 1.0 , 1.0 ,
	    1.0 , (-1.0) , 1.0 ,

	    (-1.0) , (-1.0) , (-1.0) ,
	    (-1.0) , 1.0 , (-1.0) ,

	    1.0 , 1.0 , (-1.0) ,
	    1.0 , (-1.0) , (-1.0) ,
	];
    return nodes;
}

// learningwebgl method.
Cube.prototype.create_indexes = function()
{
    var indexes =
	[
	    1, 0, 3,
	    3, 2, 1,
	    2, 3, 7,
	    7, 6, 2,
	    3, 0, 4,
	    4, 7, 3,
	    6, 5, 1,
	    1, 2, 6,
	    4, 5, 6,
	    6, 7, 4,
	    5, 4, 0,
	    0, 1, 5
	]
    return indexes ;
}
