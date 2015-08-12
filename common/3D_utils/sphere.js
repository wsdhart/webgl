"use strict";

function Sphere(gl , program , h_slices , v_slices)
{
    this.gl = gl;
    this.program = program;
    this.h_slices = h_slices;
    this.v_slices = v_slices;
}

Sphere.prototype = new Shape();

// learningwebgl / webkit team method.
Sphere.prototype.create_shape = function()
{
    var nodes = [];
    var horizontals = this.h_slices || 8;
    var horizontal_slice = Math.PI / horizontals;
    var verticals = this.v_slices || 8;
    var vertical_slice = 2 * Math.PI / verticals;
    for(var lattitude = 0; lattitude <= horizontals ; lattitude++)
    {
	var theta = lattitude * horizontal_slice;
	var sin_theta = Math.sin(theta);
	var cos_theta = Math.cos(theta);

	for(var longitude = 0; longitude <= verticals ; longitude++)
	{
	    var phi = longitude * vertical_slice;
	    var sin_phi = Math.sin(phi);
	    var cos_phi = Math.cos(phi);

	    var x = cos_phi * sin_theta;
	    var y = cos_theta;
	    var z = sin_phi * sin_theta;
	    nodes.push(x);
	    nodes.push(y);
	    nodes.push(z);
	}
    }
    return nodes;
}

    // learningwebgl / webkit team method.
Sphere.prototype.create_indexes = function()
{
    var indexes = [];
    var horizontals = this.h_slices || 8;
    var verticals = this.v_slices || 8;
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

Sphere.prototype.name = function()
{
    return "Sphere";
}