import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Required variables:')
  console.log('- NEXT_PUBLIC_SUPABASE_URL')
  console.log('- SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupCategories() {
  try {
    console.log('🚀 Setting up categories table...')
    
    // Check if we can connect to Supabase
    console.log('🔍 Testing Supabase connection...')
    const { data: connectionTest, error: connectionError } = await supabase
      .from('categories')
      .select('count', { count: 'exact', head: true })
    
    if (connectionError && connectionError.code !== 'PGRST116') {
      console.error('❌ Connection failed:', connectionError)
      throw connectionError
    }
    
    if (!connectionError) {
      console.log('✅ Categories table already exists')
      
      // Check if it has data
      const { data: existingData, error: dataError } = await supabase
        .from('categories')
        .select('*')
        .limit(5)
      
      if (!dataError && existingData) {
        console.log(`📊 Found ${existingData.length} existing categories:`)
        existingData.forEach(cat => console.log(`  - ${cat.name}: ${cat.description}`))
        
        if (existingData.length > 0) {
          console.log('✅ Categories table is ready to use!')
          return
        }
      }
    }
    
    console.log('📝 Creating categories table and inserting default data...')
    
    // Read and execute SQL file
    const sqlPath = join(process.cwd(), 'scripts', 'setup-categories.sql')
    const sql = readFileSync(sqlPath, 'utf8')
    
    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0)
    
    console.log(`📋 Executing ${statements.length} SQL statements...`)
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      if (statement.trim()) {
        try {
          console.log(`  ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`)
          
          // Use rpc to execute raw SQL
          const { error } = await supabase.rpc('exec_sql', { sql: statement })
          
          if (error) {
            console.warn(`⚠️ Statement ${i + 1} warning:`, error.message)
            // Continue with other statements
          }
        } catch (err) {
          console.warn(`⚠️ Statement ${i + 1} error:`, err.message)
          // Continue with other statements
        }
      }
    }
    
    // Verify the setup
    console.log('🔍 Verifying categories table setup...')
    const { data: verifyData, error: verifyError } = await supabase
      .from('categories')
      .select('*')
      .order('name')
    
    if (verifyError) {
      console.error('❌ Verification failed:', verifyError)
      throw verifyError
    }
    
    console.log('✅ Categories table setup completed successfully!')
    console.log(`📊 Total categories: ${verifyData?.length || 0}`)
    
    if (verifyData && verifyData.length > 0) {
      console.log('📋 Available categories:')
      verifyData.forEach(cat => {
        console.log(`  - ${cat.name}: ${cat.description || 'No description'}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Setup failed:', error)
    
    // Provide helpful error messages
    if (error.message?.includes('permission denied')) {
      console.log('💡 Suggestion: Make sure you are using the service role key, not the anon key')
    } else if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
      console.log('💡 Suggestion: The table might not exist. Check your database schema.')
    } else if (error.message?.includes('RLS')) {
      console.log('💡 Suggestion: Check Row Level Security policies for the categories table')
    }
    
    process.exit(1)
  }
}

// Alternative method using direct SQL execution
async function setupCategoriesAlternative() {
  try {
    console.log('🔄 Trying alternative setup method...')
    
    // Create table directly
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS categories (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `
    
    console.log('📝 Creating categories table...')
    const { error: createError } = await supabase.rpc('exec_sql', { sql: createTableQuery })
    
    if (createError) {
      console.error('❌ Failed to create table:', createError)
      throw createError
    }
    
    // Insert default data
    const defaultCategories = [
      { name: 'Workshop', description: 'Workshop completion certificates' },
      { name: 'Training', description: 'Training certificates' },
      { name: 'Seminar', description: 'Seminar attendance certificates' },
      { name: 'Course', description: 'Course completion certificates' },
      { name: 'Achievement', description: 'Achievement and award certificates' },
      { name: 'Participation', description: 'Participation certificates' }
    ]
    
    console.log('📊 Inserting default categories...')
    const { data: insertData, error: insertError } = await supabase
      .from('categories')
      .upsert(defaultCategories, { onConflict: 'name' })
      .select()
    
    if (insertError) {
      console.error('❌ Failed to insert categories:', insertError)
      throw insertError
    }
    
    console.log('✅ Categories setup completed!')
    console.log(`📊 Inserted ${insertData?.length || 0} categories`)
    
  } catch (error) {
    console.error('❌ Alternative setup also failed:', error)
    throw error
  }
}

// Main execution
async function main() {
  try {
    await setupCategories()
  } catch (error) {
    console.log('🔄 Primary method failed, trying alternative...')
    try {
      await setupCategoriesAlternative()
    } catch (altError) {
      console.error('❌ Both setup methods failed')
      console.log('\n💡 Manual setup instructions:')
      console.log('1. Go to your Supabase dashboard')
      console.log('2. Navigate to the SQL Editor')
      console.log('3. Run the SQL commands from scripts/setup-categories.sql')
      console.log('4. Make sure RLS policies allow public read access')
      process.exit(1)
    }
  }
}

main()
