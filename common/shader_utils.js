"use strict";

/**
 * Create and return a compiled shader program from the shader id's provided.
 * @param {gl} the WebGLRenderingContext.
 * @param {vert_shader_id} document id of the vertex shader.
 * @param {frag_shader_id} document id of the fragment shader.
 * @return {program} WebGLProgram with WebGLShaders attached and linked.
 */
function init_program(gl , vert_shader_id , frag_shader_id)
{
    var program;
    var vert_shader = fetch_shader(gl , vert_shader_id , gl.VERTEX_SHADER);
    var frag_shader = fetch_shader(gl , frag_shader_id , gl.FRAGMENT_SHADER);

    if(vert_shader && frag_shader)
    {
	program = gl.createProgram();
	gl.attachShader(program , vert_shader);
	gl.attachShader(program , frag_shader);
	gl.linkProgram(program);
	if(!gl.getProgramParameter(program , gl.LINK_STATUS))
	{
	    console.log
	    (
		"Failed to link program " + gl.getProgramInfoLog(program)
	    );
	}
    }
    return program;
}

/**
 * Fetch the shader in the given context with the id as type.
 * @param {gl} WebGLRenderingContext.
 * @param {id} document id.
 * @param {type} type of WebGLShader to load as.
 * @return {shader} compiled WebGLShader.
 */
function fetch_shader(gl , id , type)
{
    var shader;
    var shader_txt = document.getElementById(id);
    if(shader_txt)
    {
	shader = gl.createShader(type);
	gl.shaderSource(shader , shader_txt.text);
	gl.compileShader(shader);
	if(!gl.getShaderParameter(shader , gl.COMPILE_STATUS))
	{
	    console.log
	    (
		"Failed to compile shader " + gl.getShaderInfoLog(shader)
	    );
	}
    }
    return shader;
}

/**
 * Bind nodes to gpu buffer.
 * @param {gl} WebGLRenderingContext.
 * @param {nodes} JavaScript array to be bound.
 * @return {buffer} bound buffer.
 */
function bind_buffer(gl, nodes , buffer)
{
    if(!buffer)
	buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER , buffer);
    gl.bufferData(gl.ARRAY_BUFFER , new Float32Array(nodes) , gl.STATIC_DRAW);
    return buffer;
}

/**
 * Bind shader attribute.
 * @param {gl} WebGLRenderingContext.
 * @param {shader} WebGLShader for attribute.
 * @param {attribute_name} name of attribute in shader to bind.
 * @param {size} number of points per vertex [2|3|4]
 * @return {attribute} bound attribute.
 */
function bind_attribute(gl, shader , attribute_name , size)
{
    var attribute = gl.getAttribLocation(shader , attribute_name);
    gl.vertexAttribPointer(attribute , size , gl.FLOAT , false , 0 , 0);
    gl.enableVertexAttribArray(attribute);
    return attribute;
}
