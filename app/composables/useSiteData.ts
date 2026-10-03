import { ref, computed } from 'vue'
import type { Address, Link, Phone} from "~/models/types";

export interface Site {
    title:        string;
    legalName:    string;
    tagLine:      string;
    url:          string;
    created:      Date;
    address:      Address;
    phone:        Phone;
    emails:       Email[];
    links:        Link[];
    social_links: SocialLink[];
}


export interface Email {
    display_name: string;
    account:      string;
    domain:       string;
}

export interface SocialLink {
    label: string;
    icon: string;
    to: string;
}


export function useSiteData() {
    const { public: { siteUrl } } = useRuntimeConfig()

    const address = ref<Address> ({
        address1: "PO Box 486",
        address2: null,
        city: "Lindstrom",
        state: "MN",
        postcode: "55045",
        country: null
    });
    const emails = ref<Email[]> ([
        {
            display_name: "Adopt",
            account: "adopt",
            domain: "newleashrescue.org"
        },
        {
            display_name: "Privacy",
            account: "privacy",
            domain: "newleashrescue.org"
        }
    ])
    const phone = ref<Phone> ({
        raw: "+16512521874",
        formatted: "(651) 252-1874"
    })

    const links = ref<Link[]> ([
        {
            title: "Adopt",
            to: "/adopt",
            external: false,
            icon: null,
            displayText: "Adopt"
        },
        {
            title: "Foster",
            to: "/foster",
            external: false,
            icon: null,
            displayText: "Foster"
        },
        {
            title: "Events",
            to: "/events",
            external: false,
            icon: null,
            displayText: "Events"
        },
        {
            title: "Serve",
            to: "/volunteer",
            external: false,
            icon: null,
            displayText: "Serve"
        },
        {
            title: "contact us",
            to: "/contact",
            external: false,
            icon: null,
            displayText: "Contact"
        }
    ])

    const footer_links = ref<Link[]> ([
        {
            title: "About",
            to: "/about",
            external: true,
            icon: null,
            displayText: "About"
        },
        {
            title: "Friends",
            to: "/sponsors",
            external: false,
            icon: null,
            displayText: "Our Friends"
        },
        {
            title: "terms of use",
            to: "/legal/terms",
            external: false,
            icon: null,
            displayText: "Terms of Use"
        },
        {
            title: "privacy policy",
            to: "/legal/privacy",
            external: false,
            icon: null,
            displayText: "Privacy Policy"
        }
    ])
    const social_links = ref<SocialLink[]> ([
        {
            label: "Facebook",
            icon: "i-custom-facebook",
            to: "https://www.facebook.com/newleash2018/"
        },
        {
            label: "Instagram",
            icon: "i-custom-instagram",
            to: "https://instagram.com/newleashrescuemn/"
        },
        {
            label: "Tiktok",
            icon: "i-custom-tiktok",
            to: "https://www.tiktok.com/@newleashrescue"
        },
        {
            label: "GiveMN",
            icon: "i-material-symbols-volunteer-activism-rounded",
            to: "https://www.givemn.org/organization/New-Leash-Rescue"
        }
    ])
    const site = ref<Site>({
        title: "New Leash Rescue",
        legalName: "New Leash Rescue",
        tagLine: "giving dogs and cats a new leash on life",
        created: new Date(2016, 7, 1),
        url: siteUrl,
        address: address.value,
        phone: phone.value,
        emails: emails.value,
        links: links.value,
        social_links: social_links.value,
    });

    const getEmailByAccount = (account: string) => computed(() => {
        return emails.value.find(email => email.account === account) || null;
    });

    return {
        address,
        emails,
        phone,
        links,
        footer_links,
        social_links,
        site,
        getEmailByAccount,
    }
}
