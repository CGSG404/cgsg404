import { NextRequest, NextResponse } from 'next/server';

// Mock likes storage (in real app, this would be in database)
const mockLikes: { [key: string]: number[] } = {
  posts: [1], // User has liked post with ID 1
  replies: []
};

// POST - Toggle like on post or reply (mock implementation)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      target_type, // 'post' or 'reply'
      target_id,
      user_id
    } = body;

    // Validate required fields
    if (!target_type || !target_id || !user_id) {
      return NextResponse.json({
        error: 'target_type, target_id, and user_id are required'
      }, { status: 400 });
    }

    if (!['post', 'reply'].includes(target_type)) {
      return NextResponse.json({
        error: 'target_type must be either "post" or "reply"'
      }, { status: 400 });
    }

    const targetKey = target_type === 'post' ? 'posts' : 'replies';
    const targetIdNum = parseInt(target_id);

    // Check if user already liked this item
    const isCurrentlyLiked = mockLikes[targetKey].includes(targetIdNum);

    let isLiked = false;
    let likesCount = 0;

    if (isCurrentlyLiked) {
      // Unlike - remove the like
      mockLikes[targetKey] = mockLikes[targetKey].filter(id => id !== targetIdNum);
      isLiked = false;
      likesCount = Math.max(0, mockLikes[targetKey].length);
    } else {
      // Like - add the like
      mockLikes[targetKey].push(targetIdNum);
      isLiked = true;
      likesCount = mockLikes[targetKey].length;
    }

    return NextResponse.json({
      isLiked,
      likesCount,
      message: isLiked ? 'Item liked successfully' : 'Like removed successfully'
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - Check if user liked specific items (mock implementation)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const targetType = searchParams.get('target_type');
    const targetIds = searchParams.get('target_ids')?.split(',') || [];
    const userId = searchParams.get('user_id');

    if (!targetType || !userId || targetIds.length === 0) {
      return NextResponse.json({
        error: 'target_type, target_ids, and user_id are required'
      }, { status: 400 });
    }

    if (!['post', 'reply'].includes(targetType)) {
      return NextResponse.json({
        error: 'target_type must be either "post" or "reply"'
      }, { status: 400 });
    }

    const targetKey = targetType === 'post' ? 'posts' : 'replies';
    const targetIdsNum = targetIds.map(id => parseInt(id));

    // Filter liked items that match the requested IDs
    const likedItems = mockLikes[targetKey].filter(id => targetIdsNum.includes(id));

    return NextResponse.json({ likedItems });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
