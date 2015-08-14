"use strict";

function Cube(gl , program)
{
    this.gl = gl;
    this.program = program;
}

Cube.prototype = new Shape();

Cube.prototype.create_shapes = function()
{
    var nodes =
	[
	    (-1.0) , (-1.0) , 1.0 ,    // left , bottom , front  - 0
	    (-1.0) , 1.0 , 1.0 ,       // left , top , front     - 1

	    1.0 , 1.0 , 1.0 ,          // right , top , front    - 2
	    1.0 , (-1.0) , 1.0 ,       // right , bottom , front - 3

	    (-1.0) , (-1.0) , (-1.0) , // left , bottom , back   - 4
	    (-1.0) , 1.0 , (-1.0) ,    // left , top , back      - 5

	    1.0 , 1.0 , (-1.0) ,       // right , top , back     - 6
	    1.0 , (-1.0) , (-1.0) ,    // right , bottom , back  - 7
	];
    this.shapes.push(nodes);
}

// learningwebgl method.
Cube.prototype.create_indices = function()
{
    var indices =
	[
	    0 , 1 , 2 ,
	    2 , 0 , 3 ,
	    3 , 2 , 6 ,
	    6 , 3 , 7 ,
	    7 , 6 , 5 ,
	    5 , 7 , 4 ,
	    4 , 5 , 1 ,
	    1 , 4 , 0 ,
	    0 , 3 , 7 ,
	    7 , 0 , 4 ,
	    1 , 2 , 6 ,
	    6 , 1 , 5
	];
    this.shape_indices.push(indices);
}

Cube.prototype.name = function()
{
    return "Cube";
}
