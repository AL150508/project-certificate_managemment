import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join } from 'path'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupUsers() {
  try {
    console.log('Setting up users table...')
    
    const sqlPath = join(process.cwd(), 'scripts', 'setup-users.sql')
    const sql = readFileSync(sqlPath, 'utf8')
    
    const { error } = await supabase.rpc('exec_sql', { sql })
    
    if (error) {
      console.error('Error setting up users:', error)
      return
    }
    
    console.log('✅ Users table setup completed!')
    console.log('Default admin user created: admin@gmail.com')
    
  } catch (error) {
    console.error('Setup failed:', error)
  }
}

setupUsers()
