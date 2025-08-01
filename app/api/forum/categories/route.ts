import { NextRequest, NextResponse } from 'next/server';

// Mock categories data
const mockCategories = [
  {
    id: 1,
    name: "Casino Reviews",
    description: "Share your experiences and reviews about different casinos",
    icon_name: "Star",
    color_class: "from-yellow-500 to-orange-500",
    display_order: 1,
    posts_count: 15,
    is_active: true
  },
  {
    id: 2,
    name: "General Discussion",
    description: "General casino and gambling discussions",
    icon_name: "MessageCircle",
    color_class: "from-blue-500 to-cyan-500",
    display_order: 2,
    posts_count: 23,
    is_active: true
  },
  {
    id: 3,
    name: "Bonus & Promotions",
    description: "Discuss casino bonuses, promotions, and offers",
    icon_name: "Gift",
    color_class: "from-green-500 to-emerald-500",
    display_order: 3,
    posts_count: 8,
    is_active: true
  },
  {
    id: 4,
    name: "Game Strategies",
    description: "Share tips, tricks, and strategies for casino games",
    icon_name: "Target",
    color_class: "from-purple-500 to-pink-500",
    display_order: 4,
    posts_count: 12,
    is_active: true
  },
  {
    id: 5,
    name: "Success Stories",
    description: "Share your winning stories and experiences",
    icon_name: "Trophy",
    color_class: "from-orange-500 to-red-500",
    display_order: 5,
    posts_count: 6,
    is_active: true
  },
  {
    id: 6,
    name: "Questions & Help",
    description: "Ask questions and get help from the community",
    icon_name: "HelpCircle",
    color_class: "from-indigo-500 to-blue-500",
    display_order: 6,
    posts_count: 4,
    is_active: true
  }
];

// GET - Fetch forum categories (using mock data)
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({ categories: mockCategories });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new forum category (mock implementation)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      icon_name,
      color_class,
      display_order = 0
    } = body;

    // Validate required fields
    if (!name || !description) {
      return NextResponse.json({
        error: 'Name and description are required'
      }, { status: 400 });
    }

    // Create mock category
    const newCategory = {
      id: mockCategories.length + 1,
      name,
      description,
      icon_name,
      color_class,
      display_order,
      posts_count: 0,
      is_active: true
    };

    // Add to mock data (in real app, this would be saved to database)
    mockCategories.push(newCategory);

    return NextResponse.json({ category: newCategory }, { status: 201 });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update forum category (mock implementation)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Find and update category in mock data
    const categoryIndex = mockCategories.findIndex(cat => cat.id === id);
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    mockCategories[categoryIndex] = {
      ...mockCategories[categoryIndex],
      ...updateData
    };

    return NextResponse.json({ category: mockCategories[categoryIndex] });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete forum category (mock implementation)
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
    }

    // Find category in mock data
    const categoryIndex = mockCategories.findIndex(cat => cat.id === parseInt(id));
    if (categoryIndex === -1) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if category has posts (mock check)
    if (mockCategories[categoryIndex].posts_count > 0) {
      return NextResponse.json({
        error: 'Cannot delete category with existing posts'
      }, { status: 400 });
    }

    // Mark as inactive instead of deleting
    mockCategories[categoryIndex].is_active = false;

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
