// CGSG404 Homepage API Route
// Unified endpoint for all homepage content management
// Replaces complex casino system with focused homepage CRUD

import { createClient } from '@/src/lib/supabaseServer'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Types for homepage data
interface HomepageData {
  banners: Banner[]
  statistics: Statistic[]
  features: Feature[]
  content: Record<string, string>
  maintenance?: {
    is_maintenance: boolean
    message: string
  }
}

interface Banner {
  id: number
  title: string
  subtitle?: string
  highlight?: string
  cta_text?: string
  cta_link?: string
  image_url?: string
  gradient_class?: string
  display_order: number
}

interface Statistic {
  id: number
  key: string
  value: string
  label: string
  icon?: string
  order: number
}

interface Feature {
  id: number
  title: string
  description?: string
  icon?: string
  color_class?: string
  order: number
}

// GET: Fetch all homepage data
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()
    
    // Get all homepage data using the SQL function
    const { data: homepageData, error: dataError } = await supabase
      .rpc('get_homepage_data')
    
    if (dataError) {
      console.error('Homepage data error:', dataError)
      return NextResponse.json(
        { error: 'Failed to fetch homepage data', details: dataError.message },
        { status: 500 }
      )
    }

    // Get maintenance status
    const { data: maintenanceData, error: maintenanceError } = await supabase
      .rpc('get_homepage_maintenance_status')
    
    if (maintenanceError) {
      console.error('Maintenance status error:', maintenanceError)
    }

    // Combine data
    const response: HomepageData = {
      ...homepageData,
      maintenance: maintenanceData || { is_maintenance: false, message: 'Homepage is available' }
    }

    return NextResponse.json({
      success: true,
      data: response,
      timestamp: new Date().toISOString()
    })

  } catch (error) {
    console.error('Homepage API error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// POST: Create new homepage content
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { type, data } = body

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    let result

    switch (type) {
      case 'banner':
        const { data: bannerResult, error: bannerError } = await supabase
          .rpc('create_banner', {
            p_title: data.title,
            p_subtitle: data.subtitle,
            p_highlight: data.highlight,
            p_cta_text: data.cta_text,
            p_cta_link: data.cta_link,
            p_image_url: data.image_url,
            p_gradient_class: data.gradient_class,
            p_page_type: data.page_type || 'home',
            p_display_order: data.display_order || 0
          })
        
        if (bannerError) {
          return NextResponse.json(
            { error: 'Failed to create banner', details: bannerError.message },
            { status: 500 }
          )
        }
        result = bannerResult
        break

      case 'statistic':
        const { data: statResult, error: statError } = await supabase
          .rpc('update_statistic', {
            p_stat_key: data.key,
            p_stat_value: data.value,
            p_stat_label: data.label,
            p_icon_name: data.icon,
            p_display_order: data.order
          })
        
        if (statError) {
          return NextResponse.json(
            { error: 'Failed to update statistic', details: statError.message },
            { status: 500 }
          )
        }
        result = statResult
        break

      case 'feature':
        const { data: featureResult, error: featureError } = await supabase
          .rpc('upsert_feature', {
            p_id: data.id || null,
            p_title: data.title,
            p_description: data.description,
            p_icon_name: data.icon,
            p_color_class: data.color_class,
            p_display_order: data.order || 0,
            p_page_type: data.page_type || 'home'
          })
        
        if (featureError) {
          return NextResponse.json(
            { error: 'Failed to upsert feature', details: featureError.message },
            { status: 500 }
          )
        }
        result = featureResult
        break

      case 'content':
        const { data: contentResult, error: contentError } = await supabase
          .rpc('update_page_content', {
            p_page_name: data.page_name || 'home',
            p_section_name: data.section_name,
            p_content_key: data.content_key,
            p_content_value: data.content_value,
            p_content_type: data.content_type || 'text'
          })
        
        if (contentError) {
          return NextResponse.json(
            { error: 'Failed to update content', details: contentError.message },
            { status: 500 }
          )
        }
        result = contentResult
        break

      default:
        return NextResponse.json(
          { error: 'Invalid content type', validTypes: ['banner', 'statistic', 'feature', 'content'] },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `${type} processed successfully`
    })

  } catch (error) {
    console.error('Homepage POST error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// PUT: Update existing homepage content
export async function PUT(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()
    const { type, id, data } = body

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    let result

    switch (type) {
      case 'banner':
        const { data: bannerResult, error: bannerError } = await supabase
          .rpc('update_banner', {
            p_id: id,
            p_title: data.title,
            p_subtitle: data.subtitle,
            p_highlight: data.highlight,
            p_cta_text: data.cta_text,
            p_cta_link: data.cta_link,
            p_image_url: data.image_url,
            p_gradient_class: data.gradient_class,
            p_display_order: data.display_order,
            p_is_active: data.is_active
          })
        
        if (bannerError) {
          return NextResponse.json(
            { error: 'Failed to update banner', details: bannerError.message },
            { status: 500 }
          )
        }
        result = bannerResult
        break

      default:
        // For other types, use the same logic as POST
        return POST(request)
    }

    return NextResponse.json({
      success: true,
      data: result,
      message: `${type} updated successfully`
    })

  } catch (error) {
    console.error('Homepage PUT error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

// DELETE: Remove homepage content
export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const id = searchParams.get('id')

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      )
    }

    // Verify user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    let result

    switch (type) {
      case 'banner':
        const { error: bannerError } = await supabase
          .from('banners')
          .update({ is_active: false })
          .eq('id', id)
        
        if (bannerError) {
          return NextResponse.json(
            { error: 'Failed to deactivate banner', details: bannerError.message },
            { status: 500 }
          )
        }
        result = { success: true, message: 'Banner deactivated' }
        break

      case 'feature':
        const { error: featureError } = await supabase
          .from('site_features')
          .update({ is_active: false })
          .eq('id', id)
        
        if (featureError) {
          return NextResponse.json(
            { error: 'Failed to deactivate feature', details: featureError.message },
            { status: 500 }
          )
        }
        result = { success: true, message: 'Feature deactivated' }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid content type for deletion' },
          { status: 400 }
        )
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Homepage DELETE error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error', 
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}