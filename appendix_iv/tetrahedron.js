"use strict";

function Tetrahedron(gl , program)
{
    this.gl = gl;
    this.program = program;
}

Tetrahedron.prototype = new Shape();

Tetrahedron.prototype.create_shapes = function()
{
    var nodes =
	[
	    1 , 1 , 1 ,
	    1 , (-1) , (-1) ,
	    (-1) , 1 , (-1) ,
	    (-1) , (-1) , 1
	];
    this.shapes.push(nodes);
}

Tetrahedron.prototype.create_indices = function()
{
    var indices =
	[
	    0 , 1 , 2 , 0 ,
	    1 , 2 , 3 , 1 ,
	    3 , 1 , 0 , 3 ,
	    0 , 2 , 3 , 0
	];
    this.shape_indices.push(indices);
}

Tetrahedron.prototype.create_normals = function()
{
    var points = this.shapes[0];
    var normals = [];

    for(var point in points)
	normals.push(points[point]);

    this.shape_normals.push(normals);
}

Tetrahedron.prototype.name = function()
{
    return "Tetrahedron";
}
