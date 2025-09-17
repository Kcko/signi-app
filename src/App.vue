<template>
    <header class="bg-white shadow">
        <div class="flex flex-wrap justify-between items-center max-w-6xl mx-auto px-4 py-6">
            <div>
                <img class="w-52" src="https://signi.com/wp-content/themes/signi/img/logo.svg" alt="" />
            </div>

            <div class="text-right">
                <h1 class="text-xl font-bold gradient-title">Signi Dictionary App</h1>
                <p class="text-gray-400 text-sm">v.1.0.0 ~ v databázi je ~ {{ words.length }} slov</p>
            </div>
        </div>
    </header>
    <div class="max-w-6xl mx-auto">
        <main class="mx-auto px-4 py-8">
            <div class="mb-6">
                <div class="flex gap-4 mb-4">
                    <input v-model="newWord" @keyup.enter="addWord" type="text" placeholder="Přidat nové slovo..." class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                    <button @click="addWord" :disabled="!newWord.trim()" class="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed">Přidat</button>
                </div>

                <div class="flex gap-4 items-center">
                    <input v-model="searchQuery" type="text" placeholder="Hledat slova..." class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" />
                </div>
            </div>

            <div v-if="loading" class="text-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p class="mt-4 text-gray-600">Načítání slov...</p>
            </div>

            <WordList v-else :words="filteredWords" :is-searching="!!debouncedSearch.trim()" :search-query="debouncedSearch" @update-words="updateWords" @delete-word="deleteWord" @edit-word="editWord" @save-drag-changes="saveDragChanges" />
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, shallowRef } from 'vue';
import { useLocalStorage, useDebounceFn } from '@vueuse/core';
import WordList from './components/WordList.vue';
import { generateWords } from './composables/useWords';

const loading = ref(true);
const newWord = ref('');
const searchQuery = ref('');
const debouncedSearch = ref('');

const debouncedSearchFn = useDebounceFn(value => {
    debouncedSearch.value = value;
}, 350);

const words = shallowRef([]);
const wordsStorage = useLocalStorage('dictionary-words', []);

const filteredWords = computed(() => {
    if (!debouncedSearch.value.trim()) return words.value;
    const query = debouncedSearch.value.toLowerCase();

    const results = [];
    for (let i = 0; i < words.value.length; i++) {
        const word = words.value[i];
        if (word.text.toLowerCase().includes(query)) {
            results.push(word);
        }
    }
    return results;
});

const addWord = () => {
    const text = newWord.value.trim();
    if (!text) return;

    const newWordObj = {
        id: Date.now() + Math.random(),
        text,
        createdAt: new Date().toISOString(),
    };

    words.value.unshift(newWordObj);
    wordsStorage.value = words.value;
    newWord.value = '';
};

const deleteWord = id => {
    const index = words.value.findIndex(word => word.id === id);
    if (index !== -1) {
        words.value.splice(index, 1);
        wordsStorage.value = words.value;
    }
};

const editWord = (id, newText) => {
    const wordIndex = words.value.findIndex(word => word.id === id);
    if (wordIndex !== -1) {
        words.value[wordIndex].text = newText;
        wordsStorage.value = words.value;
    }
};

const updateWords = newWords => {
    words.value = newWords;
};

const saveDragChanges = () => {
    if (window.requestIdleCallback) {
        requestIdleCallback(() => {
            wordsStorage.value = words.value;
        });
    } else {
        setTimeout(() => {
            wordsStorage.value = words.value;
        }, 0);
    }
};

watch(searchQuery, newValue => {
    debouncedSearchFn(newValue);
});

onMounted(() => {
    if (wordsStorage.value.length === 0) {
        const generatedWords = generateWords(10000);
        words.value = generatedWords;
        wordsStorage.value = generatedWords;
    } else {
        words.value = [...wordsStorage.value];
    }
    loading.value = false;
});
</script>
