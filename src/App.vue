<template>
    <header class="bg-white shadow">
        <div class="flex flex-wrap justify-between items-center max-w-6xl mx-auto px-4 py-6">
            <div>
                <h1 class="text-3xl font-bold gradient-title">Signi Dictionary App</h1>
                <p class="text-gray-600 mt-2">v databázi je ~ {{ words.length }} slov</p>
            </div>
            <div>
                <img src="https://signi.com/wp-content/themes/signi/img/logo.svg" alt="" />
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

            <WordList v-else :words="filteredWords" :is-searching="!!debouncedSearch.trim()" :search-query="debouncedSearch" @update-words="updateWords" @delete-word="deleteWord" @edit-word="editWord" @reorder-words="reorderWords" />
        </main>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useLocalStorage, useDebounceFn } from '@vueuse/core';
import WordList from './components/WordList.vue';
import { generateWords } from './composables/useWords';

const loading = ref(true);
const newWord = ref('');
const searchQuery = ref('');
const debouncedSearch = ref('');

const debouncedSearchFn = useDebounceFn(value => {
    debouncedSearch.value = value;
}, 300);

const words = ref([]);
const wordsStorage = useLocalStorage('dictionary-words', []);

const debouncedSave = useDebounceFn(newWords => {
    wordsStorage.value = newWords;
}, 500);

const filteredWords = computed(() => {
    if (!debouncedSearch.value.trim()) return words.value;
    const query = debouncedSearch.value.toLowerCase();

    // Optimalizované vyhledávání s early exit
    const results = [];
    for (let i = 0; i < words.value.length; i++) {
        const word = words.value[i];
        if (word.text.toLowerCase().includes(query)) {
            results.push(word);
        }
        // Omezit počet výsledků pro lepší výkon
        if (results.length >= 1000) break;
    }
    return results;
});

const addWord = () => {
    const text = newWord.value.trim();
    if (!text) return;

    // Najít nejvyšší ID a přidat 1
    const maxId = words.value.length > 0 ? Math.max(...words.value.map(w => w.id)) : 0;

    const newWordObj = {
        id: maxId + 1,
        text,
        createdAt: new Date().toISOString(),
    };

    words.value.unshift(newWordObj);
    newWord.value = '';
};

const deleteWord = id => {
    const index = words.value.findIndex(word => word.id === id);
    if (index !== -1) {
        words.value.splice(index, 1);
    }
};

const editWord = (id, newText) => {
    const wordIndex = words.value.findIndex(word => word.id === id);
    if (wordIndex !== -1) {
        words.value[wordIndex].text = newText;
    }
};

const updateWords = newWords => {
    words.value = newWords;
    debouncedSave(newWords);
};

const reorderWords = ({ oldIndex, newIndex }) => {
    // Pokud je aktivní vyhledávání, nepřeřazujeme
    if (debouncedSearch.value.trim()) {
        console.warn('Drag & drop není možný při aktivním vyhledávání');
        return;
    }

    // Optimalizované přeřazení bez zbytečného kopírování
    const wordsCopy = [...words.value];
    const [movedWord] = wordsCopy.splice(oldIndex, 1);
    wordsCopy.splice(newIndex, 0, movedWord);

    words.value = wordsCopy;
    // Okamžité uložení pro drag & drop
    wordsStorage.value = wordsCopy;
};

watch(searchQuery, newValue => {
    debouncedSearchFn(newValue);
});

watch(
    words,
    newWords => {
        debouncedSave(newWords);
    },
    { deep: false }
);

onMounted(async () => {
    if (wordsStorage.value.length === 0) {
        try {
            const generatedWords = await generateWords(10000);
            words.value = generatedWords;
            wordsStorage.value = generatedWords;
        } catch (error) {
            console.error('Chyba při načítání slov:', error);
        }
    } else {
        words.value = [...wordsStorage.value];
    }
    loading.value = false;
});
</script>
