"use strict";

var gl;
var polygon;
var program;
var vertex_buffer;
var color_buffer;

var sides = 3;
var subdivisions = 0;
var holes = false;
var theta = 0.0;

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

    render();
}

function render(vertices)
{
    if(!vertices)
	vertices = polygon;
    vertex_buffer = bind_buffer(gl , vertices);
    bind_attribute(gl, program , "v_position" , 2);

    var colors = create_colors(polygon.length / 6);
    color_buffer = bind_buffer(gl , colors , color_buffer);
    bind_attribute(gl , program , "v_color" , 3);

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES , 0 , polygon.length / 2);
}

function update_angle(angle)
{
    theta = (angle * Math.PI / 180.0);
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
	update_angle(theta * 180.0 / Math.PI);
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
	update_angle(theta * 180.0 / Math.PI);
    }
}

function update_holes(aperture)
{
    holes = aperture;
    update_polygon(sides , true);
}
