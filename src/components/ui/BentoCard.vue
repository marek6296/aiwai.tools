<template>
  <div 
    class="bento-card-wrapper"
    ref="cardRef"
    @mousemove="handleMouseMove"
    @mouseleave="handleMouseLeave"
  >
    <router-link 
      :to="to || '#'"
      class="bento-card glass clickable"
    >
      <div class="card-glow" :style="glowStyle"></div>
      
      <div class="card-icon">
        <component :is="icon" :size="24" weight="duotone" />
      </div>
      
      <div class="card-content">
        <h3 class="card-title">{{ title }}</h3>
        <p class="card-description">{{ description }}</p>
      </div>
      
      <div class="card-footer">
        <span class="card-count">{{ count }} nástrojov</span>
        <div class="card-arrow">
          <PhArrowRight :size="16" />
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { PhArrowRight } from '@phosphor-icons/vue'

const props = defineProps({
  title: String,
  description: String,
  icon: Object,
  count: Number,
  to: String
})

const cardRef = ref(null)
const mouseX = ref(0)
const mouseY = ref(0)
const isHovering = ref(false)

const handleMouseMove = (e) => {
  const rect = cardRef.value.getBoundingClientRect()
  mouseX.value = e.clientX - rect.left
  mouseY.value = e.clientY - rect.top
  isHovering.value = true
}

const handleMouseLeave = () => {
  isHovering.value = false
}

const glowStyle = computed(() => ({
  opacity: isHovering.value ? 1 : 0,
  background: `radial-gradient(600px circle at ${mouseX.value}px ${mouseY.value}px, rgba(197, 169, 106, 0.1), transparent 40%)`
}))
</script>

<style scoped>
.bento-card-wrapper {
  height: 100%;
}

.bento-card {
  position: relative;
  padding: 2rem;
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  transition: transform 0.4s cubic-bezier(0.17, 0.67, 0.83, 0.67), 
              border-color 0.4s ease, 
              box-shadow 0.4s ease;
  height: 100%;
  width: 100%;
}

.bento-card:hover {
  transform: translateY(-5px);
  border-color: var(--border-bright);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.card-glow {
  position: absolute;
  inset: 0;
  pointer-events: none;
  transition: opacity 0.4s ease;
  z-index: 0;
}

.card-icon {
  width: 54px;
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--bg-soft);
  color: var(--accent-gold);
  border: 1px solid var(--border-dim);
  z-index: 1;
}

.card-content {
  flex: 1;
  z-index: 1;
}

.card-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.card-description {
  font-size: 0.9rem;
  color: var(--text-muted);
  line-height: 1.6;
}

.card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  z-index: 1;
}

.card-count {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-dim);
}

.card-arrow {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--bg-soft);
  color: var(--text-muted);
  transition: all 0.3s ease;
}

.bento-card:hover .card-arrow {
  background: var(--accent-gold);
  color: var(--bg-deep);
  transform: translateX(3px);
}
</style>
