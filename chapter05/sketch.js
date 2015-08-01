"use strict";

var canvas;
var gl;
var program;

var pos_matrix;
var u_pos_matrix;

var perspective;
var u_perspective;

var rot_matrix;

var shape;
var theta = 0.0;

var vertex_buffer;
var v_position;

var color_buffer;
var v_color;

var to_radians = Math.PI / 180.0;

var primitive = 1;

window.onload = function init()
{
    canvas = document.getElementById("webgl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if(gl)
    {
	setup();
	render();
    }
    else
    { alert("Failed initialising WebGL"); }
}

function setup()
{
    gl.viewport(0 , 0 , gl.drawingBufferWidth , gl.drawingBufferHeight);
    gl.clearColor(1.0 , 1.0 , 1.0 , 1.0);
    gl.lineWidth(10.0);

    program = init_program(gl , "vertex-shader" , "fragment-shader");
    gl.useProgram(program);

    shape = create_sphere();

    pos_matrix = mat4.create();
    pos_matrix = mat4.identity(pos_matrix);
    pos_matrix = mat4.translate(pos_matrix , pos_matrix , [0.0 , 0.0 , -4.0]);

    perspective = mat4.create();
    perspective = mat4.identity(perspective);
    perspective = mat4.perspective
    (
	perspective ,
	45.0 ,
	gl.viewportWidth / gl.viewportHeight ,
	0.1 ,
	100.0
    );
    perspective[0] = 1.7;

    rot_matrix = mat4.create();
}

function render()
{
    vertex_buffer = bind_buffer(gl , shape , vertex_buffer);
    v_position = bind_attribute(gl , program , "v_position" , 3 , v_position);

    rot_matrix = mat4.rotate
    (
	rot_matrix ,
	pos_matrix ,
	theta++ * to_radians ,
	[0 , 1 , 1]
    );

    u_pos_matrix = gl.getUniformLocation(program , "u_pos_matrix");
    gl.uniformMatrix4fv(u_pos_matrix , false , rot_matrix);

    u_perspective = gl.getUniformLocation(program , "u_perspective");
    gl.uniformMatrix4fv(u_perspective , false , perspective);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(primitive , 0 , shape.length / 3);

    requestAnimFrame(render);
}

function update_primitive(type)
{
    if(0 <= primitive && primitive <= 6)
	primitive = type;
}

// learningwebgl / webkit team method.
function create_sphere()
{
    var nodes = [];
    var horizontals = 100;
    var horizontal_slice = Math.PI / horizontals;
    var verticals = 10;
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
