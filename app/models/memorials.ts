export interface MemorialPet {
    id: string
    name: string
    ageAtPassing: string // e.g., "12 years" or "14 years old"
    yearsActive?: string // e.g., "2012 – 2026"
    description: string
    image: string
    imageAlt: string
    tributeBy?: string // e.g., "Loved by the Miller Family"
}
