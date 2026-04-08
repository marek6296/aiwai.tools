<template>
  <div class="creative-engine glass">
    <div class="engine-layout">
      <!-- Preview Pane -->
      <div class="preview-pane">
        <div class="preview-object" :style="previewStyle">
          <template v-if="tool.id !== 'flex-grid-gen'">
            <span>AIWai</span>
          </template>
          <template v-else>
            <div v-for="i in 3" :key="i" class="mini-box glass"></div>
          </template>
        </div>
      </div>

      <!-- Controls Pane -->
      <div class="controls-pane">
        <h3>{{ tool.name }}</h3>
        
        <!-- Gradient Gen -->
        <div v-if="tool.id === 'gradient-gen'" class="options">
          <label>Farba 1</label>
          <input type="color" v-model="color1" />
          <label>Farba 2</label>
          <input type="color" v-model="color2" />
          <label>Uhol: {{ angle }}°</label>
          <input type="range" v-model="angle" min="0" max="360" />
        </div>

        <!-- Glassmorphism -->
        <div v-if="tool.id === 'glass-gen'" class="options">
          <label>Priehľadnosť: {{ opacity }}</label>
          <input type="range" v-model="opacity" min="0" max="1" step="0.1" />
          <label>Rozmazanie (Blur): {{ blur }}px</label>
          <input type="range" v-model="blur" min="0" max="40" />
        </div>

        <!-- Shadow Gen -->
        <div v-if="tool.id === 'shadow-gen'" class="options">
          <label>Horizontálny posun: {{ shadowX }}px</label>
          <input type="range" v-model="shadowX" min="-50" max="50" />
          <label>Vertikálny posun: {{ shadowY }}px</label>
          <input type="range" v-model="shadowY" min="-50" max="50" />
          <label>Rozostrenie: {{ shadowBlur }}px</label>
          <input type="range" v-model="shadowBlur" min="0" max="100" />
        </div>

        <!-- Color Conv -->
        <div v-if="tool.id === 'color-conv'" class="options pro-colors">
          <label>Vybrať farbu</label>
          <input type="color" v-model="color1" class="big-picker" />
          
          <div class="color-values">
            <div class="val-card glass">
              <span>HEX</span>
              <strong>{{ color1.toUpperCase() }}</strong>
            </div>
            <div class="val-card glass">
              <span>RGB</span>
              <strong>{{ rgbValue }}</strong>
            </div>
            <div class="val-card glass">
              <span>HSL</span>
              <strong>{{ hslValue }}</strong>
            </div>
          </div>
        </div>

        <!-- Contrast Checker -->
        <div v-if="tool.id === 'contrast-checker'" class="options contrast-tool">
          <div class="color-inputs">
            <div class="field">
              <label>Farba textu (Foreground)</label>
              <input type="color" v-model="color1" />
            </div>
            <div class="field">
              <label>Pozadie (Background)</label>
              <input type="color" v-model="color2" />
            </div>
          </div>

          <div class="contrast-results glass">
            <div class="ratio-circle">
              <span class="ratio">{{ contrastRatio.toFixed(2) }}</span>
              <span class="ratio-label">Kontrast</span>
            </div>
            
            <div class="standards">
              <div :class="['standard', { pass: contrastRatio >= 4.5 }]">
                <span>WCAG AA</span>
                <strong>{{ contrastRatio >= 4.5 ? 'PASS' : 'FAIL' }}</strong>
              </div>
              <div :class="['standard', { pass: contrastRatio >= 7 }]">
                <span>WCAG AAA</span>
                <strong>{{ contrastRatio >= 7 ? 'PASS' : 'FAIL' }}</strong>
              </div>
            </div>
          </div>
        </div>

        <!-- Border Radius Viz -->
        <div v-if="tool.id === 'border-radius-viz'" class="options">
          <label>Top Left: {{ brTL }}px</label>
          <input type="range" v-model="brTL" min="0" max="200" />
          <label>Top Right: {{ brTR }}px</label>
          <input type="range" v-model="brTR" min="0" max="200" />
          <label>Bottom Right: {{ brBR }}px</label>
          <input type="range" v-model="brBR" min="0" max="200" />
          <label>Bottom Left: {{ brBL }}px</label>
          <input type="range" v-model="brBL" min="0" max="200" />
        </div>

        <!-- Flex/Grid Gen -->
        <div v-if="tool.id === 'flex-grid-gen'" class="options">
          <label>Typ rozloženia</label>
          <select v-model="layoutType">
            <option value="flex">Flexbox</option>
            <option value="grid">CSS Grid</option>
          </select>
          <label>Direction / Columns</label>
          <input v-if="layoutType === 'flex'" type="text" v-model="flexDir" placeholder="row, column" />
          <input v-else type="text" v-model="gridCols" placeholder="repeat(3, 1fr)" />
          <label>Medzera (Gap): {{ layoutGap }}px</label>
          <input type="range" v-model="layoutGap" min="0" max="100" />
          <label>Zarovnanie</label>
          <select v-model="justify">
            <option value="center">Center</option>
            <option value="space-between">Space Between</option>
            <option value="flex-start">Flex Start</option>
          </select>
        </div>

        <!-- Palette Generator -->
        <div v-if="tool.id === 'palette-gen'" class="options palette-tool">
          <label>Základná farba</label>
          <input type="color" v-model="color1" class="big-picker" />
          <button class="btn-gen-palette clickable" @click="generatePalette">Generovať paletu</button>
          <div class="palette-strip" v-if="palette.length">
            <div v-for="(c, i) in palette" :key="i" class="palette-swatch clickable" :style="{ background: c }" @click="copyPaletteColor(c)">
              <span>{{ c.toUpperCase() }}</span>
            </div>
          </div>
        </div>

        <!-- Generated Code Section (Hidden for contrast & palette tools) -->
        <div class="code-box" v-if="!['contrast-checker', 'palette-gen'].includes(tool.id)">
          <code>{{ generatedCSS }}</code>
          <button class="copy-small clickable" @click="copyCSS">Kopírovať CSS</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  tool: Object
})

