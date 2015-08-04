"use strict";

function Sphere(gl , program , h_slices , v_slices)
{
    this.gl = gl;
    this.program = program;

    var pos_matrix;
    var u_pos_matrix;

    var mov_matrix;
    var rot_matrix;

    var shape;
    var shape_indexes;
    var index_buffer;

    var x_theta = 0.0;
    var y_theta = 0.0;
    var z_theta = 0.0;

    var x_pos = 0.0;
    var y_pos = 0.0;
    var z_pos = 0.0;

    var vertex_buffer;
    var v_position;

    var color_buffer;
    var v_color;
    var colors = [];

    var primitive = 1;

    var created = false;

    this.create = function()
    {
	if(created)
	    return;

	shape = this.create_sphere(h_slices , v_slices);
	shape_indexes = this.create_indexes(h_slices , v_slices);

	pos_matrix = mat4.create();
	pos_matrix = mat4.identity(pos_matrix);
	pos_matrix = mat4.translate
	(
	    pos_matrix , pos_matrix , [0.0 , 0.0 , -4.0]
	);

	mov_matrix = mat4.create();
	rot_matrix = mat4.create();

	colors = create_grayscale(shape.length / 9 , colors);

	created = true;
    }

    this.render = function()
    {
	vertex_buffer = bind_buffer(gl , shape , vertex_buffer);
	v_position = bind_attribute
	(
	    gl , program , "v_position" , 3 , v_position
	);

	color_buffer = bind_buffer(gl , colors , color_buffer);
	v_color = bind_attribute(gl , program , "v_color" , 3 , v_color);

	index_buffer = bind_indices(gl , shape_indexes , index_buffer);

	mov_matrix = mat4.translate
	(
	    mov_matrix , pos_matrix , [x_pos , y_pos , z_pos]
	);

	rot_matrix = mat4.rotate
	(
	    rot_matrix ,
	    mov_matrix ,
	    x_theta ,
	    [1 , 0 , 0]
	);

	rot_matrix = mat4.rotate
	(
	    rot_matrix ,
	    rot_matrix ,
	    y_theta ,
	    [0 , 1 , 0]
	);

	rot_matrix = mat4.rotate
	(
	    rot_matrix ,
	    rot_matrix ,
	    z_theta ,
	    [0 , 0 , 1]
	);

	u_pos_matrix = gl.getUniformLocation(program , "u_pos_matrix");
	gl.uniformMatrix4fv(u_pos_matrix , false , rot_matrix);

	gl.drawElements
	(
	    primitive ,
	    shape_indexes.length ,
	    gl.UNSIGNED_SHORT ,
	    0
	);
    }

    this.rotate_x = function(radians)
    {
	x_theta = radians;
    }

    this.rotate_y = function(radians)
    {
	y_theta = radians;
    }

    this.rotate_z = function(radians)
    {
	z_theta = radians;
    }

    this.translate_x = function(pos)
    {
	x_pos = pos;
    }

    this.translate_y = function(pos)
    {
	y_pos = pos;
    }

    this.translate_z = function(pos)
    {
	z_pos = pos;
    }

    this.change_primitive = function(proto)
    {
	primitive = proto;
    }

    // learningwebgl / webkit team method.
    this.create_sphere = function(h_slices , v_slices)
    {
	var nodes = [];
	var horizontals = h_slices || 8;
	var horizontal_slice = Math.PI / horizontals;
	var verticals = v_slices || 8;
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
    this.create_indexes = function(h_slices , v_slices)
    {
	var indexes = [];
	var horizontals = h_slices || 8;
	var verticals = v_slices || 8;
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
}
