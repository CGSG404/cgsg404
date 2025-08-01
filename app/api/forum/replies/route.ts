import { NextRequest, NextResponse } from 'next/server';

// Mock replies data
const mockReplies: any[] = [];

// GET - Fetch forum replies (mock implementation)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('post_id');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    if (!postId) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Filter replies for the specific post
    const postReplies = mockReplies.filter(reply => reply.post_id === parseInt(postId));
    const paginatedReplies = postReplies.slice(offset, offset + limit);

    return NextResponse.json({
      replies: paginatedReplies,
      total: postReplies.length,
      limit,
      offset
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new forum reply
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      post_id,
      parent_reply_id,
      user_id,
      user_name,
      user_avatar,
      content
    } = body;

    // Validate required fields
    if (!post_id || !user_id || !user_name || !content) {
      return NextResponse.json({ 
        error: 'post_id, user_id, user_name, and content are required' 
      }, { status: 400 });
    }

    // Create mock reply
    const newReply = {
      id: mockReplies.length + 1,
      post_id: parseInt(post_id),
      parent_reply_id: parent_reply_id ? parseInt(parent_reply_id) : null,
      user_id,
      user_name,
      user_avatar: user_avatar || '/default-avatar.png',
      content,
      is_approved: true,
      likes_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Add to mock data
    mockReplies.push(newReply);

    return NextResponse.json({ reply: newReply }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update forum reply (mock implementation)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, user_id, content } = body;

    if (!id || !content) {
      return NextResponse.json({ error: 'Reply ID and content are required' }, { status: 400 });
    }

    // Find reply in mock data
    const replyIndex = mockReplies.findIndex(reply => reply.id === id);
    if (replyIndex === -1) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
    }

    // Check if user owns the reply (skip for admin)
    if (user_id !== 'admin' && mockReplies[replyIndex].user_id !== user_id) {
      return NextResponse.json({ error: 'Unauthorized to edit this reply' }, { status: 403 });
    }

    // Update reply
    mockReplies[replyIndex] = {
      ...mockReplies[replyIndex],
      content,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({ reply: mockReplies[replyIndex] });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete forum reply (mock implementation)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('user_id');

    if (!id) {
      return NextResponse.json({ error: 'Reply ID is required' }, { status: 400 });
    }

    // Find reply in mock data
    const replyIndex = mockReplies.findIndex(reply => reply.id === parseInt(id));
    if (replyIndex === -1) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
    }

    // Check if user owns the reply (skip for admin)
    if (userId !== 'admin' && mockReplies[replyIndex].user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized to delete this reply' }, { status: 403 });
    }

    // Remove reply from mock data
    mockReplies.splice(replyIndex, 1);

    return NextResponse.json({ message: 'Reply deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
