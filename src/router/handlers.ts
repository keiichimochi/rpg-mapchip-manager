import { IRequest } from 'itty-router';
import { Env } from '../types/env';
import { execSQL, execSQLAll } from '../db/queries';

export async function handleUpload(request: IRequest, env: Env) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const size = parseInt(formData.get('size') as string);
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    const flags = formData.get('flags') as string;
    
    const id = crypto.randomUUID();
    await env.MAPCHIPS.put(id, file);
    
    await execSQL(env.DB,
      'INSERT INTO mapchips (id, filename, size, category, tags, flags) VALUES (?, ?, ?, ?, ?, ?)',
      [id, file.name, size, category, tags, flags]
    );
    
    return new Response(JSON.stringify({ success: true, id }), { 
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Upload error:', e);
    return new Response(JSON.stringify({ 
      success: false, 
      error: e.message 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}

export async function handleGetMapchip(request: IRequest, env: Env) {
  try {
    const { id } = request.params;
    console.log('Getting mapchip:', id);
    
    const obj = await env.MAPCHIPS.get(id);
    
    if (!obj) {
      console.log('Mapchip not found:', id);
      return new Response(JSON.stringify({
        success: false,
        error: 'Not found'
      }), { 
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    console.log('Mapchip found:', {
      contentType: obj.httpMetadata?.contentType,
      size: obj.size,
    });
    
    const headers = new Headers({
      'Content-Type': obj.httpMetadata?.contentType || 'image/png',
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Max-Age': '86400',
    });

    return new Response(obj.body, { headers });
  } catch (e) {
    console.error('Get mapchip error:', e);
    return new Response(JSON.stringify({
      success: false,
      error: e.message
    }), { 
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}

export async function handleDeleteMapchip(request: IRequest, env: Env) {
  try {
    const { id } = request.params;
    await env.MAPCHIPS.delete(id);
    await execSQL(env.DB, 'DELETE FROM mapchips WHERE id = ?', [id]);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Delete error:', e);
    return new Response(JSON.stringify({ 
      success: false, 
      error: e.message 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function handleSearch(request: IRequest, env: Env) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const size = searchParams.get('size');
    const category = searchParams.get('category');
    
    let query = 'SELECT * FROM mapchips WHERE 1=1';
    const params = [];
    
    if (tag) {
      query += ' AND tags LIKE ?';
      params.push(`%${tag}%`);
    }
    
    if (size) {
      query += ' AND size = ?';
      params.push(parseInt(size));
    }

    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await execSQLAll(env.DB, query, params);
    console.log('Search result:', result);
    
    return new Response(JSON.stringify({
      success: true,
      data: result.results || []
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Search error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      data: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function handleUpdateTags(request: IRequest, env: Env) {
  try {
    const { id } = request.params;
    const { tags } = await request.json();
    
    await execSQL(env.DB, 'UPDATE mapchips SET tags = ? WHERE id = ?', [tags, id]);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Update tags error:', e);
    return new Response(JSON.stringify({ 
      success: false, 
      error: e.message 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function handleUpdateCategory(request: IRequest, env: Env) {
  try {
    const { id } = request.params;
    const { category } = await request.json();
    
    const validCategories = ['character', 'mapchip', 'monster', 'item', 'effect', 'ui'];
    if (!validCategories.includes(category)) {
      throw new Error('無効なカテゴリーです');
    }
    
    await execSQL(env.DB, 'UPDATE mapchips SET category = ? WHERE id = ?', [category, id]);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Update category error:', e);
    return new Response(JSON.stringify({ 
      success: false, 
      error: e.message 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function handleUploadSound(request: IRequest, env: Env) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    
    const id = crypto.randomUUID();
    await env.SOUNDS.put(id, file);
    
    await execSQL(env.DB,
      'INSERT INTO sound_files (id, filename, category, tags) VALUES (?, ?, ?, ?)',
      [id, file.name, category, tags]
    );
    
    return new Response(JSON.stringify({ success: true, id }), { 
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Upload sound error:', e);
    return new Response(JSON.stringify({ 
      success: false, 
      error: e.message 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}

export async function handleGetSound(request: IRequest, env: Env) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400'
      }
    });
  }

  try {
    const { id } = request.params;
    console.log('Getting sound:', id);
    
    const obj = await env.SOUNDS.get(id);
    
    if (!obj) {
      console.log('Sound not found:', id);
      return new Response(JSON.stringify({
        success: false,
        error: 'Not found'
      }), { 
        status: 404,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Allow-Headers': '*',
          'Access-Control-Max-Age': '86400'
        }
      });
    }
    
    const headers = new Headers({
      'Content-Type': obj.httpMetadata?.contentType || 'audio/mpeg',
      'Content-Disposition': 'attachment; filename=' + encodeURIComponent(obj.httpMetadata?.filename || 'sound.mp3'),
      'Cache-Control': 'no-cache',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': '*',
      'Access-Control-Max-Age': '86400',
      'Cross-Origin-Resource-Policy': 'cross-origin',
      'Cross-Origin-Embedder-Policy': 'unsafe-none'
    });

    return new Response(obj.body, { headers });
  } catch (e) {
    console.error('Get sound error:', e);
    return new Response(JSON.stringify({
      success: false,
      error: e.message
    }), { 
      status: 500,
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400'
      }
    });
  }
}

export async function handleDeleteSound(request: IRequest, env: Env) {
  try {
    const { id } = request.params;
    await env.SOUNDS.delete(id);
    await execSQL(env.DB, 'DELETE FROM sound_files WHERE id = ?', [id]);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Delete sound error:', e);
    return new Response(JSON.stringify({ 
      success: false, 
      error: e.message 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function handleSearchSounds(request: IRequest, env: Env) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get('tag');
    const category = searchParams.get('category');
    
    let query = 'SELECT * FROM sound_files WHERE 1=1';
    const params = [];
    
    if (tag) {
      query += ' AND tags LIKE ?';
      params.push(`%${tag}%`);
    }
    
    if (category) {
      query += ' AND category = ?';
      params.push(category);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await execSQLAll(env.DB, query, params);
    console.log('Search sounds result:', result);
    
    return new Response(JSON.stringify({
      success: true,
      data: result.results || []
    }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Search sounds error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      data: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function handleUpdateSoundTags(request: IRequest, env: Env) {
  try {
    const { id } = request.params;
    const { tags } = await request.json();
    
    await execSQL(env.DB, 'UPDATE sound_files SET tags = ? WHERE id = ?', [tags, id]);
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error('Update sound tags error:', e);
    return new Response(JSON.stringify({ 
      success: false, 
      error: e.message 
    }), { 
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}