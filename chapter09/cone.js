"use strict";

function Cone(gl , program , h_slices , v_slices)
{
    this.gl = gl;
    this.program = program;
    this.h_slices = h_slices;
    this.v_slices = v_slices;
}

Cone.prototype = new Shape();

Cone.prototype.create_shapes = function()
{
    var nodes = [];
    var horizontals = this.h_slices || 2;
    var horizontal_slice = 2 / horizontals;
    var verticals = this.v_slices || 24;
    var vertical_slice = 2 * Math.PI / verticals;

    for(var lattitude = 0; lattitude <= horizontals ; lattitude++)
    {
	var width = lattitude * horizontal_slice;
	var pos = 1 - width;
	width /= 2;
	for(var longitude = 0; longitude <= verticals ; longitude++)
	{
	    var theta = longitude * vertical_slice;
	    var x = Math.cos(theta) * width;
	    var y = pos ;
	    var z = Math.sin(theta) * width;
	    nodes.push(x);
	    nodes.push(y);
	    nodes.push(z);
	}
    }

    this.shapes.push(nodes);
    nodes = [];

    var pos = Math.PI / 2;
    var angle = (2 * Math.PI) / verticals;

    nodes.push(0.0);
    nodes.push(-1.0);
    nodes.push(0.0);

    for(var i = 0 ; i < (verticals * 3) ; i+=3)
    {
	nodes.push(Math.cos(pos));
	nodes.push(-1.0);
	nodes.push(Math.sin(pos));
	pos -= angle;
    }

    nodes.push(Math.cos(pos));
    nodes.push(-1.0);
    nodes.push(Math.sin(pos));

    this.shapes.push(nodes);
}

Cone.prototype.create_indices = function()
{
    var indices = [];
    var horizontals = this.h_slices || 2;
    var verticals = this.v_slices || 24;
    for(var lattitude = 0; lattitude < horizontals ; lattitude++)
    {
	for(var longitude = 0; longitude < verticals ; longitude++)
	{
	    var first = (lattitude * (verticals + 1)) + longitude;
	    var second = first + verticals + 1;
	    indices.push(first);
	    indices.push(second);
	    indices.push(first + 1);
	    indices.push(second);
	    indices.push(second + 1);
	    indices.push(first + 1);
	}
    }
    this.shape_indices.push(indices);

    indices = [];
    for(var i = 0 ; i < verticals ; i++)
    {
	indices.push(0);
	indices.push(i + 1);
	indices.push(i + 2);
    }
    this.shape_indices.push(indices);
}

Cone.prototype.create_normals = function()
{
    var normals;
    for(var j in this.shapes)
    {
	var points = this.shapes[j];
	normals = [];

	for(var i in points)
	{
	    if(j == 0)
		normals.push(points[i]);
	    else
		normals.push(i % 3 == 1 ? -1 : 0);
	}

	this.shape_normals.push(normals);
    }
}

Cone.prototype.name = function()
{
    return "Cone";
}
