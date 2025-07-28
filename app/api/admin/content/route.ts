import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/src/lib/supabaseClient';

// GET - Fetch page content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pageName = searchParams.get('page_name');
    const sectionName = searchParams.get('section_name');

    let query = supabase
      .from('page_contents')
      .select('*')
      .eq('is_active', true);

    if (pageName) {
      query = query.eq('page_name', pageName);
    }

    if (sectionName) {
      query = query.eq('section_name', sectionName);
    }

    const { data: contents, error } = await query.order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching content:', error);
      return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
    }

    return NextResponse.json({ contents });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create or update content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      page_name,
      section_name,
      content_type,
      content_key,
      content_value
    } = body;

    // Validate required fields
    if (!page_name || !section_name || !content_key || !content_value) {
      return NextResponse.json({ 
        error: 'page_name, section_name, content_key, and content_value are required' 
      }, { status: 400 });
    }

    // Try to update existing content first
    const { data: existingContent } = await supabase
      .from('page_contents')
      .select('id')
      .eq('page_name', page_name)
      .eq('section_name', section_name)
      .eq('content_key', content_key)
      .single();

    let result;

    if (existingContent) {
      // Update existing content
      const { data: content, error } = await supabase
        .from('page_contents')
        .update({
          content_value,
          content_type: content_type || 'text',
          updated_at: new Date().toISOString()
        })
        .eq('id', existingContent.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating content:', error);
        return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
      }

      result = { content, action: 'updated' };
    } else {
      // Create new content
      const { data: content, error } = await supabase
        .from('page_contents')
        .insert([{
          page_name,
          section_name,
          content_type: content_type || 'text',
          content_key,
          content_value,
          is_active: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating content:', error);
        return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
      }

      result = { content, action: 'created' };
    }

    return NextResponse.json(result, { status: existingContent ? 200 : 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update content
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Content ID is required' }, { status: 400 });
    }

    const { data: content, error } = await supabase
      .from('page_contents')
      .update({
        ...updateData,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating content:', error);
      return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
    }

    return NextResponse.json({ content });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete content
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Content ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('page_contents')
      .update({ is_active: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting content:', error);
      return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
