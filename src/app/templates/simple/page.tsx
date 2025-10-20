"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'

export default function SimpleTemplatesPage() {
  const [loading, setLoading] = useState(true)
  const [templates, setTemplates] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState('Starting...')

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      setStep('Testing Supabase connection...')
      
      // Test 1: Simple connection test
      const { data: testData, error: testError } = await supabase
        .from('certificate_templates')
        .select('count', { count: 'exact', head: true })

      if (testError) {
        setError(`Connection test failed: ${testError.message}`)
        setStep('Connection failed')
        setLoading(false)
        return
      }

      setStep('Connection OK, loading templates...')

      // Test 2: Load actual data
      const { data: templatesData, error: templatesError } = await supabase
        .from('certificate_templates')
        .select('*')
        .limit(10)

      if (templatesError) {
        setError(`Templates query failed: ${templatesError.message}`)
        setStep('Query failed')
      } else {
        setTemplates(templatesData || [])
        setStep(`Loaded ${(templatesData || []).length} templates`)
      }

    } catch (err) {
      setError(`Unexpected error: ${err}`)
      setStep('Unexpected error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Simple Templates Test</h1>
        
        <div className="bg-neutral-900 border border-neutral-800 rounded p-4 mb-4">
          <div className="mb-4">
            <strong>Status:</strong> {step}
          </div>
          
          {loading && (
            <div className="flex items-center gap-2 mb-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-red-600"></div>
              <span>Loading...</span>
            </div>
          )}

          {error && (
            <div className="bg-red-900/20 border border-red-800 text-red-400 p-3 rounded mb-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          <Button 
            onClick={testConnection} 
            className="bg-red-600 hover:bg-red-700 mb-4"
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test Again'}
          </Button>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded p-4">
          <h2 className="text-lg font-semibold mb-4">
            Templates Found: {templates.length}
          </h2>
          
          {templates.length === 0 ? (
            <p className="text-gray-400">No templates in database</p>
          ) : (
            <div className="space-y-3">
              {templates.map((template, index) => (
                <div key={template.id || index} className="bg-neutral-800 p-3 rounded">
                  <div className="text-sm space-y-1">
                    <div><strong>ID:</strong> {template.id}</div>
                    <div><strong>Name:</strong> {template.name || 'No name'}</div>
                    <div><strong>Orientation:</strong> {template.orientation || 'Not set'}</div>
                    <div><strong>Category ID:</strong> {template.category_id || 'Not set'}</div>
                    <div><strong>Image URL:</strong> {template.image_url ? 'Present' : 'Missing'}</div>
                    <div><strong>Width:</strong> {template.width_px || 'Not set'}</div>
                    <div><strong>Height:</strong> {template.height_px || 'Not set'}</div>
                    <div><strong>Created:</strong> {template.created_at || 'Not set'}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 bg-neutral-900 border border-neutral-800 rounded p-4">
          <h2 className="text-lg font-semibold mb-2">Quick Actions</h2>
          <div className="space-y-2">
            <Button 
              onClick={() => window.location.href = '/templates'} 
              className="bg-blue-600 hover:bg-blue-700 mr-2"
            >
              Go to Main Templates Page
            </Button>
            <Button 
              onClick={() => window.location.href = '/templates/debug'} 
              className="bg-green-600 hover:bg-green-700"
            >
              Go to Debug Page
            </Button>
          </div>
        </div>

        <div className="mt-6 text-sm text-gray-400">
          <p><strong>Expected render time:</strong> 1-3 seconds</p>
          <p><strong>If taking longer:</strong> Check network tab in DevTools</p>
          <p><strong>If still stuck:</strong> Check Supabase connection and RLS policies</p>
        </div>
      </div>
    </div>
  )
}
