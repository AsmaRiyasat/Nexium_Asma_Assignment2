'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

export default function Home() {
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [urdu, setUrdu] = useState('')
  const [fullBlog, setFullBlog] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [history, setHistory] = useState<string[]>([])

  const handleSummariseWithUrl = async (customUrl: string) => {
    setError('')
    setSummary('')
    setUrdu('')
    setFullBlog('')
    setLoading(true)

    try {
      const res = await fetch('/api/summarise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: customUrl }),
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Something went wrong.')
      } else {
        setSummary(data.summary)
        setUrdu(data.urduTranslation)
        setFullBlog(data.fullBlog)

        setHistory((prev) => {
          const filtered = prev.filter((item) => item !== customUrl)
          return [customUrl, ...filtered].slice(0, 5)
        })
        setUrl(customUrl)
      }
    } catch {
      setError('Network error or invalid URL.')
    } finally {
      setLoading(false)
    }
  }

  const handleSummarise = () => handleSummariseWithUrl(url)

  return (
    <main className="min-h-screen bg-black text-white py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-white">
          📝 Blog Summariser
        </h1>
        <p className="text-center text-gray-400">
          Paste a blog URL and get a summary + Urdu translation
        </p>

        <div className="flex gap-2">
          <Input
            placeholder="Enter blog URL"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={handleSummarise} disabled={loading}>
            {loading ? <Loader2 className="size-4 animate-spin" /> : 'Summarise'}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {summary && (
          <Card className="p-6 space-y-4 bg-neutral-900 text-white border border-gray-700 rounded-xl shadow-lg">
            <div>
              <h2 className="text-xl font-bold mb-1"> English Summary</h2>
              <p className="text-gray-300">{summary}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-1"> Urdu Translation</h2>
              <p className="text-gray-300">{urdu}</p>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-1">🔗 View Original Blog</h2>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-300 hover:underline text-sm"
              >
                {url}
              </a>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-1"> Full Blog Content</h2>
              <div className="max-h-60 overflow-y-auto p-4 rounded-md bg-neutral-800 text-sm text-gray-400 whitespace-pre-line border border-gray-700">
                {fullBlog}
              </div>
            </div>

            {history.length > 0 && (
              <div>
                <h2 className="text-xl font-bold mb-1 pt-4">
                  🔁 Re-summarise Most Recent Blog
                </h2>
                <Button
                  onClick={() => handleSummariseWithUrl(history[0])}
                  variant="link"
                  className="text-blue-300 text-sm p-0 h-auto"
                >
                  {history[0]}
                </Button>
              </div>
            )}

            {history.length > 1 && (
              <div>
                <h2 className="text-xl font-bold mb-1 pt-4"> Blog History</h2>
                <ul className="list-disc list-inside space-y-1 text-blue-300 text-sm">
                  {history.slice(1).map((item, index) => (
                    <li key={index}>
                      <a
                        href={item}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </Card>
        )}

        <footer className="text-center text-sm text-gray-500 pt-10">
          Built by <strong>Asma Riyasat</strong> ✨
        </footer>
      </div>
    </main>
  )
}
