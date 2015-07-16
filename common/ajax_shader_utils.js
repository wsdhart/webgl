"use strict";

var callback;
var loading = 0;
var shaders = {};

/**
 * Convenience function for loading shaders via XMLHttpRequest.
 * @param {vert_shader_url} URL of vertex shader.
 * @param {frag_shader_url} URL of fragment shader.
 * @param {callback_func} function to call upon success.
 */
function load_shaders(vert_shader_url , frag_shader_url , callback_func)
{
    callback = callback_func;
    ajax_load(vert_shader_url);
    ajax_load(frag_shader_url);
}

/**
 * Load file from URL via XMLHttpRequest.
 * @param {url} URL of document to load.
 */
function ajax_load(url)
{
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function()
    {
	if(ajax.readyState == 4)
	{
	    if(ajax.status == 200)
		ajax_barrier(url , ajax.responseText);
	    else
		alert("Failed to load " + url);
	}
    };
    loading++;
    ajax.open('GET' , url , true);
    ajax.send();
}

/**
 * Barrier function for use with ajax_load(url)
 * Adds shaders to the shaders hash by their URL.
 * If loading semaphore == 0, calls callback function.
 * @param {url} URL of returned data.
 * @param {txt} text returned from URL.
 */
function ajax_barrier(url , txt)
{
    shaders[url] = txt;

    loading--;
    if(loading == 0)
	callback();
}
