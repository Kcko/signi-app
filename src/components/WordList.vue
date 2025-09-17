<template>
    <div class="bg-white rounded-lg shadow">
        <div class="p-4">
            <div v-if="props.isSearching && props.words.length === 0" class="text-center py-12">
                <p class="text-gray-600 text-lg">
                    Pardon, tohle slovo neznám <strong>"{{ props.searchQuery }}"</strong> 😔
                </p>
            </div>
            <div v-else class="words-container">
                <VirtualList v-model="localWords" :dataKey="'id'" :handle="'.drag-handle'" :disabled="isDragDisabled" class="virtual-list" style="height: 100%" @drop="handleDrop">
                    <template v-slot:item="{ record, index, dataKey }">
                        <div class="word-item">
                            <WordItem :word="record" @delete="handleDelete(record.id)" @edit="handleEdit(record.id, $event)" />
                        </div>
                    </template>
                </VirtualList>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import VirtualList from 'vue-virtual-sortable';
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

const emit = defineEmits(['update-words', 'delete-word', 'edit-word', 'save-drag-changes']);

const isDragDisabled = computed(() => props.isSearching);

const localWords = computed({
    get() {
        return props.words;
    },
    set(val) {
        if (isDragDisabled.value) return;
        emit('update-words', val);
    },
});

const handleDelete = id => {
    emit('delete-word', id);
};

const handleEdit = (id, newText) => {
    emit('edit-word', id, newText);
};

const handleDrop = () => {
    emit('save-drag-changes');
};
</script>

<style scoped>
.words-container {
    height: calc(100vh - 350px);
    position: relative;
}

.virtual-list {
    height: 100%;
    width: 100%;
}

.virtual-item {
    padding: 4px 2px;
    box-sizing: border-box;
}

.word-item {
    margin-bottom: 8px;
}

.drag-handle {
    cursor: grab;
}

.drag-handle:active {
    cursor: grabbing !important;
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

body.dragging {
    cursor: grabbing !important;
}

body.dragging * {
    cursor: grabbing !important;
}
</style>
