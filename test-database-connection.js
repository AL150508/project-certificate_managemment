// Test database connection
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log('Testing database connection...')
console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseKey ? 'Present' : 'Missing')

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  try {
    // Test 1: Basic connection
    console.log('\n🔍 Test 1: Basic connection...')
    const { data, error } = await supabase
      .from('certificate_categories')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Connection successful')
    console.log('Sample data:', data)
    
    // Test 2: Check if certificate_templates table exists
    console.log('\n🔍 Test 2: Check certificate_templates table...')
    const { data: templatesData, error: templatesError } = await supabase
      .from('certificate_templates')
      .select('*')
      .limit(1)
    
    if (templatesError) {
      console.error('❌ certificate_templates table error:', templatesError.message)
      console.log('💡 Run scripts/setup-all-tables.sql to create the table')
      return false
    }
    
    console.log('✅ certificate_templates table exists')
    
    // Test 3: Check if certificate_designs table exists
    console.log('\n🔍 Test 3: Check certificate_designs table...')
    const { data: designsData, error: designsError } = await supabase
      .from('certificate_designs')
      .select('*')
      .limit(1)
    
    if (designsError) {
      console.error('❌ certificate_designs table error:', designsError.message)
      console.log('💡 Run scripts/setup-all-tables.sql to create the table')
      return false
    }
    
    console.log('✅ certificate_designs table exists')
    
    // Test 4: Test authentication
    console.log('\n🔍 Test 4: Test authentication...')
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError) {
      console.log('⚠️ No authenticated user (this is normal if not logged in)')
    } else if (user) {
      console.log('✅ User authenticated:', user.email)
    } else {
      console.log('ℹ️ No user session found')
    }
    
    console.log('\n🎉 All tests passed! Database is ready.')
    return true
    
  } catch (error) {
    console.error('❌ Unexpected error:', error)
    return false
  }
}

testConnection().then(success => {
  if (success) {
    console.log('\n✅ Database connection test completed successfully')
  } else {
    console.log('\n❌ Database connection test failed')
    console.log('\n🔧 Next steps:')
    console.log('1. Check .env.local file has correct Supabase credentials')
    console.log('2. Run scripts/setup-all-tables.sql in Supabase SQL Editor')
    console.log('3. Make sure you are logged in to the application')
  }
  process.exit(success ? 0 : 1)
})