// Core State
const color1 = ref('#c5a96a')
const color2 = ref('#101014')
const angle = ref(135)
const opacity = ref(0.2)
const blur = ref(16)
const shadowX = ref(10)
const shadowY = ref(10)
const shadowBlur = ref(20)

// Radius & Layout
const brTL = ref(24)
const brTR = ref(24)
const brBR = ref(24)
const brBL = ref(24)

const layoutType = ref('flex')
const flexDir = ref('row')
const gridCols = ref('repeat(3, 1fr)')
const layoutGap = ref(20)
const justify = ref('center')

// Standard Color Conversions
const getRGB = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

const rgbValue = computed(() => {
  const { r, g, b } = getRGB(color1.value)
  return `rgb(${r}, ${g}, ${b})`
})

const hslValue = computed(() => {
  let { r, g, b } = getRGB(color1.value)
  r /= 255; g /= 255; b /= 255
  let max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h, s, l = (max + min) / 2
  if (max === min) h = s = 0 
  else {
    let d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h /= 6
  }
  return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`
})

// WCAG Contrast Logic
const getLuminance = (hex) => {
  const { r, g, b } = getRGB(hex)
  const a = [r, g, b].map(v => {
    v /= 255
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  })
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722
}

const contrastRatio = computed(() => {
  const l1 = getLuminance(color1.value)
  const l2 = getLuminance(color2.value)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
})

const palette = ref([])

const generatePalette = () => {
  const { r, g, b } = getRGB(color1.value)
  palette.value = [
    color1.value,
    `#${Math.min(255, r + 40).toString(16).padStart(2, '0')}${Math.min(255, g + 40).toString(16).padStart(2, '0')}${Math.min(255, b + 40).toString(16).padStart(2, '0')}`,
    `#${Math.max(0, r - 40).toString(16).padStart(2, '0')}${Math.max(0, g - 40).toString(16).padStart(2, '0')}${Math.max(0, b - 40).toString(16).padStart(2, '0')}`,
    `#${Math.min(255, r + 80).toString(16).padStart(2, '0')}${Math.min(255, g + 20).toString(16).padStart(2, '0')}${Math.max(0, b - 30).toString(16).padStart(2, '0')}`,
    `#${Math.max(0, r - 60).toString(16).padStart(2, '0')}${Math.min(255, g + 60).toString(16).padStart(2, '0')}${Math.min(255, b + 80).toString(16).padStart(2, '0')}`
  ]
}

const copyPaletteColor = (c) => {
  navigator.clipboard.writeText(c)
}

const previewStyle = computed(() => {
  if (props.tool.id === 'gradient-gen') return { background: `linear-gradient(${angle.value}deg, ${color1.value}, ${color2.value})` }
  if (props.tool.id === 'glass-gen') return {
    background: `rgba(255, 255, 255, ${opacity.value})`,
    backdropFilter: `blur(${blur.value}px)`,
    webkitBackdropFilter: `blur(${blur.value}px)`,
    border: '1px solid rgba(255, 255, 255, 0.1)'
  }
  if (props.tool.id === 'shadow-gen') return { background: 'var(--bg-soft)', boxShadow: `${shadowX.value}px ${shadowY.value}px ${shadowBlur.value}px rgba(0,0,0,0.5)` }
  if (props.tool.id === 'color-conv') return { background: color1.value }
  if (props.tool.id === 'contrast-checker') return { background: color2.value, color: color1.value }
  if (props.tool.id === 'palette-gen') return { background: `linear-gradient(135deg, ${color1.value}, ${palette.value[4] || '#333'})` }
  if (props.tool.id === 'border-radius-viz') return { background: color1.value, borderRadius: `${brTL.value}px ${brTR.value}px ${brBR.value}px ${brBL.value}px` }
  if (props.tool.id === 'flex-grid-gen') return { 
    display: layoutType.value,
    flexDirection: flexDir.value,
    gridTemplateColumns: gridCols.value,
    gap: `${layoutGap.value}px`,
    justifyContent: justify.value,
    alignItems: 'center',
    padding: '20px',
    background: 'rgba(255,255,255,0.05)'
  }
  return {}
})

