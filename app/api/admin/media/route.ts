import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabaseClient';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

// GET - Fetch all media files
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    let query = supabase
      .from('media_files')
      .select('*')
      .eq('is_active', true);

    if (category) {
      query = query.eq('category', category);
    }

    const { data: mediaFiles, error } = await query.order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching media files:', error);
      return NextResponse.json({ error: 'Failed to fetch media files' }, { status: 500 });
    }

    return NextResponse.json({ mediaFiles });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Upload new media file
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const category = formData.get('category') as string || 'content';
    const altText = formData.get('alt_text') as string || '';
    const description = formData.get('description') as string || '';

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({ 
        error: 'Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.' 
      }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 5MB.' 
      }, { status: 400 });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`;
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', category);
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }

    // Save file to public/uploads directory
    const filePath = join(uploadDir, filename);
    const publicPath = `/uploads/${category}/${filename}`;
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Save file info to database
    const { data: mediaFile, error } = await supabase
      .from('media_files')
      .insert([{
        filename,
        original_name: file.name,
        file_path: publicPath,
        file_size: file.size,
        mime_type: file.type,
        alt_text: altText,
        description,
        category,
        is_active: true
      }])
      .select()
      .single();

    if (error) {
      console.error('Error saving media file to database:', error);
      return NextResponse.json({ error: 'Failed to save file info' }, { status: 500 });
    }

    return NextResponse.json({ 
      mediaFile,
      message: 'File uploaded successfully' 
    }, { status: 201 });

  } catch (error) {
    console.error('Upload Error:', error);
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
  }
}

// PUT - Update media file info
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, alt_text, description, category } = body;

    if (!id) {
      return NextResponse.json({ error: 'Media file ID is required' }, { status: 400 });
    }

    const { data: mediaFile, error } = await supabase
      .from('media_files')
      .update({
        alt_text,
        description,
        category,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating media file:', error);
      return NextResponse.json({ error: 'Failed to update media file' }, { status: 500 });
    }

    return NextResponse.json({ mediaFile });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete media file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Media file ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('media_files')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting media file:', error);
      return NextResponse.json({ error: 'Failed to delete media file' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Media file deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
