import { supabase } from '@/src/lib/supabaseClient';
import { NextRequest, NextResponse } from 'next/server';

// GET - Fetch all homepage content
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const component = searchParams.get('component');

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let data = {};

    if (!component || component === 'hero-slider') {
      const { data: heroSlider, error: heroError } = await supabase
        .from('hero_slider_casinos')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (heroError) throw heroError;
      data = { ...data, heroSlider };
    }

    if (!component || component === 'banner-info') {
      const { data: bannerInfo, error: bannerError } = await supabase
        .from('banner_info_content')
        .select('*')
        .order('section_type, display_order', { ascending: true });
      
      if (bannerError) throw bannerError;
      data = { ...data, bannerInfo };
    }

    if (!component || component === 'faq') {
      const { data: faq, error: faqError } = await supabase
        .from('faq_items')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (faqError) throw faqError;
      data = { ...data, faq };
    }

    if (!component || component === 'logo-slider') {
      const { data: logoSlider, error: logoError } = await supabase
        .from('logo_slider_items')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (logoError) throw logoError;
      data = { ...data, logoSlider };
    }

    if (!component || component === 'chart') {
      const { data: chartData, error: chartError } = await supabase
        .from('chart_data')
        .select('*')
        .order('chart_type, display_order', { ascending: true });
      
      if (chartError) throw chartError;
      data = { ...data, chartData };
    }

    if (!component || component === 'ticker') {
      const { data: ticker, error: tickerError } = await supabase
        .from('ticker_items')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (tickerError) throw tickerError;
      data = { ...data, ticker };
    }

    if (!component || component === 'hero-section') {
      const { data: heroSection, error: heroSectionError } = await supabase
        .from('hero_section_content')
        .select('*')
        .eq('is_active', true)
        .single();
      
      if (heroSectionError && heroSectionError.code !== 'PGRST116') throw heroSectionError;
      data = { ...data, heroSection };
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch homepage content' },
      { status: 500 }
    );
  }
}

// POST - Create new homepage content item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { component, data: itemData } = body;

    // Check authentication
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check admin role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    let result;
    const tableName = getTableName(component);
    
    if (!tableName) {
      return NextResponse.json({ error: 'Invalid component' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from(tableName)
      .insert([itemData])
      .select()
      .single();

    if (error) throw error;
    result = data;

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating homepage content:', error);
    return NextResponse.json(
      { error: 'Failed to create homepage content' },
      { status: 500 }
    );
  }
}

// Helper function to get table name from component
function getTableName(component: string): string | null {
  const tableMap: Record<string, string> = {
    'hero-slider': 'hero_slider_casinos',
    'banner-info': 'banner_info_content',
    'faq': 'faq_items',
    'logo-slider': 'logo_slider_items',
    'chart': 'chart_data',
    'ticker': 'ticker_items',
    'hero-section': 'hero_section_content'
  };
  
  return tableMap[component] || null;
}