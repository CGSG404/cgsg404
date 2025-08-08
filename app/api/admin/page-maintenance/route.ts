import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '../../../../lib/supabase/server'; // Path diperbaiki
import { z } from 'zod';

// Skema validasi untuk request body
const maintenanceSchema = z.object({
  is_maintenance_mode: z.boolean(),
  allowed_ips: z.array(z.string().ip({ version: 'v4' })).optional().nullable(),
});

// Handler untuk GET request: Mengambil status maintenance
export async function GET(req: NextRequest) {
  try {
    const { data, error } = await supabaseAdmin
      .from('maintenance_settings')
      .select('*')
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: no rows found, which is ok
      console.error('Error fetching maintenance status:', error);
      return NextResponse.json({ error: 'Failed to fetch maintenance status', details: error.message }, { status: 500 });
    }

    // Jika tidak ada data, kembalikan status default (non-maintenance)
    const settings = data || { is_maintenance_mode: false, allowed_ips: [] };

    return NextResponse.json(settings, { status: 200 });
  } catch (e) {
    const error = e as Error;
    console.error('Catastrophic error in GET /api/admin/page-maintenance:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.', details: error.message }, { status: 500 });
  }
}

// Handler untuk POST request: Memperbarui status maintenance
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validasi input
    const validation = maintenanceSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: 'Invalid input', details: validation.error.format() }, { status: 400 });
    }

    const { is_maintenance_mode, allowed_ips } = validation.data;

    // Operasi Upsert: update jika ada, insert jika tidak ada.
    // Kita gunakan 'id' sebagai primary key atau unique column untuk dicocokkan.
    const { data, error } = await supabaseAdmin
      .from('maintenance_settings')
      .upsert({
        id: 1, // Asumsi kita hanya punya satu baris setting dengan id=1
        is_maintenance_mode,
        allowed_ips: allowed_ips || [],
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error updating maintenance status:', error);
      return NextResponse.json({ error: 'Failed to update maintenance status', details: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Maintenance status updated successfully', settings: data }, { status: 200 });
  } catch (e) {
    const error = e as Error;
    console.error('Catastrophic error in POST /api/admin/page-maintenance:', error);
    return NextResponse.json({ error: 'An unexpected error occurred.', details: error.message }, { status: 500 });
  }
}

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// In-memory storage for development/testing
const maintenanceData = [...mockPageMaintenanceData];

// Admin authentication helper
async function verifyAdminAccess(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return { error: 'No authorization header', status: 401 };
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return { error: 'Invalid token', status: 401 };
    }

    // Create authenticated supabase client with user token
    const supabaseAuth = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      }
    );

    // Check admin status using database function
    const { data: isAdmin, error: adminError } = await supabaseAuth.rpc('is_admin');

    if (adminError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Admin check error:', adminError);
      }
      return { error: 'Admin verification failed', status: 500 };
    }

    if (!isAdmin) {
      return { error: 'Admin access required', status: 403 };
    }

    return { user, isAdmin: true };
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Admin verification error:', error);
    }
    return { error: 'Authentication failed', status: 500 };
  }
}

