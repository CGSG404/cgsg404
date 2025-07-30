import { NextRequest, NextResponse } from 'next/server';

// In-memory storage untuk demo (dalam production gunakan database)
let mockPosts = [
  {
    id: 1,
    title: "Welcome to CGSG Forum!",
    content: "This is the first post in our casino community forum. Share your experiences and connect with fellow casino enthusiasts!",
    user_name: "Admin",
    user_avatar: "/default-avatar.png",
    user_id: "admin",
    casino_name: "CGSG Casino",
    rating: 5,
    post_type: "discussion",
    is_pinned: true,
    is_locked: false,
    views_count: 150,
    likes_count: 25,
    replies_count: 8,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    forum_categories: {
      name: "General Discussion",
      icon_name: "MessageCircle",
      color_class: "from-blue-500 to-cyan-500"
    }
  },
  {
    id: 2,
    title: "Best Casino Bonuses This Month",
    content: "I've been testing various casino bonuses and wanted to share my findings with the community. Here are the top 5 bonuses I recommend...",
    user_name: "BonusHunter",
    user_avatar: "/default-avatar.png",
    user_id: "user1",
    casino_name: "Lucky Casino",
    rating: 4,
    post_type: "review",
    is_pinned: false,
    is_locked: false,
    views_count: 89,
    likes_count: 12,
    replies_count: 5,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
    forum_categories: {
      name: "Bonus & Promotions",
      icon_name: "Gift",
      color_class: "from-green-500 to-emerald-500"
    }
  }
];

// GET - Fetch forum posts (using mock data for now)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryId = searchParams.get('category_id');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Filter mock posts if category is specified
    let filteredPosts = mockPosts;
    if (categoryId) {
      // For now, return all posts regardless of category
      filteredPosts = mockPosts;
    }

    // Apply pagination
    const paginatedPosts = filteredPosts.slice(offset, offset + limit);

    return NextResponse.json({
      posts: paginatedPosts,
      total: filteredPosts.length,
      limit,
      offset
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new forum post (mock implementation)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      category_id,
      casino_name,
      user_id,
      user_name,
      user_avatar,
      title,
      content,
      post_type = 'discussion',
      rating
    } = body;

    // Validate required fields
    if (!category_id || !user_id || !user_name || !title || !content) {
      return NextResponse.json({
        error: 'category_id, user_id, user_name, title, and content are required'
      }, { status: 400 });
    }

    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json({
        error: 'Rating must be between 1 and 5'
      }, { status: 400 });
    }

    // Create mock post
    const newPost = {
      id: mockPosts.length + 1,
      title,
      content,
      user_name,
      user_avatar: user_avatar || '/default-avatar.png',
      user_id,
      casino_name,
      rating,
      post_type,
      is_pinned: false,
      is_locked: false,
      views_count: 0,
      likes_count: 0,
      replies_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      forum_categories: {
        name: "General Discussion",
        icon_name: "MessageCircle",
        color_class: "from-blue-500 to-cyan-500"
      }
    };

    // Add to mock data (in real app, this would be saved to database)
    mockPosts.unshift(newPost);

    return NextResponse.json({ post: newPost }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update forum post (mock implementation)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, user_id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Find post in mock data
    const postIndex = mockPosts.findIndex(post => post.id === id);
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if user owns the post (skip for admin)
    if (user_id !== 'admin' && mockPosts[postIndex].user_id !== user_id) {
      return NextResponse.json({ error: 'Unauthorized to edit this post' }, { status: 403 });
    }

    // Update post
    mockPosts[postIndex] = {
      ...mockPosts[postIndex],
      ...updateData,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({ post: mockPosts[postIndex] });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete forum post (mock implementation)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('user_id');

    if (!id) {
      return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
    }

    // Find post in mock data
    const postIndex = mockPosts.findIndex(post => post.id === parseInt(id));
    if (postIndex === -1) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    // Check if user owns the post (skip for admin)
    if (userId !== 'admin' && mockPosts[postIndex].user_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized to delete this post' }, { status: 403 });
    }

    // Remove post from mock data
    mockPosts.splice(postIndex, 1);

    return NextResponse.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
