<template>
  <div class="home-view">
    <section class="categories container">
      <div class="bento-grid">
        <BentoCard
          v-for="cat in categories"
          :key="cat.id"
          :title="cat.title"
          :description="cat.description"
          :icon="getIconForCategory(cat.id)"
          :count="cat.tools?.length || 0"
          :to="`/${cat.id}/${cat.tools?.[0]?.id}`"
          class="category-card"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import gsap from 'gsap'
import BentoCard from '../components/ui/BentoCard.vue'
import { store } from '../store/toolStore'
import {
  PhFilePdf, PhImage, PhTextT, PhCode,
  PhMegaphone, PhTrendUp, PhFirstAid, PhGameController, PhRobot,
  PhAirplaneTilt, PhGraduationCap
} from '@phosphor-icons/vue'

const categories = computed(() => store.categories || [])

const getIconForCategory = (id) => {
  const icons = {
    media:     PhFilePdf,
    design:    PhImage,
    text:      PhTextT,
    ai:        PhRobot,
    dev:       PhCode,
    marketing: PhMegaphone,
    finance:   PhTrendUp,
    lifestyle: PhFirstAid,
    fun:       PhGameController,
    travel:    PhAirplaneTilt,
    edu:       PhGraduationCap,
  }
  return icons[id] || PhTextT
}

onMounted(() => {
  gsap.fromTo('.category-card',
    { y: 24, opacity: 0 },
    { y: 0, opacity: 1, duration: 0.55, stagger: 0.07, ease: 'power2.out', delay: 0.1 }
  )
})
</script>

<style scoped>
.home-view {
  padding-top: calc(var(--nav-height) + 2.5rem);
  padding-bottom: 6rem;
}

.categories {
  padding: 0 2rem;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
}

@media (max-width: 1200px) {
  .bento-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 860px) {
  .bento-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 520px) {
  .bento-grid {
    grid-template-columns: 1fr;
  }
}
</style>
