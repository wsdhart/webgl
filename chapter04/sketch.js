"use strict";

var canvas;
var gl;
var program;

var vertex_buffer;
var v_position;
var vertices = [];
var lines = [];

var color_buffer;
var v_color;
var current_color = [1.0 , 1.0 , 1.0];
var colors = [];
var shades = [];

var div = 1.0 / 255;

var mouse_depressed = false;
var ddx , ddy;

var span = 0.01;

window.onload = function init()
{
    canvas = document.getElementById("webgl-canvas");
    gl = WebGLUtils.setupWebGL(canvas , {preserveDrawingBuffer: true});
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
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);

    for(var i = 0 ; i < lines.length ; i++)
    {
	var points = lines[i];
	vertex_buffer = bind_buffer(gl , points , vertex_buffer);
	v_position = bind_attribute(gl , program ,
				    "v_position" , 2 , v_position);

	var dyes = shades[i];
	color_buffer = bind_buffer(gl , dyes , color_buffer);
	v_color = bind_attribute(gl , program , "v_color" , 3 , v_color);

	gl.drawArrays(gl.TRIANGLE_STRIP , 0 , points.length / 2);
    }
}

function mouse_down(event)
{
    vertices = [];
    colors = [];
    lines.push(vertices);
    shades.push(colors);
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
    var angle = Math.atan2(y - ddy , x - ddx);
    ddx = x ; ddy = y;

    mouse_draw(dx , dy , angle);
}

function mouse_draw(dx , dy , angle)
{
    var cosa = span * Math.cos(angle);
    var sina = span * Math.sin(angle);
    vertices.push(dx + sina);
    vertices.push(dy + cosa);
    vertices.push(dx - sina);
    vertices.push(dy - cosa);

    for(var i = 0 ; i < current_color.length ; i++)
	colors.push(current_color[i]);

    for(var i = 0 ; i < current_color.length ; i++)
	colors.push(current_color[i]);

    render();
}

function set_fgcolor(color)
{
    var red = parseInt(color.substring(1 , 3) , 16);
    var green = parseInt(color.substring(3 , 5) , 16);
    var blue = parseInt(color.substring(5 , 7) , 16);

    current_color = [red * div , green * div , blue * div];
}

function set_bgcolor(color)
{
    var red = parseInt(color.substring(1 , 3) , 16);
    var green = parseInt(color.substring(3 , 5) , 16);
    var blue = parseInt(color.substring(5 , 7) , 16);

    gl.clearColor(red * div , green * div , blue * div , 1.0);
    render();
}

function set_thickness(thickness)
{
    thickness = parseFloat(thickness);
    if(0.01 <= thickness)
	span = thickness;
}

function undo()
{
    lines.pop();
    shades.pop();
    render();
}

function save()
{
    var image = canvas.toDataURL('image/png');

    var a = document.createElement('a');
    a.href = image;
    a.download = "webgl-image.png";
    a.click();
}
