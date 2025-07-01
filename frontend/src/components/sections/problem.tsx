import BlurFade from "@/components/magicui/blur-fade";
import { Section } from "@/components/section";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, FileText, Search, Bot } from "lucide-react";

const problems = [
  {
    title: "Manual Business Operations",
    description:
      "Companies waste countless hours on repetitive tasks and manual decision-making that could be automated, slowing growth and increasing costs.",
    icon: Clock,
  },
  {
    title: "Fragmented Business Intelligence",
    description:
      "Critical business data scattered across multiple platforms makes it difficult to get comprehensive insights and make informed strategic decisions.",
    icon: FileText,
  },
  {
    title: "Limited Strategic Capacity",
    description:
      "Business leaders are overwhelmed with operational tasks, leaving little time for strategic thinking and long-term planning.",
    icon: Search,
  },
];

export default function Component() {
  return (
    <Section
      title="Challenges in Traditional Business Management"
      subtitle="Why conventional approaches fall short"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {problems.map((problem, index) => (
          <BlurFade key={index} delay={0.2 + index * 0.2} inView>
            <Card className="bg-background border-none shadow-none">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <problem.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{problem.title}</h3>
                <p className="text-muted-foreground">{problem.description}</p>
              </CardContent>
            </Card>
          </BlurFade>
        ))}
      </div>
    </Section>
  );
}
