/**
 * AI Service for Gemini
 * Communicates with the local serverless proxy /api/gemini
 */

export const gemini = {
  /**
   * Generates text content using Gemini 1.5 Flash
   */
  async generateText(prompt, model = 'gemini-1.5-flash') {
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
   */
  async generateImage(prompt, aspectRatio = '1:1') {
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'imagen-3.0-generate-001',
          prompt,
          aspect_ratio: aspectRatio,
          number_of_images: 1
        })
      })
      const data = await res.json()
      if (data.predictions && data.predictions[0]?.bytesBase64Encoded) {
        return `data:image/png;base64,${data.predictions[0].bytesBase64Encoded}`
      }
      // Fallback check for different API response formats
      if (data.candidates && data.candidates[0]?.output_file) {
         return data.candidates[0].output_file
      }
      throw new Error(data.error?.message || 'Image generation not supported by this API key yet.')
    } catch (err) {
      console.error('Gemini Image Gen Error:', err)
      throw err
    }
  },

  /**
   * Universal vision task (Background removal, Upscale via instructions)
   */
  async processImage(base64Image, task = 'REMOVE_BACKGROUND') {
    const instructions = {
      REMOVE_BACKGROUND: "Keep the main subject and make the background completely transparent or pure white. Describe the mask.",
      UPSCALE: "Increase resolution, enhance details and remove compression artifacts from this image."
    }

    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'gemini-1.5-flash',
          contents: [{
            parts: [
              { text: instructions[task] || task },
              { inline_data: { mime_type: "image/png", data: base64Image.split(',')[1] } }
            ]
          }]
        })
      })
      const data = await res.json()
      return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No description returned'
    } catch (err) {
      console.error('Vision Task Error:', err)
      throw err
    }
  }
}
