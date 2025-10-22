// Test script untuk memverifikasi navigasi admin
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testNavigation() {
  try {
    console.log('Testing navigation setup...')
    
    // Test 1: Check if users table exists
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('email, role')
      .limit(1)
    
    if (usersError) {
      console.log('❌ Users table not found:', usersError.message)
      console.log('Please run the setup-users.sql script in Supabase')
    } else {
      console.log('✅ Users table exists')
      if (users.length > 0) {
        console.log('Sample user:', users[0])
      }
    }
    
    // Test 2: Check admin user
    const { data: adminUser, error: adminError } = await supabase
      .from('users')
      .select('email, role')
      .eq('email', 'admin@gmail.com')
      .single()
    
    if (adminError) {
      console.log('❌ Admin user not found:', adminError.message)
    } else {
      console.log('✅ Admin user found:', adminUser)
    }
    
    console.log('\n📋 Navigation Routes:')
    console.log('- Admin Dashboard: /admin/dashboard')
    console.log('- Admin Certificates: /admin/certificates')
    console.log('- Admin Templates: /admin/templates')
    console.log('- Login: /login')
    
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testNavigation()
