"use strict";

var canvas;
var gl;
var program;

var perspective;
var u_perspective;

var to_radians = Math.PI / 180.0;

var shapes = [];
var current = 0;

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
    gl.enable(gl.DEPTH_TEST);

    program = init_program(gl , "vertex-shader" , "fragment-shader");
    gl.useProgram(program);

    var shape = new Sphere(gl , program , 10 , 3);
    shape.create();
    shapes.push(shape);

    shape = new Cube(gl , program);
    shape.create();
    shapes.push(shape);

    perspective = mat4.create();
    perspective = mat4.identity(perspective);
    perspective = mat4.perspective
    (
	perspective ,
	45.0 ,
	gl.drawingBufferWidth / gl.drawingBufferHeight ,
	0.1 ,
	100.0
    );
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    u_perspective = gl.getUniformLocation(program , "u_perspective");
    gl.uniformMatrix4fv(u_perspective , false , perspective);

    for(var i = 0 ; i < shapes.length ; i++)
	shapes[i].render();
}

function update_draw_type(type)
{
    if(shapes[current])
    {
	if(type == 0)
	    shapes[current].change_draw_type(true , false);
	else if(type == 1)
	    shapes[current].change_draw_type(true , true);
	else if(type == 2)
	    shapes[current].change_draw_type(false , true);
	else
	    return;
	render();
    }
}

function rotate_x(angle)
{
    shapes[current].x_theta = angle * to_radians;

    render();
}

function rotate_y(angle)
{
    shapes[current].y_theta = angle * to_radians;

    render();
}

function rotate_z(angle)
{
    shapes[current].z_theta = angle * to_radians;

    render();
}

function translate_x(pos)
{
    shapes[current].x_pos = pos;

    render();
}

function translate_y(pos)
{
    shapes[current].y_pos = pos;

    render();
}

function translate_z(pos)
{
    shapes[current].z_pos = pos;

    render();
}
