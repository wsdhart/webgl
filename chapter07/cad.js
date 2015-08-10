"use strict";

var canvas;
var gl;
var program;

var perspective;
var u_perspective;

var to_radians = Math.PI / 180.0;
var to_degrees = 180.0 / Math.PI;

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

    var shape = new Cylinder(gl , program);
    shape.create();
    shapes.push(shape);

    shape = new Cone(gl , program);
    shape.create();
    shapes.push(shape);

    update_object_list();

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

function update_primitive(type)
{
    if(0 <= type && type <= 6)
	shapes[current].change_primitive(type);

    render();
}

function rotate_x(angle)
{
    shapes[current].rotate_x(angle * to_radians);

    render();
}

function rotate_y(angle)
{
    shapes[current].rotate_y(angle * to_radians);

    render();
}

function rotate_z(angle)
{
    shapes[current].rotate_z(angle * to_radians);

    render();
}

function translate_x(pos)
{
    shapes[current].translate_x(pos);

    render();
}

function translate_y(pos)
{
    shapes[current].translate_y(pos);

    render();
}

function translate_z(pos)
{
    shapes[current].translate_z(pos);

    render();
}

function scale_x(pos)
{
    shapes[current].scale_x(pos);

    render();
}

function scale_y(pos)
{
    shapes[current].scale_y(pos);

    render();
}

function select_object(item)
{
    current = item;
    var input = document.getElementById("primitive");
    input.value = shapes[current].primitive;

    input = document.getElementById("rotate_x");
    input.value = shapes[current].x_theta * to_degrees;
    input = document.getElementById("rotate_y");
    input.value = shapes[current].y_theta * to_degrees;
    input = document.getElementById("rotate_z");
    input.value = shapes[current].z_theta * to_degrees;

    input = document.getElementById("translate_x");
    input.value = shapes[current].x_pos;
    input = document.getElementById("translate_y");
    input.value = shapes[current].y_pos;
    input = document.getElementById("translate_z");
    input.value = shapes[current].z_pos;

    input = document.getElementById("draw_color");
    input.value = get_color(shapes[current].color);

    input = document.getElementById("scale_x");
    input.value = shapes[current].x_scale;
    input = document.getElementById("scale_y");
    input.value = shapes[current].y_scale;
}

function update_object_list()
{
    var list = document.getElementById("select_object");
    for(var i = 0 ; i < shapes.length ; i++)
    {
	var option = document.createElement("option");
	option.value = i;
	option.text = shapes[i].name();
	list.add(option , i);
    }
}

function set_fgcolor(color)
{
    shapes[current].color = set_color(color);

    render();
}

function set_bgcolor(color)
{
    var bg_color = set_color(color);
    gl.clearColor(bg_color[0] , bg_color[1] , bg_color[2] , bg_color[3]);

    render();
}
