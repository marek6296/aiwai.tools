/**
 * Vercel Serverless Function — OpenAI Proxy
 * API kľúč zostáva na serveri, nikdy sa nedostane do prehliadača.
 * Klient volá: POST /api/openai  s rovnakým telom ako OpenAI API.
 */
export default async function handler(req, res) {
  // Len POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENAI_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI key not configured on server' })
  }

  try {
    const endpoint = req.query.endpoint || 'chat/completions'
    const openaiUrl = `https://api.openai.com/v1/${endpoint}`

    const response = await fetch(openaiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(req.body),
    })

    const data = await response.json()
    return res.status(response.status).json(data)
  } catch (err) {
    console.error('OpenAI proxy error:', err)
    return res.status(500).json({ error: 'Proxy request failed', detail: err.message })
  }
}
