"use strict";

var canvas;
var gl;
var program;

var perspective;
var u_perspective;

var u_ambient;
var u_diffuse;
var u_specula;
var u_shiney;

var u_lights = [];
var lights = [];
var current_light = 0;

var to_radians = Math.PI / 180.0;
var to_degrees = 180.0 / Math.PI;

var shapes = [];
var current_shape = 0;

var mapping = 0;

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
    gl.lineWidth(1.0);
    gl.polygonOffset(0.0 , 0.0);
    gl.enable(gl.DEPTH_TEST);

    program = init_program(gl , "vertex-shader" , "fragment-shader");
    gl.useProgram(program);

    perspective = mat4.create();
    perspective = mat4.identity(perspective);
    perspective = mat4.perspective
    (
	perspective ,
	45.0 ,
	gl.drawingBufferWidth / gl.drawingBufferHeight ,
	0.001 ,
	60.0
    );


    u_shiney = gl.getUniformLocation(program , "u_shiney");

    for(var j = 0 ; j < 1 ; j++)
    {
	var light = new Light(gl , program);
	light.name = "Light " + j;
	lights.push(light);
    }

    for(var i = 0 ; i < lights.length ; i++)
    {
	u_lights[i] = {};

	u_lights[i].position =
	    gl.getUniformLocation(program , "lights["+i+"].position");

	u_lights[i].ambient =
	    gl.getUniformLocation(program , "lights["+i+"].ambient");

	u_lights[i].diffuse =
	    gl.getUniformLocation(program , "lights["+i+"].diffuse");

	u_lights[i].specula =
	    gl.getUniformLocation(program , "lights["+i+"].specula");

	u_lights[i].enabled =
	    gl.getUniformLocation(program , "lights["+i+"].enabled");
    }

    update_object_list();
}

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    u_perspective = bind_matrix
    (gl , program , "u_perspective" , perspective , u_perspective);

    for(var j = 0 ; j < shapes.length ; j++)
    {
	var shape = shapes[j];

	u_ambient =
	    bind_vec4(gl , program , "u_ambient" , shape.ambient , u_ambient);
	u_diffuse =
	    bind_vec4(gl , program , "u_diffuse" , shape.diffuse , u_diffuse);
	u_specula =
	    bind_vec4(gl , program , "u_specula" , shape.specula , u_specula);
	gl.uniform1f(u_shiney , shape.shiney);

	for(var i = 0 ; i < lights.length ; i++)
	{
	    u_lights[i].position = bind_vec4
	    (
		gl , program , "u_lights[" + i + "].position" ,
		lights[i].position , u_lights[i].position
	    );
	    u_lights[i].ambient = bind_vec4
	    (
		gl , program , "u_lights[" + i + "].ambient" ,
		lights[i].ambient , u_lights[i].ambient
	    );
	    u_lights[i].diffuse = bind_vec4
	    (
		gl , program , "u_lights[" + i + "].diffuse" ,
		lights[i].diffuse , u_lights[i].diffuse
	    );
	    u_lights[i].specula = bind_vec4
	    (
		gl , program , "u_lights[" + i + "].specula" ,
		lights[i].specula , u_lights[i].specula
	    );
	    gl.uniform1i(u_lights[i].enabled , lights[i].enabled);
	}

	var u_mapping = gl.getUniformLocation(program , "mapping");
	gl.uniform1i(u_mapping , mapping);

	shape.render();
    }
}

