import { ref } from 'vue'
import type { Img, OnlineApplications } from '~/models/types'

export interface Volunteer {
    h3:            string
    content:       string[]
    img:           Img
    featureBlocks: VolunteerBlock[]
}

export interface VolunteerBlock {
    h3:            string
    content:       string[]
    img:           Img
}

export interface VolunteerApplicationDownload {
    href:          string
    filename:      string
    title:         string
    cta:           string
}

export interface VolunteerRole {
    title:       string
    description: string
    icon:        string
}

export interface VolunteerRolesSection {
    title: string
    intro: string
    roles: VolunteerRole[]
}

export function useVolunteerData() {
    const featureBlocks = ref<VolunteerBlock[]>([
        {
            h3: 'Join Our Volunteer Team',
            content: [
                'At New Leash Rescue, we are 100% volunteer-powered. From providing medical care and loving foster homes to finding forever families, every second chance we offer is made possible by your support.',
                'Whether you have a few hours a month or want to take on a regular role, your time and talents directly transform the lives of rescue dogs and cats in need.',
            ],
            img: {
                src: '/images/foster-foster-with-dog-unsplash.jpg',
                alt: 'Volunteer caring for a rescue dog',
            },
        },
        {
            h3: 'Ready to Make a Difference?',
            content: [
                "No matter how you choose to help, you'll be part of a passionate, welcoming community dedicated to giving every animal a brand-new start.",
            ],
            img: {
                src: '/images/foster-sunny-dogs-unsplash.jpg',
                alt: 'Happy dogs ready for adoption events',
            },
        },
    ])

    const volunteerRolesSection = ref<VolunteerRolesSection>({
        title: 'How You Can Help',
        intro: 'We have flexible, short-term and long-term volunteer roles to match your schedule, skills, and interests:',
        roles: [
            {
                title: 'Adoption Event Support',
                description: 'Help manage logistics, greet visitors, and guide prospective families at local adoption events (must be 18+).',
                icon: 'i-material-symbols-event-rounded',
            },
            {
                title: 'Community & Special Events',
                description: 'Represent New Leash Rescue at community expos, local county fairs, and the Minnesota State Fair!',
                icon: 'i-material-symbols-festival-rounded',
            },
            {
                title: 'Creative & Digital Media',
                description: 'Put your skills in photo editing, website maintenance, graphic design, or content creation to work showcasing our rescue pets and story.',
                icon: 'i-material-symbols-design-services-rounded',
            },
            {
                title: 'Fundraising & Outreach',
                description: 'Help organize fundraising campaigns, connect with local business sponsors, and support community outreach initiatives.',
                icon: 'i-material-symbols-volunteer-activism-rounded',
            },
            {
                title: 'Administrative & Communications',
                description: 'Assist behind the scenes with phone calls, volunteer coordination, newsletters, mailings, and administrative tasks.',
                icon: 'i-material-symbols-support-agent-rounded',
            },
        ],
    })

    const volunteer = ref<Volunteer>({
        h3: 'Join Our Volunteer Team',
        content: featureBlocks.value[0]?.content ?? [],
        img: featureBlocks.value[0]?.img ?? { src: '', alt: '' },
        featureBlocks: featureBlocks.value,
    })

    const volunteerApplication = ref<VolunteerApplicationDownload[]>([
        {
            href: '/files/NLR-Volunteer-Application-20260803.docx',
            filename: 'NLR-Volunteer-Application.docx',
            title: 'Download the New Leash Rescue volunteer application',
            cta: 'Volunteer Application',
        },
    ])

    const onlineApplications = ref<OnlineApplications[]>([
        {
            to: '/volunteer/apply',
            title: 'Apply online to volunteer with New Leash Rescue',
            cta: 'Fill Out a Volunteer Application',
            icon: 'i-material-symbols-edit-document-rounded',
            primary: true,
        },
    ])

    const volunteerContactEmail = ref('adopt@newleashrescue.org')

    return {
        volunteer,
        featureBlocks,
        volunteerRolesSection,
        volunteerApplication,
        onlineApplications,
        volunteerContactEmail,
    }
}
