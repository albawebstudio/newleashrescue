import { computed, ref } from 'vue'
import type { ApplicationDownload, Img, OnlineApplications } from '~/models/types'

const fosterHomeIntroWithDownload =
  'You can apply online in a few guided steps, or download a printable application if you prefer. Opening your home to a dog allows them to finally exhale, trading uncertainty for the quiet magic of a morning snuggle.'
const fosterHomeIntroOnlineOnly =
  'You can apply online in a few guided steps. Opening your home to a dog allows them to finally exhale, trading uncertainty for the quiet magic of a morning snuggle.'

export interface Foster {
    h3:            string
    content:       string[]
    img:           Img
    featureBlocks: FosterBlock[]
}

export interface FosterBlock {
    h3:            string
    content:       string[]
    img:           Img
}

const baseFeatureBlocks: FosterBlock[] = [
        {
            "h3": "Unstoppable Hearts Fuel Our Mission",
            "content": [
                "Foster partners and volunteers form the vibrant heartbeat of New Leash Rescue. Because we operate without a paid staff, every dollar you donate goes directly toward the nourishment and healing of the animals in our rescue. You aren't just joining a team; you're becoming a vital anchor for a soul in transition."
            ],
            "img": {
                "src": "/images/foster-cat-and-dogs-unsplash.jpg",
                "alt": "Unstoppable Hearts Fuel Our Mission"
            }
        },
        {
            "h3": "Radiant Homes for Resilient Pups",
            "content": [fosterHomeIntroWithDownload],
            "img": {
                "src": "/images/foster-sunny-dogs-unsplash.jpg",
                "alt": "Radiant Homes for Resilient Pups"
            }
        },
        {
            "h3": "Spunky Personalities Await Your Match",
            "content": [
                "While we update our forms, don't miss the chance to browse the incredible dogs currently dreaming of their next chapter. Each one carries a unique spirit, from the quiet observers to the professional fetch-players ready for a sunny backyard. Every wagging tail represents a life transformed by the simple, powerful act of a human saying, \"I've got you.\""
            ],
            "img": {
                "src": "/images/foster-cat-green-eyes-unsplash.jpg",
                "alt": "Spunky Personalities Await Your Match"
            }
        },
        {
            "h3": "Bold Impact Through Selfless Service",
            "content": [
                "Our 100% volunteer-driven model means your hands-on help dictates how many lives we can change this year. Whether you're coordinating transport or offering a temporary suite in your home, you provide the bridge between an animal's past and their bright future. We invite you to bring your energy and compassion to a community that celebrates every small victory."
            ],
            "img": {
                "src": "/images/foster-foster-with-dog-unsplash.jpg",
                "alt": "Bold Impact Through Selfless Service"
            }
        }
]

export function useFosterData() {
    const applicationDownloadsEnabled = useApplicationDownloadsEnabled()
    const featureBlocks = computed<FosterBlock[]>(() => baseFeatureBlocks.map(block => {
        if (block.h3 !== 'Radiant Homes for Resilient Pups') return block
        return {
            ...block,
            content: [
                applicationDownloadsEnabled.value ? fosterHomeIntroWithDownload : fosterHomeIntroOnlineOnly,
            ],
        }
    }))
    const foster = ref<Foster>({
        "h3": "Unstoppable Hearts Fuel Our Mission",
        "content": [
            "Foster partners and volunteers form the vibrant heartbeat of New Leash Rescue. Because we operate without a paid staff, every dollar you donate goes directly toward the nourishment and healing of the animals in our care. You aren't just joining a team; you're becoming a vital anchor for a soul in transition."
        ],
        "img": {
            "src": "",
            "alt": ""
        },
        "featureBlocks": baseFeatureBlocks
    });
    const fosterApplication = ref<ApplicationDownload[]>([
        {
            href: "/files/NLR-Foster-Application-20260803.docx",
            filename: "NLR-Foster-Application.docx",
            title: "Download the New Leash Rescue foster application",
            cta: "Foster Application"
        },
    ]);
    const onlineApplications = ref<OnlineApplications[]>([
        {
            to: '/foster/apply',
            title: 'Apply online to foster with New Leash Rescue',
            cta: 'Apply to foster online',
            icon: 'i-material-symbols-edit-document-rounded',
            primary: true,
        },
    ])

    return {
        foster,
        featureBlocks,
        fosterApplication,
        onlineApplications,
    }
}
