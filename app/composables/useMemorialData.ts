import { ref } from 'vue'
import type { MemorialPet } from '~/models/memorials'

export function useMemorialData() {
    // Sample data structure - swap with content collection, Nuxt Content, or API fetch
    const pets = ref<MemorialPet[]>([
        {
            id: '1',
            name: 'Belle',
            ageAtPassing: '11 years',
            yearsActive: '2015 – 2026',
            description: 'Bossy, protective, and fiercely loyal. Belle was the "branch manager" of the home office. She enjoyed any place with water and playing soccer with her jolly ball.',
            image: '/images/memorials/belle.jpg',
            imageAlt: 'GSD Belle enjoying the outdoors',
            tributeBy: 'Loved & missed by the Alba Family'
        },
        {
            id: '2',
            name: 'Mochi',
            ageAtPassing: '12 years',
            yearsActive: '2014 – 2026',
            description: 'Queen of the couch and master mouse-hunter. Luna spent her golden years making sure everyone in the house stayed cuddled.',
            image: '/images/memorials/mochi.jpg',
            imageAlt: 'Mochi hits the beach',
            tributeBy: 'Forever in our hearts'
        }
    ])

    return {
        pets,
    }
}
