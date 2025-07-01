import Features from "@/components/features-horizontal";
import { Section } from "@/components/section";
import { Bot, TrendingUp, Users, Zap } from "lucide-react";

const data = [
  {
    id: 1,
    title: "AI CEO Agent",
    content: "Strategic decision-making AI that manages operations and guides business growth.",
    image: "/dashboard.png",
    icon: <Bot className="h-6 w-6 text-primary" />,
  },
  {
    id: 2,
    title: "Sales & Marketing Automation",
    content: "Intelligent agents that generate leads, nurture prospects, and close deals automatically.",
    image: "/dashboard.png",
    icon: <TrendingUp className="h-6 w-6 text-primary" />,
  },
  {
    id: 3,
    title: "CRM Intelligence",
    content: "AI-powered customer relationship management with predictive insights and automated workflows.",
    image: "/dashboard.png",
    icon: <Users className="h-6 w-6 text-primary" />,
  },
  {
    id: 4,
    title: "Process Optimization",
    content: "Continuous business process analysis and optimization for maximum efficiency and growth.",
    image: "/dashboard.png",
    icon: <Zap className="h-6 w-6 text-primary" />,
  },
];

export default function Component() {
  return (
    <Section title="Agent CEO Features" subtitle="Complete AI Business Automation Platform">
      <Features collapseDelay={5000} linePosition="bottom" data={data} />
    </Section>
  );
}