const generatedCSS = computed(() => {
  if (props.tool.id === 'color-conv') return `HEX: ${color1.value}\nRGB: ${rgbValue.value}\nHSL: ${hslValue.value}`
  const styles = previewStyle.value
  let css = ''
  for (const [key, value] of Object.entries(styles)) {
    const k = key.replace(/([A-Z])/g, "-$1").toLowerCase()
    css += `${k}: ${value};\n`
  }
  return css
})

const copyCSS = () => {
  navigator.clipboard.writeText(generatedCSS.value)
  alert('CSS skopírované!')
}
</script>

<style scoped>
.creative-engine { width: 100%; }
.engine-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 3rem; align-items: start; }

.preview-pane {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFklEQVQYV2P8//8/AwXgYBjVMIphFAMA6S8P8f6B28AAAAAASUVORK5CYII=');
  border-radius: var(--radius-md);
  border: 1px solid var(--border-dim);
}

.preview-object {
  width: 280px;
  height: 280px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 900;
  transition: all 0.3s;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
}

.controls-pane { display: flex; flex-direction: column; gap: 2rem; }
.options { display: flex; flex-direction: column; gap: 1.25rem; }
.options label { font-size: 0.85rem; font-weight: 700; color: var(--text-muted); text-transform: uppercase; }

input[type="color"] { width: 100%; height: 50px; background: transparent; border: none; cursor: pointer; }
.big-picker { height: 60px !important; border-radius: 12px; }

.color-values { display: grid; gap: 1rem; }
.val-card { padding: 1.25rem; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; }
.val-card span { font-size: 0.75rem; font-weight: 800; color: var(--text-muted); }
.val-card strong { font-family: 'JetBrains Mono', monospace; color: var(--accent-gold); font-size: 1.1rem; }

/* Contrast Tool Styles */
.contrast-tool .color-inputs { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.field { display: flex; flex-direction: column; gap: 0.75rem; }

.contrast-results {
  margin-top: 1rem;
  padding: 2rem;
  border-radius: 16px;
  background: var(--bg-soft);
  display: flex;
  align-items: center;
  gap: 2.5rem;
}

.ratio-circle {
  width: 100px;
  height: 100px;
  border: 4px solid var(--accent-gold);
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.ratio { font-size: 1.75rem; font-weight: 900; color: var(--accent-gold); line-height: 1; }
.ratio-label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; margin-top: 0.2rem; }

.standards { flex: 1; display: flex; flex-direction: column; gap: 0.75rem; }
.standard {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background: var(--bg-deep);
  border-radius: 8px;
  border-left: 4px solid #ff4d4d;
}

.standard.pass { border-left-color: #2ed573; }
.standard span { font-size: 0.8rem; font-weight: 700; color: var(--text-muted); }
.standard strong { font-size: 0.8rem; font-weight: 900; }
.standard.pass strong { color: #2ed573; }

.code-box { background: var(--bg-deep); padding: 1.8rem; border-radius: 12px; border: 1px solid var(--border-dim); }
code { display: block; font-family: 'JetBrains Mono', monospace; font-size: 0.9rem; color: var(--accent-gold); white-space: pre-wrap; line-height: 1.6; }
.copy-small { margin-top: 1.25rem; padding: 0.6rem 1.2rem; background: var(--accent-gold); color: var(--bg-deep); border: none; border-radius: 6px; font-weight: 800; font-size: 0.85rem; }

.btn-gen-palette { padding: 0.8rem; background: var(--accent-gold); color: var(--bg-deep); border: none; border-radius: 8px; font-weight: 800; cursor: pointer; }
.palette-strip { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.5rem; margin-top: 0.5rem; }
.palette-swatch { aspect-ratio: 1; border-radius: 12px; display: flex; align-items: flex-end; justify-content: center; padding: 0.5rem; transition: transform 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
.palette-swatch:hover { transform: scale(1.08); }
.palette-swatch span { font-size: 0.6rem; font-weight: 800; color: white; text-shadow: 0 1px 3px rgba(0,0,0,0.6); }

/* Layout Tool Specific */
.mini-box { width: 60px; height: 60px; border: 2px solid var(--accent-gold); border-radius: 8px; }
select, .options input[type="text"] { width: 100%; background: var(--bg-deep); border: 1px solid var(--border-dim); padding: 0.8rem; border-radius: 8px; color: var(--text-primary); outline: none; }

@media (max-width: 900px) { .engine-layout { grid-template-columns: 1fr; } }
</style>
