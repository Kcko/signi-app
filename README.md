# Signi Dictionary - Osobní Slovník

Single-page aplikace ve Vue 3 s Tailwind CSS 4 pro správu osobního slovníku s 10 000+ slovy.

## 🚀 Funkce

-   **10 000+ slov**: Automatické načtení dummy slov s vysokou výkonností
-   **CRUD operace**: Přidávání, editace a mazání slov
-   **Drag & Drop**: Přetahování slov pro změnu pořadí
-   **Persistentní úložiště**: Pořadí slov se ukládá do localStorage
-   **Vyhledávání**: Rychlé filtrování slov
-   **Responzivní design**: Optimalizováno pro všechna zařízení

## 🛠 Technologie

-   **Vue 3** (Composition API, script setup)
-   **Tailwind 3** -
-   **Vite** (build tool)
-   **VueDraggable** (drag & drop funkcionalita)
-   **VueUse** (utility composables)
-   **random-words** (generování dummy slov)

## 📦 Instalace a spuštění

### Požadavky

-   Node.js 16+
-   npm nebo yarn

### Kroky

1. Klonování repozitáře:

```bash
git clone <repository-url>
cd signi-dictionary
```

2. Instalace závislostí:

```bash
npm install
```

3. Spuštění vývojového serveru:

```bash
npm run dev
```

4. Otevření v prohlížeči:

```
http://localhost:5173
```

## 🏗 Build pro produkci

```bash
npm run build
npm run preview
```

## 🎯 Použití

1. **Načítání slov**: Při prvním spuštění se automaticky načte 10 000 dummy slov
2. **Přidání slova**: Zadejte nové slovo do vstupního pole a stiskněte Enter nebo klikněte na "Přidat"
3. **Editace slova**: Klikněte na ikonu tužky u slova, upravte text a stiskněte Enter
4. **Mazání slova**: Klikněte na ikonu koše u slova
5. **Přetahování**: Přetáhněte slova pro změnu jejich pořadí
6. **Vyhledávání**: Použijte vyhledávací pole pro filtrování slov
7. **Zamíchání**: Klikněte na "Zamíchat" pro náhodné seřazení
8. **Reset**: Klikněte na "Reset" pro obnovení původního pořadí

## 📁 Struktura projektu

```
src/
├── components/
│   ├── WordList.vue      # Hlavní seznam slov s drag & drop
│   └── WordItem.vue      # Jednotlivé slovo s edit/delete funkcemi
├── composables/
│   └── useWords.js       # Generování a správa slov
├── App.vue               # Hlavní komponenta aplikace
├── main.js              # Entry point
└── style.css            # Tailwind CSS importy
```

## ⚡ Optimalizace výkonu

-   **Grid layout**: Efektivní zobrazení velkého množství slov
-   **Computed properties**: Optimalizované filtrování
-   **LocalStorage**: Rychlé ukládání a načítání pořadí
-   **Debounced search**: Plynulé vyhledávání bez lagů

## 🧪 Testování

```bash
# Unit testy
npm run test:unit

# E2E testy
npm run test:e2e
```

## 📊 Časová náročnost

**Celkový čas vývoje: ~4-5 hodin**

-   Nastavení projektu a závislostí: 30 min
-   Implementace základní struktury: 1 hodina
-   CRUD operace a state management: 1.5 hodiny
-   Drag & drop funkcionalita: 1 hodina
-   Styling a UX optimalizace: 45 min
-   Testování a dokumentace: 30 min

## 🔧 Skriptovací příkazy

```bash
npm run dev          # Vývojový server
npm run build        # Build pro produkci
npm run preview      # Preview produkčního buildu
npm run lint         # ESLint kontrola
npm run test:unit    # Unit testy
npm run test:e2e     # E2E testy
```

## 💡 Poznámky k implementaci

-   Aplikace je optimalizována pro práci s velkým množstvím dat (10k+ slov)
-   Používá se Vue 3 Composition API s `<script setup>` syntaxí
-   Tailwind CSS 4 (alpha) pro moderní styling
-   LocalStorage pro persistenci dat bez nutnosti backend API
-   Responzivní grid layout pro různé velikosti obrazovek

## 🐛 Známé limitace

-   Tailwind CSS 4 je stále v alpha verzi
-   Maximální počet slov je omezen výkonem prohlížeče
-   Drag & drop nefunguje na touch zařízeních optimálně

## 📄 Licence

MIT License
