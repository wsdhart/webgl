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

    var shape = new Cylinder(gl , program);
    shape.create();
    shapes.push(shape);

    shape = new Cone(gl , program);
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
