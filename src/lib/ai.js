/**
 * AI Service for Gemini
 * Communicates with the local serverless proxy /api/gemini
 */

export const gemini = {
  /**
   * Generates text content using Gemini 2.0 Flash
   */
  async generateText(prompt, model = 'gemini-2.0-flash') {
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          action: 'generateContent',
          contents: [{ parts: [{ text: prompt }] }]
        })
      })
      const data = await res.json()
      if (data.candidates && data.candidates[0]?.content?.parts[0]?.text) {
        return data.candidates[0].content.parts[0].text
      }
      throw new Error(data.error?.message || 'Empty response from AI')
    } catch (err) {
      console.error('Gemini Generate Text Error:', err)
      throw err
    }
  },

  /**
   * Generates images using Imagen 3
   * Správny formát: instances[] + parameters{}
   */
  async generateImage(prompt, aspectRatio = '1:1') {
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'imagen-3.0-generate-001',
          instances: [{ prompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: aspectRatio
          }
        })
      })
      const data = await res.json()
      if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
        return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`
      }
      throw new Error(data.error?.message || 'Generovanie obrázku zlyhalo. Skontrolujte API kľúč.')
    } catch (err) {
      console.error('Gemini Image Gen Error:', err)
      throw err
    }
  },

  /**
   * AI úprava obrázkov: Odstránenie pozadia / Upscale
   * Používa Gemini 2.0 Flash image generation model – vracia skutočný obrázok
   */
  async processImage(base64Image, task = 'REMOVE_BACKGROUND') {
    const prompts = {
      REMOVE_BACKGROUND: 'Remove the background from this image completely. Keep only the main subject with a clean white background. Return the edited image.',
      UPSCALE: 'Enhance the quality of this image, sharpen details, reduce noise and improve overall clarity. Return the enhanced image.'
    }

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-2.0-flash-preview-image-generation',
          action: 'generateContent',
          contents: [{
            parts: [
              { text: prompts[task] || task },
              { inline_data: { mime_type: 'image/png', data: base64Image.split(',')[1] } }
            ]
          }],
          generationConfig: {
            responseModalities: ['IMAGE', 'TEXT']
          }
        })
      })
      const data = await res.json()

      // Hľadáme vrátený obrázok v častiach odpovede
      const parts = data.candidates?.[0]?.content?.parts || []
      for (const part of parts) {
        if (part.inline_data?.data) {
          return `data:${part.inline_data.mime_type || 'image/png'};base64,${part.inline_data.data}`
        }
      }

      throw new Error(data.error?.message || 'AI nevrátilo obrázok. Skúste znova.')
    } catch (err) {
      console.error('Vision Task Error:', err)
      throw err
    }
  }
}
