"use strict";

var gl;
var polygon;
var program;
var vertex_buffer;
var color_buffer;
var colors;
var v_color;
var v_position;

var sides = 3;
var subdivisions = 0;
var holes = false;
var theta = 0.0;
var u_theta;

var to_radians = Math.PI / 180.0;

var primitive = 4;

var u_option;
var option = 0;

window.onload = function init()
{
    var canvas = document.getElementById("webgl-canvas");
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

    program = init_program(gl , "vertex-shader" , "fragment-shader");
    gl.useProgram(program);

    polygon = create_polygon(sides);

    bindings();

    u_option = gl.getUniformLocation(program , "u_option");
    u_theta = gl.getUniformLocation(program , "u_theta");
}

function bindings()
{
    bind_colors();
    bind_vertices();
}

function bind_colors()
{
    colors = create_rgb(polygon.length / 6 , colors);
    color_buffer = bind_buffer(gl , colors , color_buffer);
    v_color = bind_attribute(gl , program , "v_color" , 3 , v_color);
}

function bind_vertices()
{
    vertex_buffer = bind_buffer(gl , polygon , vertex_buffer);
    v_position = bind_attribute(gl, program , "v_position" , 2 , v_position);
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(primitive , 0 , polygon.length / 2);
}

function update_angle(angle)
{
    if(angle)
	theta = angle * to_radians;
    gl.uniform1f(u_theta , theta);
    render();
}

function update_subdivide(steps)
{
    if(steps > subdivisions)
    {
	var diff = steps - subdivisions;
	for(var i = 0 ; i < diff ; i++)
	    polygon = split_vertices(polygon , holes);
	subdivisions = steps;
	bindings();
	update_angle();
    }
    else if(steps < subdivisions)
    {
	subdivisions = steps;
	update_polygon(sides , true);
    }
}

function update_polygon(faces , force)
{
    if(sides != faces || force)
    {
	polygon = create_polygon(faces);
	sides = faces;
	for(var i = 0 ; i < subdivisions ; i++)
	    polygon = split_vertices(polygon , holes);
	bindings();
	update_angle();
    }
}

function update_gasket(gasket)
{
    holes = gasket;
    update_polygon(sides , true);
}

function update_primitive(type)
{
    if(0 <= type && type <= 6)
    {
	primitive = type;
	update_angle();
    }
}

function update_option(choice)
{
    if(0 <= choice && choice <= 2)
    {
	option = choice;
	gl.uniform1i(u_option , option);
	update_angle();
    }
}
