<template>
  <div class="business-engine glass">
    <div class="engine-ui">
      <!-- Legal Document Generators -->
      <div v-if="tool.id === 'privacy-gen' || tool.id === 'tos-gen'" class="legal-tool">
        <label>Názov firmy / Webstránka</label>
        <input type="text" v-model="input" @input="generateLegal" placeholder="napr. AIWai s.r.o. / aiwai.sk" />
        
        <div class="result-area glass mt-2 reveal" v-if="output">
          <div class="result-header">
            <span>{{ tool.name }} - Návrh:</span>
            <button class="copy-btn clickable" @click="copy(output)"><PhCopy :size="18" /></button>
          </div>
          <div class="legal-text">{{ output }}</div>
        </div>
      </div>

      <!-- Invoice Mini -->
      <div v-else-if="tool.id === 'invoice-mini'" class="invoice-tool">
        <div class="invoice-form glass row">
          <div class="form-col">
            <label>Odberateľ</label>
            <input type="text" v-model="clientName" placeholder="Meno firmy..." />
            <label>Služba / Produkt</label>
            <input type="text" v-model="itemName" placeholder="Popis..." />
          </div>
          <div class="form-col">
            <label>Suma (€)</label>
            <input type="number" v-model="price" />
            <label>Splatnosť</label>
            <input type="date" v-model="dueDate" />
          </div>
        </div>

        <div class="invoice-preview glass mt-2" id="invoice">
          <div class="inv-header">
            <div class="logo">INVOICE</div>
            <div class="inv-details">#AI-{{ Math.floor(Math.random() * 1000) }}</div>
          </div>
          <div class="inv-body">
            <div class="inv-row"><span>Odberateľ:</span> <strong>{{ clientName || 'Naozajstný zákazník' }}</strong></div>
            <div class="inv-row"><span>Splatnosť:</span> <strong>{{ dueDate }}</strong></div>
            <div class="inv-table glass">
              <div class="table-header"><span>Popis</span><span>Suma</span></div>
              <div class="table-row"><span>{{ itemName || 'Profesionálna služba' }}</span><span>{{ price }} €</span></div>
            </div>
            <div class="inv-total">Celkom: <strong>{{ price }} €</strong></div>
          </div>
          <div class="inv-footer">Tvorba cez AIWai.sk - Ďakujeme za váš biznis.</div>
        </div>
        <button class="btn-main mt-1 full-width" @click="printInvoice">Tlačiť faktúru (PDF)</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { PhCopy } from '@phosphor-icons/vue'

const props = defineProps({
  tool: Object
})

const input = ref('')
const output = ref('')
const clientName = ref('')
const itemName = ref('')
const price = ref(100)
const dueDate = ref('2026-04-30')

const generateLegal = () => {
  const name = input.value || 'VAŠA STRÁNKA'
  if (props.tool.id === 'privacy-gen') {
    output.value = `ZÁSADY OCHRANY OSOBNÝCH ÚDAJOV (GDPR)\nPre webstránku: ${name}\n\n1. Úvod\nVaše súkromie berieme vážne. Dokument určuje, ako nakladáme s vašimi údajmi...\n2. Zhromažďovanie údajov\nZbierame meno, email a IP adresu pre technickú analýzu...\n3. Vaše práva\nMáte právo na prístup, opravu alebo vymazanie vašich údajov.`
  } else {
    output.value = `VŠEOBECNÉ OBCHODNÉ PODMIENKY (ToS)\nPre entitu: ${name}\n\n1. Licencia užívania\nTieto podmienky upravujú prístup k našim službám...\n2. Zodpovednosť\nAIWai nenesie zodpovednosť za nesprávne použitie vygenerovaných dát...\n3. Zmeny\nPodmienky sa môžu zmeniť bez predošlého ohlásenia.`
  }
}

const printInvoice = () => { window.print() }
const copy = (t) => { navigator.clipboard.writeText(t) }
</script>

<style scoped>
.business-engine { padding: 4rem; border-radius: 40px; width: 100%; min-height: 100%; }
input { 
  width: 100%; background: var(--bg-deep); border: 1px solid var(--border-dim);
  padding: 1rem; color: var(--text-primary); border-radius: 8px; outline: none; font-size: 1.1rem;
}
.legal-text { white-space: pre-wrap; font-family: 'Inter', sans-serif; line-height: 1.6; color: var(--text-secondary); padding: 1rem; }
.result-area { border: 1px solid var(--accent-gold); overflow: hidden; }
.result-header { background: var(--bg-soft); padding: 0.5rem 1.5rem; display: flex; justify-content: space-between; align-items: center; }

.invoice-preview { padding: 3rem; border-radius: 4px; background: white; color: black; font-family: 'Inter', sans-serif; }
.inv-header { display: flex; justify-content: space-between; border-bottom: 2px solid black; padding-bottom: 2rem; margin-bottom: 2rem; }
.logo { font-size: 2rem; font-weight: 900; letter-spacing: -1px; }
.inv-body { display: flex; flex-direction: column; gap: 1rem; }
.inv-row { font-size: 1.1rem; }
.inv-table { margin-top: 2rem; border-radius: 0; background: transparent; color: black; border: 2px solid black; }
.table-header { padding: 1rem; background: #eee; font-weight: 800; display: flex; justify-content: space-between; }
.table-row { padding: 1.5rem 1rem; display: flex; justify-content: space-between; border-top: 1px solid black; }
.inv-total { margin-top: 2rem; text-align: right; font-size: 1.5rem; font-weight: 900; border-top: 2px solid black; padding-top: 1rem; }
.inv-footer { margin-top: 3rem; font-size: 0.8rem; text-align: center; color: #666; }

.invoice-form { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; padding: 2rem; margin-bottom: 1.5rem; }
.form-col { display: flex; flex-direction: column; gap: 1rem; }
.form-col label { font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; }

.btn-main { background: var(--accent-gold); color: var(--bg-deep); border: none; padding: 1.2rem; border-radius: 8px; font-weight: 800; cursor: pointer; }
.full-width { width: 100%; }
.mt-2 { margin-top: 2rem; }
.copy-btn { background: var(--accent-gold); color: var(--bg-deep); border: none; width: 40px; height: 40px; border-radius: 8px; }

@media print {
  .invoice-form, .btn-main, .sidebar, .navbar { display: none !important; }
  .invoice-preview { border: none !important; margin: 0; width: 100%; height: 100%; }
}
</style>