function create_object(type)
{
    var element = document.getElementById("create_object");
    element.selectedIndex = 0;

    var shape , texture;
    var funk = function()
    {
	shape.set_image_texture(texture);
	render();
    }

    if(type == 2)
    {
	shape = new Sphere(gl , program , 15 , 15);
	shape.create();
    }
    else if(type == 16)
    {
	shape = new Sphere(gl , program , 15 , 15);
	shape.create();
	shape.id = "Checkerboard Sphere";
	texture = create_checkerboard(64 , 64);
	shape.set_data_texture(texture , 64 , 64);
    }
    else if(type == 32)
    {
	shape = new Sphere(gl , program , 15 , 15);
	shape.create();
	shape.id = "Mercury";
	shape.x_scale = 0.2;
	shape.y_scale = 0.2;
	texture = load_image("mercury.jpg", funk);
    }
    else if(type == 64)
    {
	shape = new Sphere(gl , program , 15 , 15);
	shape.create();
	shape.id = "Venus";
	shape.x_scale = 0.8;
	shape.y_scale = 0.8;
	texture = load_image("venus.jpg", funk);
    }
    else if(type == 128)
    {
	shape = new Sphere(gl , program , 15 , 15);
	shape.create();
	shape.id = "Earth";
	texture = load_image("earth.jpg", funk);
    }
    else if(type == 256)
    {
	shape = new Sphere(gl , program , 15 , 15);
	shape.create();
	shape.id = "Moon";
	shape.x_scale = 0.1;
	shape.y_scale = 0.1;
	texture = load_image("moon.gif", funk);
    }
    else if(type == 512)
    {
	shape = new Sphere(gl , program , 15 , 15);
	shape.create();
	shape.id = "Mars";
	shape.x_scale = 0.4;
	shape.y_scale = 0.4;
	texture = load_image("mars.jpg", funk);
    }
    else if(type == 1024)
    {
	shape = new Sphere(gl , program , 15 , 15);
	shape.create();
	shape.id = "Jupiter";
	shape.x_scale = 2.0;
	shape.y_scale = 2.0;
	texture = load_image("jupiter.jpg", funk);
    }
    else if(type == 2048)
    {
	shape = new Sphere(gl , program , 15 , 15);
	shape.create();
	shape.id = "Neptune";
	shape.x_scale = 1.5;
	shape.y_scale = 1.5;
	texture = load_image("neptune.jpg", funk);
    }
    else return ;

    shapes.push(shape);

    update_object_list();
    select_object(shapes.length - 1);

    render();
}

function select_object(item)
{
    current_shape = item;

    var input;

    input = document.getElementById("select_object");
    input.selectedIndex = item;

    var current_object = shapes[current_shape];
    if(!current_object)
	return

    input = document.getElementById("rotate_x");
    input.value = current_object.x_theta * to_degrees;
    input = document.getElementById("rotate_y");
    input.value = current_object.y_theta * to_degrees;
    input = document.getElementById("rotate_z");
    input.value = current_object.z_theta * to_degrees;

    input = document.getElementById("translate_x");
    input.value = current_object.x_pos;
    input = document.getElementById("translate_y");
    input.value = current_object.y_pos;
    input = document.getElementById("translate_z");
    input.value = current_object.z_pos;

    input = document.getElementById("ambient_color");
    input.value = get_color(current_object.ambient);

    input = document.getElementById("diffuse_color");
    input.value = get_color(current_object.diffuse);

    input = document.getElementById("specula_color");
    input.value = get_color(current_object.specula);

    input = document.getElementById("shininess");
    input.value = current_object.shiney;

    input = document.getElementById("scale_x");
    input.value = current_object.x_scale;
    input = document.getElementById("scale_y");
    input.value = current_object.y_scale;
}

function update_object_list()
{
    var list = document.getElementById("select_object");

    while(list.firstChild)
	list.removeChild(list.firstChild);

    for(var i = 0 ; i < shapes.length ; i++)
    {
	var option = document.createElement("option");
	option.value = i;
	option.text = shapes[i].name();
	list.add(option , i);
    }

    var panel = document.getElementById("object_panel");

    if(shapes.length == 0)
	panel.style.display = 'none';
    else
	panel.style.display = 'inline';
}

