"use strict";

function Cylinder(gl , program , h_slices , v_slices)
{
    this.gl = gl;
    this.program = program;
    this.h_slices = h_slices;
    this.v_slices = v_slices;
}

Cylinder.prototype = new Shape();

Cylinder.prototype.create_shape = function()
{
    var nodes = [];
    var horizontals = this.h_slices || 2;
    var horizontal_slice = 2 / horizontals;
    var verticals = this.v_slices || 24;
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
	    nodes.push(y);
	    nodes.push(z);
	}
    }
    return nodes;
}

Cylinder.prototype.create_indexes = function()
{
    var indexes = [];
    var horizontals = this.h_slices || 2;
    var verticals = this.v_slices || 24;
    for(var lattitude = 0; lattitude < horizontals ; lattitude++)
    {
	for(var longitude = 0; longitude < verticals ; longitude++)
	{
	    var first = (lattitude * (verticals + 1)) + longitude;
	    var second = first + verticals + 1;
	    indexes.push(first);
	    indexes.push(second);
	    indexes.push(first + 1);
	    indexes.push(second);
	    indexes.push(second + 1);
	    indexes.push(first + 1);
	}
    }
    return indexes ;
}

Cylinder.prototype.name = function()
{
    return "Cylinder";
}
