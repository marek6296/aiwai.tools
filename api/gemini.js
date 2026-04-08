export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const apiKey = process.env.GEMINI_KEY
  if (!apiKey) return res.status(500).json({ error: 'Gemini key not configured' })

  try {
    const { model = 'gemini-2.0-flash', action = 'generateContent', ...body } = req.body
    
    // Determine the API endpoint based on model type
    let apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:${action}?key=${apiKey}`
    
    // For Imagen 3 or specialized vision tasks
    if (model.includes('imagen')) {
      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:predict?key=${apiKey}`
    }

    console.log(`Gemini Proxy Calling: ${model}:${action}`)

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    if (!response.ok) {
       console.error('Gemini API Error Body:', JSON.stringify(data))
    }
    return res.status(response.status).json(data)
  } catch (err) {
    return res.status(500).json({ error: 'Proxy error', detail: err.message })
  }
}
