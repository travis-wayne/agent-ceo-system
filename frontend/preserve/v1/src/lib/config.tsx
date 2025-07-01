import { Icons } from "@/components/icons";

export const BLUR_FADE_DELAY = 0.15;

export const siteConfig = {
  name: "Agent CEO",
  description: "AI-Powered Business Automation Platform",
  cta: "Get Started",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  keywords: [
    "Agent CEO",
    "AI Automation",
    "Business AI",
    "AI Agents",
    "Strategic AI",
    "Business Automation",
  ],
  links: {
    email: "support@agentceo.com",
    twitter: "https://twitter.com/agentceo",
    discord: "https://discord.gg/agentceo",
    github: "https://github.com/agentceo",
    instagram: "https://instagram.com/agentceo",
  },
  faqs: [
    {
      question: "What is Agent CEO?",
      answer: "Agent CEO is an AI-powered business automation platform that deploys specialized AI agents to handle sales, marketing, operations, and strategic decision-making for your business."
    },
    {
      question: "How do AI agents work?",
      answer: "Our AI agents are trained on specific business functions and can autonomously perform tasks, analyze data, generate insights, and execute workflows to optimize your business operations."
    },
    {
      question: "What types of agents are available?",
      answer: "We offer CEO, Sales, Marketing, Operations, Analytics, and Support agents, each specialized for different business functions and capable of working together as a team."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use enterprise-grade security measures including encryption, secure data storage, and compliance with industry standards to protect your business data."
    },
    {
      question: "How much time can I save?",
      answer: "Our users typically save 15+ hours per week through AI automation, with some businesses seeing up to 300% productivity improvements."
    },
    {
      question: "Do I need technical knowledge?",
      answer: "No technical knowledge required! Our platform is designed for business users with an intuitive interface and guided setup process."
    }
  ],
  footer: [
    {
      title: "Product",
      links: [
        { text: "AI Agents", href: "/dashboard/ceo/agents" },
        { text: "Strategic Intelligence", href: "/dashboard/ceo/strategic" },
        { text: "Task Automation", href: "/dashboard/ceo/tasks" },
        { text: "Email Automation", href: "/dashboard/ceo/email" },
        { text: "Data Analytics", href: "/dashboard/ceo/data" }
      ]
    },
    {
      title: "Business Tools",
      links: [
        { text: "CRM", href: "/dashboard/crm" },
        { text: "Lead Management", href: "/dashboard/crm/leads" },
        { text: "Customer Management", href: "/dashboard/crm/customers" },
        { text: "Business Accounts", href: "/dashboard/crm/businesses" },
        { text: "Support Tickets", href: "/dashboard/crm/tickets" }
      ]
    },
    {
      title: "Company",
      links: [
        { text: "About", href: "/about" },
        { text: "Blog", href: "/blog" },
        { text: "Careers", href: "/careers" },
        { text: "Contact", href: "/contact" }
      ]
    },
    {
      title: "Support",
      links: [
        { text: "Help Center", href: "/help" },
        { text: "Documentation", href: "/docs" },
        { text: "API Reference", href: "/api" },
        { text: "Status", href: "/status" }
      ]
    }
  ]
};

export type SiteConfig = typeof siteConfig;
