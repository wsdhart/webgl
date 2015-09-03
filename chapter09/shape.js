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
    this.shape_normals = [];
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

    var normal_buffer;
    var v_normal;

    this.ambient = [1 , 1 , 1 , 1];
    this.diffuse = [1 , 1 , 1 , 1];
    this.specula = [1 , 1 , 1 , 1];
    this.shiney = 20.0;

    this.wireframe = false;
    this.fill = true;

    var created = false;
}

Shape.prototype.create = function()
{
    if(this.created)
	return;

    this.create_shapes();
    this.create_indices();
    this.create_normals();

    this.pos_matrix = mat4.create();
    this.pos_matrix = mat4.identity(this.pos_matrix);
    this.pos_matrix = mat4.translate
    (
	this.pos_matrix , this.pos_matrix , [0.0 , 0.0 , -4.0]
    );

    this.mov_matrix = mat4.create();

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
	this.subrender(3);
    if(this.fill)
	this.subrender(5);
}

Shape.prototype.subrender = function(primitive)
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

	this.normal_buffer = bind_buffer
	(
	    this.gl , this.shape_normals[i] , this.normal_buffer
	);
	this.v_normal = bind_attribute
	(
	    this.gl , this.program , "v_normal" , 3 , this.v_normal
	);

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

Shape.prototype.create_normals = function()
{
    var normals = [];
    this.shape_normals.push(normals);
}