function select_light(item)
{
    var input = document.getElementById("select_light");
    input.selectedItem = item;

    current_light = item;

    input = document.getElementById("light_x");
    input.value = lights[current_light].position[0];

    input = document.getElementById("light_y");
    input.value = lights[current_light].position[1];

    input = document.getElementById("light_z");
    input.value = lights[current_light].position[2];

    input = document.getElementById("ambient_light");
    input.value = get_color(lights[current_light].ambient);

    input = document.getElementById("diffuse_light");
    input.value = get_color(lights[current_light].diffuse);

    input = document.getElementById("specula_light");
    input.value = get_color(lights[current_light].specula);

    input = document.getElementById("light_enabled");
    input.checked = lights[current_light].enabled;
}

function update_lights()
{
    var list = document.getElementById("select_light");

    while(list.firstChild)
	list.removeChild(list.firstChild);

    for(var i = 0 ; i < lights.length ; i++)
    {
	var option = document.createElement("option");
	option.value = i;
	option.text = lights[i].name;
	list.add(option , i);
    }
}

function delete_object()
{
    var j = 0;
    for(var i = 0 ; i < shapes.length ; i++)
    {
	shapes[j++] = i != current_shape ? shapes[i] : shapes[++i];
    }
    shapes.pop();

    update_object_list();
    select_object(0);

    render();
}

function rotate_x(angle)
{
    if(shapes[current_shape])
    {
	shapes[current_shape].x_theta = angle * to_radians;
	render();
    }
}

function rotate_y(angle)
{
    if(shapes[current_shape])
    {
	shapes[current_shape].y_theta = angle * to_radians;
	render();
    }
}

function rotate_z(angle)
{
    if(shapes[current_shape])
    {
	shapes[current_shape].z_theta = angle * to_radians;
	render();
    }
}

function translate_x(pos)
{
    if(shapes[current_shape])
    {
	shapes[current_shape].x_pos = pos;
	render();
    }
}

function translate_y(pos)
{
    if(shapes[current_shape])
    {
	shapes[current_shape].y_pos = pos;
	render();
    }
}

function translate_z(pos)
{
    if(shapes[current_shape])
    {
	shapes[current_shape].z_pos = pos;
	render();
    }
}

function scale_x(pos)
{
    if(shapes[current_shape])
    {
	shapes[current_shape].x_scale = pos;
	render();
    }
}

function scale_y(pos)
{
    if(shapes[current_shape])
    {
	shapes[current_shape].y_scale = pos;
	render();
    }
}

function shininess(pos)
{
    if(shapes[current_shape])
    {
	shapes[current_shape].shiney = pos;
	render();
    }
}

function set_ambientcolor(color)
{
    if(shapes[current_shape])
    {
	shapes[current_shape].ambient = set_color(color);
	render();
    }
}

function set_diffusecolor(color)
{
    if(shapes[current_shape])
    {
	shapes[current_shape].diffuse = set_color(color);
	render();
    }
}

function set_speculacolor(color)
{
    if(shapes[current_shape])
    {
	shapes[current_shape].specula = set_color(color);
	render();
    }
}

function set_bgcolor(color)
{
    var bg_color = set_color(color);
    gl.clearColor(bg_color[0] , bg_color[1] , bg_color[2] , bg_color[3]);

    render();
}

function light_x(pos)
{
    if(lights[current_light])
    {
	lights[current_light].position[0] = pos;
	render();
    }
}

function light_y(pos)
{
    if(lights[current_light])
    {
	lights[current_light].position[1] = pos;
	render();
    }
}

function light_z(pos)
{
    if(lights[current_light])
    {
	lights[current_light].position[2] = pos;
	render();
    }
}

function light_enabled(enabled)
{
    if(lights[current_light])
    {
	lights[current_light].enabled = !lights[current_light].enabled;
	render();
    }
}

function set_ambientlight(color)
{
    if(lights[current_light])
    {
	lights[current_light].ambient = set_color(color);
	render();
    }
}

function set_diffuselight(color)
{
    if(lights[current_light])
    {
	lights[current_light].diffuse = set_color(color);
	render();
    }
}

function set_speculalight(color)
{
    if(lights[current_light])
    {
	lights[current_light].specula = set_color(color);
	render();
    }
}

function select_mapping(type)
{
    mapping = type;
    render();
}
