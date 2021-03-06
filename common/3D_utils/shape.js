"use strict";

function Shape(gl , program)
{
    this.gl = gl;
    this.program = program;

    var pos_matrix;
    var u_pos_matrix;

    var mov_matrix;

    this.shapes = [];
    this.shape_indices = [];
    var index_buffer;

    this.x_theta = 0.0;
    this.y_theta = 0.0;
    this.z_theta = 0.0;

    this.x_pos = 0.0;
    this.y_pos = 0.0;
    this.z_pos = 0.0;

    this.x_scale = 1.0;
    this.y_scale = 1.0;

    var vertex_buffer;
    var v_position;

    var u_color;
    this.fill_color = [1 , 1 , 1 , 1];
    this.trim_color = [0 , 0 , 0 , 1];

    this.wireframe = true;
    this.fill = false;

    var created = false;
}

Shape.prototype.create = function()
{
    if(this.created)
	return;

    this.create_shapes();
    this.create_indices();

    this.pos_matrix = mat4.create();
    this.pos_matrix = mat4.identity(this.pos_matrix);
    this.pos_matrix = mat4.translate
    (
	this.pos_matrix , this.pos_matrix , [0.0 , 0.0 , -4.0]
    );

    this.mov_matrix = mat4.create();

    this.u_color = gl.getUniformLocation(program , "u_color");

    this.created = true;
}

Shape.prototype.update_matrices = function()
{
    this.mov_matrix = mat4.translate
    (
	this.mov_matrix , this.pos_matrix ,
	[this.x_pos , this.y_pos , this.z_pos]
    );

    this.mov_matrix = mat4.rotate
    (
	this.mov_matrix , this.mov_matrix ,
	this.x_theta , [1 , 0 , 0]
    );

    this.mov_matrix = mat4.rotate
    (
	this.mov_matrix , this.mov_matrix ,
	this.y_theta , [0 , 1 , 0]
    );

    this.mov_matrix = mat4.rotate
    (
	this.mov_matrix , this.mov_matrix ,
	this.z_theta , [0 , 0 , 1]
    );

    this.mov_matrix = mat4.scale
    (
	this.mov_matrix , this.mov_matrix ,
	[this.x_scale , this.y_scale , this.x_scale]
    );
}

Shape.prototype.render = function()
{
    this.update_matrices();
    if(this.wireframe)
	this.subrender(3 , this.trim_color);
    if(this.fill)
	this.subrender(5 , this.fill_color);
}

Shape.prototype.subrender = function(primitive , color)
{
    for(var i = 0 ; i < this.shapes.length ; i++)
    {
	this.vertex_buffer = bind_buffer
	(
	    this.gl , this.shapes[i] , this.vertex_buffer
	);
	this.v_position = bind_attribute
	(
	    this.gl , this.program , "v_position" , 3 , this.v_position
	);

	this.gl.uniform4fv(this.u_color , new Float32Array(color));

	this.index_buffer = bind_indices
	(
	    this.gl , this.shape_indices[i] , this.index_buffer
	);

	this.u_pos_matrix = this.gl.getUniformLocation
	(
	    this.program , "u_pos_matrix"
	);
	this.gl.uniformMatrix4fv(this.u_pos_matrix , false , this.mov_matrix);

	this.gl.drawElements
	(
	    primitive ,
	    this.shape_indices[i].length ,
	    this.gl.UNSIGNED_BYTE ,
	    0
	);
    }
}

Shape.prototype.name = function()
{
    return "Unknown";
}

Shape.prototype.size = function()
{
    var count = 0;
    for(var i = 0 ; i < this.shape_indices.length ; i++)
	count += this.shape_indices[i].length;
    return count;
}

Shape.prototype.change_draw_type = function(wire,solid)
{
    this.wireframe = wire;
    this.fill = solid;
}

Shape.prototype.create_shapes = function()
{
    var nodes = [];
    this.shapes.push(nodes);
}

Shape.prototype.create_indices = function()
{
    var indices = [];
    this.shape_indices.push(indices);
}
