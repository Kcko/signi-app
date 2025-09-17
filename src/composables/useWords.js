import randomWords from 'random-words'

export const generateWords = (count = 10000) => {
    const wordsArray = randomWords(count)

    return wordsArray.map((word, index) => ({
        id: index + 1,
        text: index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
        createdAt: new Date().toISOString()
    }))
}
