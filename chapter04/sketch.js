"use strict";

var canvas;
var gl;
var program;

var vertex_buffer;
var v_position;
var vertices = [];

var color_buffer;
var v_color;
var current_color = [1.0 , 1.0 , 1.0];
var colors = [];

var div = 1.0 / 255;

var mouse_depressed = false;

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
    gl.clearColor(0.0 , 0.0 , 0.0 , 1.0);

    program = init_program(gl , "vertex-shader" , "fragment-shader");
    gl.useProgram(program);

    canvas.addEventListener("mousedown" , mouse_down);
    canvas.addEventListener("mouseup" , mouse_up);
    canvas.addEventListener("mousemove" , mouse_move);
    canvas.addEventListener("mouseout" , mouse_out);

    gl.lineWidth(1);
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.LINE_STRIP , 0 , vertices.length / 2);
}

function mouse_down(event)
{
    mouse_depressed = true;
    mouse_log(event.clientX , event.clientY);
}

function mouse_up(event)
{
    mouse_depressed = false;
}

function mouse_move(event)
{
    if(mouse_depressed)
	mouse_log(event.clientX , event.clientY);
}

function mouse_out(event)
{
    mouse_depressed = false;
}

function mouse_log(x , y)
{
    var rect = canvas.getBoundingClientRect();
    var x = x - rect.left;
    var y = y - rect.top;
    var width = canvas.width;
    var height = canvas.height;
    var dx = -1.0 + ((2.0 * x) / width);
    var dy = -1.0 + ((2.0 * (height - y)) / height);

    mouse_draw(dx , dy);
}

function mouse_draw(dx , dy)
{
    vertices.push(dx);
    vertices.push(dy);

    for(var i = 0 ; i < current_color.length ; i++)
	colors.push(current_color[i]);

    vertex_buffer = bind_buffer(gl , vertices , vertex_buffer);
    v_position = bind_attribute(gl , program , "v_position" , 2 , v_position);

    color_buffer = bind_buffer(gl , colors , color_buffer);
    v_color = bind_attribute(gl , program , "v_color" , 3 , v_color);

    render();
}

function set_color(color)
{
    var red = parseFloat(parseInt(color.substring(1 , 3) , 16));
    var green = parseFloat(parseInt(color.substring(3 , 5) , 16));
    var blue = parseFloat(parseInt(color.substring(5 , 7) , 16));

    current_color = [red * div , green * div , blue * div];
}

function set_thickness(thickness)
{
    if(1 <= thickness && thickness <= 8)
    {
	gl.lineWidth(thickness);
	render();
    }
}
