import { reactive, computed } from 'vue'
import toolsData from '../data/tools.json'

export const store = reactive({
  categories: toolsData.categories,
  searchQuery: '',
  isSearchOpen: false,
  
  // Computed list of all tools flattened
  allTools: computed(() => {
    return store.categories.flatMap(cat => 
      cat.tools.map(tool => ({
        ...tool,
        categoryTitle: cat.title,
        categoryId: cat.id
      }))
    )
  }),

  // Filtered tools based on search query
  filteredTools: computed(() => {
    if (!store.searchQuery) return []
    const q = store.searchQuery.toLowerCase()
    return store.allTools.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.description.toLowerCase().includes(q) ||
      t.categoryTitle.toLowerCase().includes(q)
    )
  }),

  openSearch() {
    store.isSearchOpen = true
  },
  
  closeSearch() {
    store.isSearchOpen = false
    store.searchQuery = ''
  },

  toggleSearch() {
    if (store.isSearchOpen) store.closeSearch()
    else store.openSearch()
  }
})