// GET - Get all page maintenance statuses
export async function GET(request: NextRequest) {
  try {
    // SECURITY: Verify admin access first
    const authResult = await verifyAdminAccess(request);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    // Try database first
    const { data: pages, error } = await supabase
      .from('page_maintenance')
      .select('*')
      .order('page_path');

    if (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Database error:', error.message);
      }

      // SECURITY: Only use mock data in development
      if (process.env.NODE_ENV === 'development') {
        console.warn('Development mode: Using mock data');
        return NextResponse.json({
          pages: maintenanceData.sort((a, b) => a.page_path.localeCompare(b.page_path)),
          mock: true
        });
      }

      // Production: Return error instead of mock data
      return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
    }

    return NextResponse.json({ pages });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Database error:', error);
    }

    // SECURITY: Only use mock data in development
    if (process.env.NODE_ENV === 'development') {
      console.warn('Development mode: Using mock data');
      return NextResponse.json({
        pages: maintenanceData.sort((a, b) => a.page_path.localeCompare(b.page_path)),
        mock: true
      });
    }

    // Production: Return error instead of mock data
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Toggle maintenance mode for a page
export async function POST(request: NextRequest) {
  try {
    // SECURITY: Verify admin access first
    const authResult = await verifyAdminAccess(request);
    if ('error' in authResult) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Admin access denied:', authResult.error);
      }
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const body = await request.json();
    const { page_path, is_maintenance, maintenance_message } = body;

    if (process.env.NODE_ENV === 'development') {
      console.log('🔧 Toggle maintenance request:', { page_path, is_maintenance, maintenance_message });
    }

    // Validate required fields
    if (!page_path || typeof is_maintenance !== 'boolean') {
      return NextResponse.json({
        error: 'page_path and is_maintenance are required'
      }, { status: 400 });
    }

    // Try database first - use RPC function, fallback to direct update
    try {
      if (process.env.NODE_ENV === 'development') {
        console.log('📊 Attempting database update...');
      }

      let updateResult = null;
      let rpcError = null;

      // Try RPC function first
      try {
        const { data, error } = await supabase.rpc('toggle_page_maintenance', {
          page_path_param: page_path,
          maintenance_status: is_maintenance,
          message_param: maintenance_message || null
        });

        if (error) {
          rpcError = error;
          throw error;
        }

        updateResult = data;
      } catch (rpcErr) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ RPC function failed, trying direct update:', rpcErr instanceof Error ? rpcErr.message : 'Unknown error');
        }

        // Fallback to direct update
        const updateData: {
          is_maintenance: boolean;
          updated_at: string;
          maintenance_message?: string | null;
        } = {
          is_maintenance,
          updated_at: new Date().toISOString()
        };

        if (maintenance_message !== undefined) {
          updateData.maintenance_message = maintenance_message;
        }

        const { data: directUpdateResult, error: directUpdateError } = await supabase
          .from('page_maintenance')
          .update(updateData)
          .eq('page_path', page_path)
          .select()
          .single();

        if (directUpdateError) {
          throw directUpdateError;
        }

        updateResult = directUpdateResult;
      }

      if (updateResult) {
        // Get updated page data to confirm the change
        const { data: updatedPage, error: fetchError } = await supabase
          .from('page_maintenance')
          .select('*')
          .eq('page_path', page_path)
          .single();

        if (!fetchError && updatedPage) {
          if (process.env.NODE_ENV === 'development') {
            console.log('✅ Database update successful:', updatedPage);
          }
          return NextResponse.json({
            success: true,
            page: updatedPage,
            message: `Maintenance mode ${is_maintenance ? 'enabled' : 'disabled'} for ${page_path}`,
            method: rpcError ? 'direct_update' : 'rpc_function',
            timestamp: new Date().toISOString()
          });
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.error('❌ Failed to fetch updated page:', fetchError);
          }
        }
      }
    } catch (dbError) {
      if (process.env.NODE_ENV === 'development') {
        console.error('❌ Database error:', dbError);
      }
      
      // Only use mock data in development
      if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json({
          error: 'Database operation failed',
          details: dbError instanceof Error ? dbError.message : 'Unknown database error'
        }, { status: 500 });
      }
    }

    // Fallback to mock data (development only)
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ Using mock data fallback');
      const pageIndex = maintenanceData.findIndex(p => p.page_path === page_path);
      if (pageIndex === -1) {
        return NextResponse.json({ error: 'Page not found' }, { status: 404 });
      }

      // Update mock data
      maintenanceData[pageIndex] = {
        ...maintenanceData[pageIndex],
        is_maintenance,
        maintenance_message: maintenance_message || maintenanceData[pageIndex].maintenance_message,
        updated_at: new Date().toISOString()
      };

      return NextResponse.json({
        success: true,
        page: maintenanceData[pageIndex],
        message: `Maintenance mode ${is_maintenance ? 'enabled' : 'disabled'} for ${page_path}`,
        mock: true,
        timestamp: new Date().toISOString()
      });
    }

    // Production: Return error if database fails
    return NextResponse.json({
      error: 'Maintenance mode update failed'
    }, { status: 500 });

  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ Unexpected error in POST /api/admin/page-maintenance:', error);
    }
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// PUT - Update maintenance message for a page
export async function PUT(request: NextRequest) {
  try {
    // SECURITY: Verify admin access first
    const authResult = await verifyAdminAccess(request);
    if ('error' in authResult) {
      return NextResponse.json({ error: authResult.error }, { status: authResult.status });
    }

    const body = await request.json();
    const { page_path, maintenance_message } = body;

    // Validate required fields
    if (!page_path || !maintenance_message) {
      return NextResponse.json({
        error: 'page_path and maintenance_message are required'
      }, { status: 400 });
    }

    // Try database first
    try {
      const { data, error } = await supabase
        .from('page_maintenance')
        .update({ maintenance_message })
        .eq('page_path', page_path)
        .select()
        .single();

      if (!error) {
        return NextResponse.json({
          success: true,
          page: data,
          message: `Maintenance message updated for ${page_path}`
        });
      }
    } catch (dbError) {
      if (process.env.NODE_ENV === 'development') {
        console.warn('Database not available, using mock data');
      }
    }

    // Fallback to mock data
    const pageIndex = maintenanceData.findIndex(p => p.page_path === page_path);
    if (pageIndex === -1) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // Update mock data
    maintenanceData[pageIndex] = {
      ...maintenanceData[pageIndex],
      maintenance_message,
      updated_at: new Date().toISOString()
    };

    return NextResponse.json({
      success: true,
      page: maintenanceData[pageIndex],
      message: `Maintenance message updated for ${page_path}`,
      mock: true
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Unexpected error:', error);
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
