/**
 * Supabase Connection Test Utilities
 * Helper functions untuk test koneksi dan akses tabel
 */

import { supabase } from './supabase'

export async function testSupabaseConnection() {
  try {
    console.log('Testing Supabase connection...')
    
    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase
      .from('categories')
      .select('count', { count: 'exact', head: true })
    
    if (connectionError) {
      console.error('Connection test failed:', connectionError)
      return {
        success: false,
        error: connectionError.message,
        details: connectionError
      }
    }
    
    console.log('Connection test successful')
    return {
      success: true,
      message: 'Supabase connection is working'
    }
  } catch (error) {
    console.error('Connection test error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }
  }
}

export async function testCategoriesTable() {
  try {
    console.log('Testing categories table access...')
    
    // Test table access and structure
    const { data, error, count } = await supabase
      .from('categories')
      .select('*', { count: 'exact' })
      .limit(5)
    
    if (error) {
      console.error('Categories table test failed:', error)
      return {
        success: false,
        error: error.message,
        details: error,
        suggestion: 'Check if categories table exists and has proper RLS policies'
      }
    }
    
    console.log('Categories table test successful:', {
      totalCount: count,
      sampleData: data
    })
    
    return {
      success: true,
      data,
      count,
      message: `Categories table accessible with ${count} records`
    }
  } catch (error) {
    console.error('Categories table test error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }
  }
}

export async function listAllTables() {
  try {
    console.log('Listing all accessible tables...')
    
    // Try to access different tables to see which ones exist
    const tables = ['categories', 'members', 'certificates', 'templates', 'users']
    const results = []
    
    for (const table of tables) {
      try {
        const { data, error, count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
        
        results.push({
          table,
          accessible: !error,
          count: count || 0,
          error: error?.message || null
        })
      } catch (err) {
        results.push({
          table,
          accessible: false,
          count: 0,
          error: err instanceof Error ? err.message : 'Unknown error'
        })
      }
    }
    
    console.log('Table accessibility results:', results)
    return results
  } catch (error) {
    console.error('Error listing tables:', error)
    return []
  }
}

export async function checkRLSPolicies() {
  try {
    console.log('Checking RLS policies...')
    
    // Test if we can read from categories without authentication
    const { data: publicData, error: publicError } = await supabase
      .from('categories')
      .select('id, name')
      .limit(1)
    
    // Test with current user session
    const { data: { user } } = await supabase.auth.getUser()
    
    return {
      publicAccess: !publicError,
      publicError: publicError?.message || null,
      userSession: !!user,
      userId: user?.id || null,
      userEmail: user?.email || null,
      suggestion: publicError 
        ? 'RLS policies might be blocking access. Check if policies allow public read access or if user needs to be authenticated.'
        : 'Public access is working'
    }
  } catch (error) {
    console.error('Error checking RLS policies:', error)
    return {
      error: error instanceof Error ? error.message : 'Unknown error'
    }
  }
}

// Main diagnostic function
export async function runSupabaseDiagnostics() {
  console.log('🔍 Running Supabase diagnostics...')
  
  const results = {
    connection: await testSupabaseConnection(),
    categories: await testCategoriesTable(),
    tables: await listAllTables(),
    rls: await checkRLSPolicies(),
    timestamp: new Date().toISOString()
  }
  
  console.log('📊 Diagnostic Results:', results)
  
  // Generate recommendations
  const recommendations = []
  
  if (!results.connection.success) {
    recommendations.push('❌ Fix Supabase connection configuration')
  }
  
  if (!results.categories.success) {
    recommendations.push('❌ Check categories table exists and has proper structure')
  }
  
  if (!results.rls.publicAccess && !results.rls.userSession) {
    recommendations.push('❌ Configure RLS policies or authenticate user')
  }
  
  const accessibleTables = results.tables.filter(t => t.accessible)
  if (accessibleTables.length === 0) {
    recommendations.push('❌ No tables are accessible - check database setup')
  }
  
  if (recommendations.length === 0) {
    recommendations.push('✅ All checks passed - Supabase is working correctly')
  }
  
  console.log('💡 Recommendations:', recommendations)
  
  return {
    ...results,
    recommendations,
    summary: {
      connectionWorking: results.connection.success,
      categoriesAccessible: results.categories.success,
      tablesFound: accessibleTables.length,
      userAuthenticated: results.rls.userSession
    }
  }
}
