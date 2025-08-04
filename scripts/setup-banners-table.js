const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupBannersTable() {
  console.log('🚀 Setting up banners table in Supabase...');

  try {
    // 1. Create banners table
    console.log('📋 Creating banners table...');
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS public.banners (
          id BIGSERIAL PRIMARY KEY,
          title VARCHAR(255) NOT NULL,
          subtitle TEXT,
          highlight VARCHAR(255),
          cta_text VARCHAR(100),
          cta_link VARCHAR(500),
          image_url VARCHAR(500) NOT NULL,
          gradient_class VARCHAR(100),
          page_type VARCHAR(50) DEFAULT 'home',
          display_order INTEGER DEFAULT 0,
          is_active BOOLEAN DEFAULT true,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });

    if (createTableError) {
      console.error('❌ Error creating table:', createTableError);
      return;
    }

    console.log('✅ Banners table created successfully');

    // 2. Create indexes
    console.log('📊 Creating indexes...');
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_banners_page_type ON public.banners(page_type);',
      'CREATE INDEX IF NOT EXISTS idx_banners_is_active ON public.banners(is_active);',
      'CREATE INDEX IF NOT EXISTS idx_banners_display_order ON public.banners(display_order);'
    ];

    for (const index of indexes) {
      const { error } = await supabase.rpc('exec_sql', { sql: index });
      if (error) {
        console.warn('⚠️ Warning creating index:', error);
      }
    }

    console.log('✅ Indexes created successfully');

    // 3. Enable RLS
    console.log('🔒 Enabling Row Level Security...');
    const { error: rlsError } = await supabase.rpc('exec_sql', {
      sql: 'ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;'
    });

    if (rlsError) {
      console.warn('⚠️ Warning enabling RLS:', rlsError);
    }

    // 4. Create RLS policies
    console.log('🛡️ Creating RLS policies...');
    const policies = [
      `CREATE POLICY "Allow public read access for active banners" ON public.banners
       FOR SELECT USING (is_active = true);`,
      `CREATE POLICY "Allow authenticated users to manage banners" ON public.banners
       FOR ALL USING (auth.role() = 'authenticated');`
    ];

    for (const policy of policies) {
      const { error } = await supabase.rpc('exec_sql', { sql: policy });
      if (error) {
        console.warn('⚠️ Warning creating policy:', error);
      }
    }

    console.log('✅ RLS policies created successfully');

    // 5. Insert default data
    console.log('📝 Inserting default banner data...');
    const defaultBanners = [
      {
        title: 'Welcome to CGSG!',
        subtitle: 'Your Trusted Casino Guide Singapore',
        highlight: 'DISCOVER THE BEST CASINOS! 🎰',
        cta_text: 'Get Started',
        cta_link: '/casinos',
        image_url: '/news-banner/domain.png',
        gradient_class: 'from-casino-dark to-purple-900',
        page_type: 'home',
        display_order: 1,
        is_active: true
      },
      {
        title: 'Exclusive Bonuses',
        subtitle: 'Up to 200% Welcome Bonus + Free Spins',
        highlight: 'CLAIM YOUR BONUS NOW! 🎁',
        cta_text: 'View Bonuses',
        cta_link: '/best-bonuses',
        image_url: '/news-banner/domain1.png',
        gradient_class: 'from-casino-dark to-purple-900',
        page_type: 'home',
        display_order: 2,
        is_active: true
      },
      {
        title: 'Success Stories',
        subtitle: 'Join Our Winning Community',
        highlight: 'BE THE NEXT WINNER! 🏆',
        cta_text: 'Read Stories',
        cta_link: '/success-stories',
        image_url: '/success-stories-cgsg.png',
        gradient_class: 'from-casino-dark to-purple-900',
        page_type: 'home',
        display_order: 3,
        is_active: true
      }
    ];

    for (const banner of defaultBanners) {
      const { error } = await supabase
        .from('banners')
        .insert(banner);

      if (error) {
        console.warn('⚠️ Warning inserting banner:', error);
      }
    }

    console.log('✅ Default banner data inserted successfully');

    // 6. Verify setup
    console.log('🔍 Verifying setup...');
    const { data: banners, error: verifyError } = await supabase
      .from('banners')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (verifyError) {
      console.error('❌ Error verifying setup:', verifyError);
      return;
    }

    console.log(`✅ Setup complete! Found ${banners.length} active banners`);
    console.log('🎉 Banners table is ready to use!');

  } catch (error) {
    console.error('❌ Setup failed:', error);
  }
}

// Run setup
setupBannersTable(); 