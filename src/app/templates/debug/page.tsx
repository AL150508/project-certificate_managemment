"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function TemplatesDebugPage() {
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    try {
      setLoading(true)
      setError(null)

      console.log('🔍 Starting template debug...')

      // Test 1: Simple query without join
      console.log('📝 Test 1: Simple query without join')
      const { data: simpleData, error: simpleError } = await supabase
        .from('certificate_templates')
        .select('*')

      console.log('Simple query result:', { data: simpleData, error: simpleError })

      if (simpleError) {
        setError(`Simple query error: ${simpleError.message}`)
        return
      }

      // Test 2: Query with specific columns
      console.log('📝 Test 2: Query with specific columns')
      const { data: specificData, error: specificError } = await supabase
        .from('certificate_templates')
        .select('id, name, image_url, orientation, category_id')

      console.log('Specific columns result:', { data: specificData, error: specificError })

      // Test 3: Check if certificate_categories table exists
      console.log('📝 Test 3: Check certificate_categories table')
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('certificate_categories')
        .select('*')

      console.log('Categories result:', { data: categoriesData, error: categoriesError })

      // Test 4: Try join query
      console.log('📝 Test 4: Try join query')
      const { data: joinData, error: joinError } = await supabase
        .from('certificate_templates')
        .select(`
          id,
          name,
          image_url,
          orientation,
          category_id,
          certificate_categories(name)
        `)

      console.log('Join query result:', { data: joinData, error: joinError })

      setTemplates(simpleData || [])
    } catch (err) {
      console.error('❌ Debug error:', err)
      setError(`Debug error: ${err}`)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-950 text-gray-100 p-8">
        <h1 className="text-2xl font-bold mb-4">Templates Debug</h1>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100 p-8">
      <h1 className="text-2xl font-bold mb-4">Templates Debug</h1>
      
      <Button onClick={loadTemplates} className="mb-4 bg-red-600 hover:bg-red-700">
        Reload Templates
      </Button>

      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-400 p-4 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      <div className="bg-neutral-900 border border-neutral-800 rounded p-4 mb-4">
        <h2 className="text-lg font-semibold mb-2">Templates Found: {templates.length}</h2>
        
        {templates.length === 0 ? (
          <p className="text-gray-400">No templates found in database</p>
        ) : (
          <div className="space-y-2">
            {templates.map((template, index) => (
              <div key={template.id || index} className="bg-neutral-800 p-3 rounded">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div><strong>ID:</strong> {template.id}</div>
                  <div><strong>Name:</strong> {template.name}</div>
                  <div><strong>Orientation:</strong> {template.orientation}</div>
                  <div><strong>Category ID:</strong> {template.category_id}</div>
                  <div><strong>Image URL:</strong> {template.image_url ? 'Present' : 'Missing'}</div>
                  <div><strong>Created:</strong> {template.created_at}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded p-4">
        <h2 className="text-lg font-semibold mb-2">Debug Instructions:</h2>
        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-300">
          <li>Check browser console for detailed logs</li>
          <li>Verify table structure in Supabase</li>
          <li>Check RLS policies</li>
          <li>Verify authentication status</li>
        </ol>
      </div>
    </div>
  )
}
