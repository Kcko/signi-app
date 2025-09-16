<template>
    <div class="bg-white rounded-lg shadow">
        <div class="p-4 border-b border-gray-200">
            <h2 class="text-lg font-semibold text-gray-900">Slovník ({{ words.length }} slov)</h2>
            <p class="text-sm text-gray-600 mt-1">
                <span v-if="words.length === totalWordsCount"> Zobrazeno všech {{ words.length }} slov • Viděli jste {{ seenWordsCount }} slov </span>
                <span v-else> Nalezeno {{ words.length }} z {{ totalWordsCount }} slov • Viděli jste {{ seenWordsCount }} slov </span>
            </p>
        </div>

        <div class="p-4">
            <div class="words-container" ref="containerRef" @scroll="handleScroll">
                <div class="virtual-spacer" :style="{ height: `${offsetY}px` }"></div>
                <VueDraggable v-model="localDisplayedWords" class="words-grid" :animation="0" ghost-class="ghost-item" chosen-class="chosen-item" drag-class="drag-item" @start="handleDragStart" @end="handleDragEnd" :disabled="isDragDisabled" :force-fallback="false" :set-data="() => {}">
                    <div v-for="word in localDisplayedWords" :key="word.id" class="word-item">
                        <WordItem :word="word" @delete="handleDelete(word.id)" @edit="handleEdit(word.id, $event)" />
                    </div>
                </VueDraggable>
                <div class="virtual-spacer" :style="{ height: `${bottomSpacerHeight}px` }"></div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref, onMounted, nextTick, watch } from 'vue';
import { VueDraggable } from 'vue-draggable-plus';
import WordItem from './WordItem.vue';

const props = defineProps({
    words: {
        type: Array,
        required: true,
    },
    totalWordsCount: {
        type: Number,
        required: true,
    },
});

const emit = defineEmits(['update-words', 'delete-word', 'edit-word', 'reorder-words']);

// Virtualizace
const containerRef = ref(null);
const itemHeight = 96; // Výška jedné řady v gridu včetně mezery
const columnsCount = ref(3); // Počet sloupců (bude se dynamicky upravovat)
const visibleRows = ref(8); // Počet viditelných řad
const scrollTop = ref(0);

// Vypočítané hodnoty pro virtualizaci s gridem
const startRowIndex = computed(() => Math.floor(scrollTop.value / itemHeight));
const endRowIndex = computed(() => startRowIndex.value + visibleRows.value);
const startIndex = computed(() => startRowIndex.value * columnsCount.value);
const endIndex = computed(() => Math.min(endRowIndex.value * columnsCount.value, props.words.length));
const displayedWords = computed(() => props.words.slice(startIndex.value, endIndex.value));

// Lokální kopie pro drag & drop
const localDisplayedWords = ref([]);
const isDragDisabled = computed(() => false); // Drag je vždy povolený díky virtualizaci

// Sledování viděných slov
const maxSeenIndex = ref(0);
const seenWordsCount = computed(() => Math.min(maxSeenIndex.value + 1, props.words.length));
const offsetY = computed(() => startRowIndex.value * itemHeight);
const totalRows = computed(() => Math.ceil(props.words.length / columnsCount.value));
const bottomSpacerHeight = computed(() => Math.max(0, (totalRows.value - endRowIndex.value) * itemHeight));

const handleScroll = event => {
    scrollTop.value = event.target.scrollTop;

    // Aktualizovat počet viděných slov
    const currentMaxIndex = endIndex.value - 1;
    if (currentMaxIndex > maxSeenIndex.value) {
        maxSeenIndex.value = currentMaxIndex;
    }
};

const calculateVisibleCount = () => {
    if (containerRef.value) {
        const containerHeight = containerRef.value.clientHeight;
        const containerWidth = containerRef.value.clientWidth;

        // Dynamicky určit počet sloupců podle šířky
        if (containerWidth >= 1280) {
            columnsCount.value = 4;
        } else if (containerWidth >= 1024) {
            columnsCount.value = 3;
        } else if (containerWidth >= 768) {
            columnsCount.value = 2;
        } else {
            columnsCount.value = 1;
        }

        visibleRows.value = Math.ceil(containerHeight / itemHeight) + 2; // +2 pro buffer
    }
};

onMounted(async () => {
    await nextTick();
    calculateVisibleCount();
    window.addEventListener('resize', calculateVisibleCount);
});

const handleDelete = id => {
    emit('delete-word', id);
};

const handleEdit = (id, newText) => {
    emit('edit-word', id, newText);
};

const handleDragStart = () => {
    // Přidat třídu pro globální cursor
    document.body.classList.add('dragging');
    document.body.style.cursor = 'grabbing';
};

const handleDragEnd = event => {
    // Odstranit třídu pro globální cursor
    document.body.classList.remove('dragging');
    document.body.style.cursor = '';

    if (isDragDisabled.value) return;

    // Převést lokální změny zpět na globální indexy
    const globalStartIndex = startIndex.value;
    const oldIndex = globalStartIndex + event.oldIndex;
    const newIndex = globalStartIndex + event.newIndex;

    if (oldIndex !== newIndex) {
        emit('reorder-words', { oldIndex, newIndex });
    }
};

// Synchronizace s props
watch(
    displayedWords,
    newWords => {
        localDisplayedWords.value = [...newWords];
    },
    { immediate: true }
);

// Reset počítadla při změně seznamu slov
watch(
    () => props.words,
    () => {
        maxSeenIndex.value = Math.min(endIndex.value - 1, props.words.length - 1);
    },
    { immediate: true }
);
</script>

<style scoped>
.words-container {
    max-height: calc(100vh - 300px);
    overflow-y: auto;
    position: relative;
}

.words-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
    padding: 8px;
}

/* Responsivní grid pro různé velikosti obrazovky */
@media (min-width: 768px) {
    .words-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .words-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

@media (min-width: 1280px) {
    .words-grid {
        grid-template-columns: repeat(4, 1fr);
    }
}

.word-item {
    min-height: 80px;
}

.virtual-spacer {
    width: 100%;
    pointer-events: none;
}

/* Drag & Drop styly */
.ghost-item {
    opacity: 0.5;
    background: #e3f2fd;
    border: 2px dashed #2196f3 !important;
    border-radius: 8px !important;
    box-sizing: border-box;
}

.chosen-item {
    cursor: grabbing !important;
    border: 2px solid #1976d2 !important;
    border-radius: 8px !important;
    box-sizing: border-box;
    z-index: 1000;
    position: relative;
}

.drag-item {
    opacity: 0.8;
    border: 2px solid #3b82f6 !important;
    border-radius: 8px !important;
    box-sizing: border-box;
    cursor: grabbing !important;
    z-index: 1001;
    position: relative;
}

/* Cursor styly pro drag */
.words-grid .word-item {
    cursor: grab;
}

.words-grid .word-item:active {
    cursor: grabbing !important;
}

.words-grid[data-disabled='true'] .word-item {
    cursor: default;
}

/* Jednoduché cursor pravidla */
.words-grid .word-item:active {
    cursor: grabbing !important;
}

body.dragging {
    cursor: grabbing !important;
}

body.dragging * {
    cursor: grabbing !important;
}
</style>
