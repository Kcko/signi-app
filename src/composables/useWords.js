import randomWords from 'random-words'

export const generateWords = async (count = 10000) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            try {
                const wordsArray = randomWords(count)

                const wordsWithIds = wordsArray.map((word, index) => ({
                    id: index + 1,
                    text: index === 0 ? word.charAt(0).toUpperCase() + word.slice(1) : word,
                    createdAt: new Date().toISOString()
                }))

                resolve(wordsWithIds)
            } catch (error) {
                console.error(error)
                const fallbackWords = Array.from({ length: count }, (_, index) => ({
                    id: index + 1,
                    text: `Word ${index + 1}`,
                    createdAt: new Date().toISOString()
                }))
                resolve(fallbackWords)
            }
        }, 1000)
    })
}
