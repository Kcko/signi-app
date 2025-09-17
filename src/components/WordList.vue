<template>
    <div class="bg-white rounded-lg shadow">
        <div class="p-4">
            <div v-if="props.isSearching && props.words.length === 0" class="text-center py-12">
                <p class="text-gray-600 text-lg">
                    Pardon, tohle slovo neznám <strong>"{{ props.searchQuery }}"</strong> 😔
                </p>
            </div>
            <div v-else class="words-container" ref="containerRef" @scroll="handleScroll">
                <div class="virtual-spacer" :style="{ height: `${offsetY}px` }"></div>
                <VueDraggable v-model="localDisplayedWords" class="words-list" :animation="200" ghost-class="ghost-item" chosen-class="chosen-item" drag-class="drag-item" @start="handleDragStart" @end="handleDragEnd" :disabled="isDragDisabled" :force-fallback="false">
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
    isSearching: {
        type: Boolean,
        default: false,
    },
    searchQuery: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['update-words', 'delete-word', 'edit-word', 'reorder-words']);

// Virtualizace
const containerRef = ref(null);
const itemHeight = 45; // Výška jedné položky
const visibleCount = ref(10); // Počet viditelných položek
const scrollTop = ref(0);

// Vypočítané hodnoty pro virtualizaci
const startIndex = computed(() => {
    const start = Math.floor(scrollTop.value / itemHeight);
    return Math.max(0, Math.min(start, props.words.length - visibleCount.value));
});
const endIndex = computed(() => Math.min(startIndex.value + visibleCount.value, props.words.length));
const displayedWords = computed(() => {
    const start = startIndex.value;
    const end = endIndex.value;
    return props.words.slice(start, end);
});

// Lokální kopie pro drag & drop
const localDisplayedWords = ref([]);
const isDragDisabled = computed(() => props.isSearching);

const offsetY = computed(() => startIndex.value * itemHeight);
const bottomSpacerHeight = computed(() => {
    const remaining = props.words.length - endIndex.value;
    return Math.max(0, remaining * itemHeight);
});

const handleScroll = event => {
    scrollTop.value = event.target.scrollTop;
};

const calculateVisibleCount = () => {
    if (containerRef.value) {
        const containerHeight = containerRef.value.clientHeight;
        visibleCount.value = Math.ceil(containerHeight / itemHeight) + 2; // +2 pro buffer
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
    document.body.classList.add('dragging');
    document.body.style.cursor = 'grabbing';
};

const handleDragEnd = event => {
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
</script>

<style scoped>
.words-container {
    max-height: calc(100vh - 350px);
    overflow-y: auto;
    position: relative;
}

.words-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
}

.word-item {
    min-height: 40px;
    cursor: grab;
}

.word-item:active {
    cursor: grabbing !important;
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

body.dragging {
    cursor: grabbing !important;
}

body.dragging * {
    cursor: grabbing !important;
}
</style>
