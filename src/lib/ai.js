/**
 * AI Helper — volá server-side proxy endpointy.
 * API kľúče nikdy neopustia server.
 */

// ─── OpenAI ────────────────────────────────────────────────────────────────

/**
 * Zavolá OpenAI Chat Completions cez server proxy.
 * @param {Array}  messages  - pole { role, content } správ
 * @param {Object} options   - model, temperature, max_tokens, ...
 * @returns {Promise<string>} - odpoveď modelu
 */
export async function openaiChat(messages, options = {}) {
  const res = await fetch('/api/openai', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: options.model || 'gpt-4o-mini',
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 1024,
      ...options,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `OpenAI chyba: ${res.status}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

/**
 * Zavolá OpenAI Images (DALL·E) cez server proxy.
 * @param {string} prompt
 * @param {Object} options - model, size, n, quality
 * @returns {Promise<string[]>} - pole URL obrázkov
 */
export async function openaiImage(prompt, options = {}) {
  const res = await fetch('/api/openai?endpoint=images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: options.model || 'dall-e-3',
      prompt,
      n: options.n || 1,
      size: options.size || '1024x1024',
      quality: options.quality || 'standard',
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `DALL·E chyba: ${res.status}`)
  }

  const data = await res.json()
  return data.data?.map((d) => d.url) ?? []
}

// ─── Gemini ────────────────────────────────────────────────────────────────

/**
 * Zavolá Google Gemini cez server proxy.
 * @param {string} prompt   - jednoduchý text prompt
 * @param {Object} options  - model, temperature, maxOutputTokens
 * @returns {Promise<string>} - odpoveď modelu
 */
export async function geminiChat(prompt, options = {}) {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: options.model || 'gemini-2.0-flash',
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxOutputTokens ?? 1024,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Gemini chyba: ${res.status}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}

/**
 * Zavolá Gemini s plnou kontrolou nad contents poľom (multi-turn, multimodal).
 * @param {Array}  contents  - Gemini contents formát
 * @param {Object} options
 * @returns {Promise<string>}
 */
export async function geminiRaw(contents, options = {}) {
  const res = await fetch('/api/gemini', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: options.model || 'gemini-2.0-flash',
      contents,
      generationConfig: {
        temperature: options.temperature ?? 0.7,
        maxOutputTokens: options.maxOutputTokens ?? 2048,
        ...options.generationConfig,
      },
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message || `Gemini chyba: ${res.status}`)
  }

  const data = await res.json()
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? ''
}
