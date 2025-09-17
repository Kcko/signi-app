<template>
    <div class="bg-gray-50 border border-gray-200 rounded-lg px-5 py-1 word-item group">
        <div v-if="!isEditing" class="flex items-center justify-between">
            <div class="flex-1 mr-6">
                <span class="text-gray-800 font-medium truncate block">{{ word.text }}</span>
                <!-- <span class="text-gray-400 text-xs">id: {{ word.id }}</span> -->
            </div>
            <div class="flex gap-4 opacity-0 group-hover:opacity-100">
                <button class="drag-handle text-gray-500 hover:text-gray-700 p-1 rounded cursor-grab" title="Přesunout">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                    </svg>
                </button>
                <button @click="startEdit" class="text-blue-600 hover:text-blue-800 p-1 rounded" title="Upravit">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                </button>
                <button @click="handleDelete" class="text-red-600 hover:text-red-800 p-1 rounded" title="Smazat">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                </button>
            </div>
        </div>

        <div v-else class="flex gap-2">
            <input ref="editInput" v-model="editText" @keyup.enter="saveEdit" @keyup.escape="cancelEdit" @blur="saveEdit" class="flex-1 px-2 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            <button @click="saveEdit" class="text-green-600 hover:text-green-800 p-1 rounded" title="Uložit">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
            </button>
            <button @click="cancelEdit" class="text-gray-600 hover:text-gray-800 p-1 rounded" title="Zrušit">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

const props = defineProps({
    word: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['delete', 'edit']);

const isEditing = ref(false);
const editText = ref('');
const editInput = ref(null);

const startEdit = async () => {
    isEditing.value = true;
    editText.value = props.word.text;
    await nextTick();
    editInput.value?.focus();
};

const saveEdit = () => {
    if (editText.value.trim() && editText.value.trim() !== props.word.text) {
        emit('edit', editText.value.trim());
    }
    isEditing.value = false;
};

const cancelEdit = () => {
    isEditing.value = false;
    editText.value = '';
};

const handleDelete = () => {
    emit('delete');
};
</script>

<style scoped>
.word-item {
    min-height: 40px;
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
}

/* Lepší responsivní design pro grid */
.word-item .bg-gray-50 {
    width: 100%;
}
</style>
