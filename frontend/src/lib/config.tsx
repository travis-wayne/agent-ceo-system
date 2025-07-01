import { Icons } from "@/components/icons";

export const BLUR_FADE_DELAY = 0.15;

export const siteConfig = {
  name: "Sailsdock",
  description: "Sailsdock - Din partner innen vekst og markedsføring",
  cta: "Get Started",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  keywords: [
    "Sailsdock",
    "Sailsdock CRM",
    "Vekst og markedsføring",
    "Bedriftsvekst",
    "Markedsføring",
  ],
  links: {
    email: "support@sailsdock.no",
    twitter: "https://twitter.com/sailsdock",
    discord: "https://discord.gg/sailsdock",
    github: "https://github.com/sailsdock",
    instagram: "https://instagram.com/sailsdock",
  },
  faqs: [
    {
      question: "What is Sailsdock?",
      answer: "Sailsdock is a comprehensive CRM system designed to help businesses manage their growth and marketing efforts effectively."
    },
    {
      question: "How does the pricing work?",
      answer: "We offer flexible pricing plans to suit businesses of all sizes. Contact us for more details about our pricing structure."
    },
    {
      question: "Can I integrate with my existing tools?",
      answer: "Yes, Sailsdock supports integration with popular email providers like Google and Microsoft, as well as other business tools."
    },
    {
      question: "Is there customer support available?",
      answer: "Absolutely! We provide comprehensive customer support to help you get the most out of Sailsdock. Contact us at support@sailsdock.no"
    }
  ],
  footer: [
    {
      title: "Product",
      links: [
        { text: "Features", href: "#features" },
        { text: "Pricing", href: "#pricing" },
        { text: "FAQ", href: "#faq" },
        { text: "Documentation", href: "#docs" }
      ]
    },
    {
      title: "Company", 
      links: [
        { text: "About", href: "#about" },
        { text: "Contact", href: "#contact" },
        { text: "Blog", href: "#blog" },
        { text: "Careers", href: "#careers" }
      ]
    },
    {
      title: "Support",
    links: [
        { text: "Help Center", href: "#help" },
        { text: "Community", href: "#community" },
        { text: "Status", href: "#status" },
        { text: "API", href: "#api" }
      ]
    },
    {
      title: "Legal",
      links: [
        { text: "Privacy Policy", href: "#privacy" },
        { text: "Terms of Service", href: "#terms" },
        { text: "Cookie Policy", href: "#cookies" },
        { text: "Security", href: "#security" }
      ]
    }
  ]
};

export type SiteConfig = typeof siteConfig;
