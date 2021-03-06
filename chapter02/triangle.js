"use strict";

var gl;
var polygon;
var program;
var vertex_buffer;

var sides = 3;
var subdivisions = 0;
var holes = false;
var theta = 0.0;

var to_radians = Math.PI / 180.0;

var primitive = 4;

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
}

function render(vertices)
{
    if(!vertices)
	vertices = polygon;
    vertex_buffer = bind_buffer(gl , vertices);
    bind_attribute(gl, program , "v_position" , 2);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(primitive , 0 , polygon.length / 2);
}

function update_angle(angle)
{
    if(angle)
	theta = angle * to_radians;
    var twisted = twist_points(polygon , theta);
    render(twisted);
}

function update_serpinski(steps)
{
    if(steps > subdivisions)
    {
	var diff = steps - subdivisions;
	for(var i = 0 ; i < diff ; i++)
	    polygon = split_vertices(polygon , holes);
	subdivisions = steps;
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
	update_angle();
    }
}

function update_holes(aperture)
{
    holes = aperture;
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
