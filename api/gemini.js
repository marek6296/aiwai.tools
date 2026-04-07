/**
 * Vercel Serverless Function — Gemini Proxy
 * API kľúč zostáva na serveri, nikdy sa nedostane do prehliadača.
 * Klient volá: POST /api/gemini
 *   Body: { model?: string, contents: [...], generationConfig?: {...} }
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.GEMINI_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'Gemini key not configured on server' })
  }

  try {
    const { model = 'gemini-2.0-flash', ...body } = req.body
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

    const response = await fetch(geminiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    return res.status(response.status).json(data)
  } catch (err) {
    console.error('Gemini proxy error:', err)
    return res.status(500).json({ error: 'Proxy request failed', detail: err.message })
  }
}
