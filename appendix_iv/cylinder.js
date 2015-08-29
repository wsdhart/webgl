"use strict";

function Cylinder(gl , program , h_slices , v_slices)
{
    this.gl = gl;
    this.program = program;
    this.h_slices = h_slices;
    this.v_slices = v_slices;
}

Cylinder.prototype = new Shape();

Cylinder.prototype.create_shapes = function()
{
    var nodes = [];
    var normals = [];
    var verticals = this.v_slices || 24;

    var pos = Math.PI / 2;
    var angle = (2 * Math.PI) / verticals;

    nodes.push(0.0);
    normals.push(0.0);
    nodes.push(1.0);
    normals.push(1.0);
    nodes.push(0.0);
    normals.push(0.0);

    for(var i = 0 ; i < (verticals * 3) ; i+=3)
    {
	nodes.push(Math.cos(pos));
	normals.push(Math.cos(pos));
	nodes.push(1.0);
	normals.push(1.0);
	nodes.push(Math.sin(pos));
	normals.push(Math.sin(pos));
	pos -= angle;
    }

    nodes.push(Math.cos(pos));
    normals.push(Math.cos(pos));
    nodes.push(1.0);
    normals.push(1.0);
    nodes.push(Math.sin(pos));
    normals.push(Math.sin(pos));

    this.shapes.push(nodes);
    this.shape_normals.push(normals);

    nodes = [];
    normals = [];
    var horizontals = this.h_slices || 2;
    var horizontal_slice = 2 / horizontals;
    var vertical_slice = 2 * Math.PI / verticals;

    for(var lattitude = 0; lattitude <= horizontals ; lattitude++)
    {
	var pos = 1 - (lattitude * horizontal_slice);
	for(var longitude = 0; longitude <= verticals ; longitude++)
	{
	    var theta = longitude * vertical_slice;
	    var x = Math.cos(theta);
	    var y = pos ;
	    var z = Math.sin(theta);
	    nodes.push(x);
	    normals.push(x);
	    nodes.push(y);
	    normals.push(y);
	    nodes.push(z);
	    normals.push(z);
	}
    }
    this.shapes.push(nodes);
    this.shape_normals.push(normals);

    nodes = [];
    normals = [];
    nodes.push(0.0);
    normals.push(0.0);
    nodes.push(-1.0);
    normals.push(-1.0);
    nodes.push(0.0);
    normals.push(0.0);

    for(var i = 0 ; i < (verticals * 3) ; i+=3)
    {
	nodes.push(Math.cos(pos));
	normals.push(Math.cos(pos));
	nodes.push(-1.0);
	normals.push(-1.0);
	nodes.push(Math.sin(pos));
	normals.push(Math.sin(pos));
	pos -= angle;
    }

    nodes.push(Math.cos(pos));
    normals.push(Math.cos(pos));
    nodes.push(-1.0);
    normals.push(-1.0);
    nodes.push(Math.sin(pos));
    normals.push(Math.sin(pos));

    this.shapes.push(nodes);
    this.shape_normals.push(normals);
}

Cylinder.prototype.create_indices = function()
{
    var indices = [];
    var verticals = this.v_slices || 24;

    for(var i = 0 ; i < verticals ; i++)
    {
	indices.push(0);
	indices.push(i + 1);
	indices.push(i + 2);
    }
    this.shape_indices.push(indices);

    indices = [];
    var horizontals = this.h_slices || 2;
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

Cylinder.prototype.create_normals = function()
{
    var normals;
    for(var j in this.shapes)
    {
	var points = this.shapes[j];
	var indices = this.shape_indices[j];
	normals = [];

	for(var i = 0 ; i < indices.length ; i += 3)
	{
	    var k = indices[i];
	    var x1 = points[k];
	    var y1 = points[k + 1];
	    var z1 = points[k + 2];

	    var m = indices[i + 1];
	    var x2 = points[m];
	    var y2 = points[m + 1];
	    var z2 = points[m + 2];

	    var n = indices[i + 2];
	    var x3 = points[n];
	    var y3 = points[n + 1];
	    var z3 = points[n + 2];

	    var t1x = x2 - x1;
	    var t1y = y2 - y1;
	    var t1z = z2 - z1;

	    var t2x = x3 - x1;
	    var t2y = y3 - y1;
	    var t2z = z3 - z1;

	    var cx = t1y * t2z - t1z * t2y;
	    var cy = t1z * t2x - t1x * t2z;
	    var cz = t1x * t2y - t1y * t2x;

	    cx /= 3;
	    cy /= 3;
	    cz /= 3;

	    normals.push(cx);
	    normals.push(cy);
	    normals.push(cz);
	}
	this.shape_normals.push(normals);
    }
}

Cylinder.prototype.name = function()
{
    return "Cylinder";
}
