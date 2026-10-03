import { ref } from 'vue'

import type { ApplicationDownload, Img, OnlineApplications } from '~/models/types'

export interface Adopt {
    content: string[]
}

export interface AdoptPolicy {
    h2:            string
    content:       string[]
    img:           Img
    featureBlocks: FeatureBlock[]
}

export interface FeatureBlock {
    h3:      string
    icon:    string
    content: string[]
}

export function useAdoptData() {
    const adopt = ref<Adopt>({
        content: [
            'New Leash Rescue hold adoptions on Saturdays at various PetSmart locations around the twin cities area. There are also many other events and fundraisers that we hold each year - please follow us on Facebook to learn more.',
            'Learn more about our <a href="#adoption-policy" class="underline underline-offset-2 text-primary hover:text-primary-600">Adoption Policy</a>'
        ],
    })
    const featureBlocks = ref<FeatureBlock[]>([
        {
            h3: 'Vibrant Health and Safe Spaces',
            icon: 'i-material-symbols-health-and-safety-rounded',
            content: [
                'We believe a healthy community starts at home, so we require all current pets in your household to be spayed or neutered and up to date on vaccinations. Our residents thrive as indoor companions, enjoying the comfort and safety of life right by your side. For our high-energy athletes, we look for a secure yard or a dedicated partner ready for daily adventures and long walks.',
            ],
        },
        {
            h3: 'Radiant Kids and Playful Pups',
            icon: 'i-material-symbols-account-child-invert-rounded',
            content: [
                'To keep everyone smiling, we typically match dogs with families where children are at least 5 years old and ready to learn the language of play. Smaller spirits under 15 lbs usually require companions aged 10 and up to ensure every interaction is gentle and secure. Seeing a child and a dog grow to understand each other’s boundaries is a beautiful masterclass in empathy and friendship.',
            ],
        },
        {
            h3: 'Growing Together with Wisdom',
            icon: 'i-material-symbols-potted-plant-rounded',
            content: [
                'We want every first-time experience to be a win, so we match our tiny puppies with those who have navigated the joys of dog guardianship before. Since our goal is a deep, personal connection, we don\'t place our residents into commercial daycare environments. We look for partners who want to be the primary source of love and leadership in their pet\'s new life.',
            ],
        },
        {
            h3: 'Stable Roots for Strong Bonds',
            icon: 'i-material-symbols-source-environment-rounded',
            content: [
                'If you rent your home, we ask for a two-year history in your current space and previous experience caring for pets as an adult. We focus on matching large dogs or tiny puppies with stable environments that allow them to truly blossom without the stress of frequent moves. A home is more than a building; it\'s the sanctuary where an animal finally lets their guard down and shows their true colors.',
            ],
        }
    ])
    const adoptPolicy = ref<AdoptPolicy>({
        h2: 'Perfect Matches and Bold New Chapters',
        content: [
            'All animals living in the household must be spayed or neutered and up to date on vaccinations. Pets must show good history of annual exams, vaccinations, and other care as recommended by the veterinarian. Dogs and cats are being adopted as indoor pets only. Some pets may require a fenced in yard or require placement with another dog or cat. Specific needs will be listed in each animals bio.',
            'Finding the right rhythm between a resilient animal and a new family is our favorite kind of magic. We’ve designed our adoption process to ensure every transition is a smooth, joyful success for both ends of the leash. These guidelines help us honor the unique spirit of every dog and cat in our care.',
        ],
        img: {
            src: '/images/adopt-policy-unsplash.jpg',
            alt: 'Adopt Policy',
        },
        featureBlocks: featureBlocks.value
    })
    const onlineApplications = ref<OnlineApplications[]>([
        {
            to: '/adopt/dog',
            title: 'Complete the New Leash Rescue dog adoption application',
            icon: 'i-material-symbols-sound-detection-dog-barking-rounded',
            cta: 'Apply to Adopt a Dog',
            primary: true,
        },
        {
            to: '/adopt/cat',
            title: 'Complete the New Leash Rescue cat adoption application',
            icon: 'i-material-symbols-pets-rounded',
            cta: 'Apply to Adopt a Cat',
            primary: true,
        },
    ])
    const adoptionApplicationDownloads = ref<ApplicationDownload[]>([
        {
            href: '/files/NLR-Dog-Adoption-Application-20260803.docx',
            filename: 'NLR-Dog-Adoption-Application.docx',
            title: 'Download the New Leash Rescue dog adoption application',
            cta: 'Dog Adoption Application',
        },
        {
            href: '/files/NLR-Cat-Adoption-Application-20260803.docx',
            filename: 'NLR-Cat-Adoption-Application.docx',
            title: 'Download the New Leash Rescue cat adoption application',
            cta: 'Cat Adoption Application',
        },
    ])
    return {
        adopt,
        adoptPolicy,
        onlineApplications,
        adoptionApplicationDownloads,
    }
}
