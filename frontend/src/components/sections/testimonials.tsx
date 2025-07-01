"use client";

import Marquee from "@/components/magicui/marquee";
import { Section } from "@/components/section";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Image from "next/image";

export const Highlight = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <span
      className={cn(
        "bg-primary/20 p-1 py-0.5 font-bold text-primary dark:bg-primary/20 dark:text-primary",
        className
      )}
    >
      {children}
    </span>
  );
};

export interface TestimonialCardProps {
  name: string;
  role: string;
  img?: string;
  description: React.ReactNode;
  className?: string;
  [key: string]: any;
}

export const TestimonialCard = ({
  description,
  name,
  img,
  role,
  className,
  ...props
}: TestimonialCardProps) => (
  <div
    className={cn(
      "mb-4 flex w-full cursor-pointer break-inside-avoid flex-col items-center justify-between gap-6 rounded-xl p-4",
      "border border-neutral-200 bg-white",
      "dark:bg-black dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]",
      className
    )}
    {...props}
  >
    <div className="select-none text-sm font-normal text-neutral-700 dark:text-neutral-400">
      {description}
      <div className="flex flex-row py-1">
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
        <Star className="size-4 text-yellow-500 fill-yellow-500" />
      </div>
    </div>

    <div className="flex w-full select-none items-center justify-start gap-5">
      <Image
        width={40}
        height={40}
        src={img || ""}
        alt={name}
        className="h-10 w-10 rounded-full ring-1 ring-border ring-offset-4"
      />

      <div>
        <p className="font-medium text-neutral-500">{name}</p>
        <p className="text-xs font-normal text-neutral-400">{role}</p>
      </div>
    </div>
  </div>
);

const testimonials = [
  {
    name: "Alexander Chen",
    role: "CEO at TechStart Solutions",
    img: "https://randomuser.me/api/portraits/men/91.jpg",
    description: (
      <p>
        Agent CEO&apos;s AI-powered strategic insights have revolutionized our business decision-making process.
        <Highlight>
          Our revenue increased by 40% in just 6 months with automated operations.
        </Highlight>{" "}
        A true game-changer for growing companies.
      </p>
    ),
  },
  {
    name: "Sarah Johnson",
    role: "Marketing Director at Scale Ventures",
    img: "https://randomuser.me/api/portraits/women/12.jpg",
    description: (
      <p>
        The AI sales agents from Agent CEO have transformed our lead generation completely.
        <Highlight>We&apos;re seeing 3x more qualified leads with 50% less manual work!</Highlight>{" "}
        Highly recommend their automation platform.
      </p>
    ),
  },
  {
    name: "Marcus Rodriguez",
    role: "Founder & CEO at Growth Labs",
    img: "https://randomuser.me/api/portraits/men/45.jpg",
    description: (
      <p>
        As a startup, we needed to move fast and stay competitive. Agent CEO&apos;s
        automated business processes help us do exactly that.
        <Highlight>Our operational efficiency has tripled in size.</Highlight> An
        essential tool for any scaling business.
      </p>
    ),
  },
  {
    name: "Lisa Wong",
    role: "Operations Manager at Digital Growth Co",
    img: "https://randomuser.me/api/portraits/women/83.jpg",
    description: (
      <p>
        Agent CEO&apos;s AI-driven customer relationship management has made global business
        expansion seamless for us.
        <Highlight>Customer satisfaction improved by 60% with automated support.</Highlight> A must-have
        for international business teams.
      </p>
    ),
  },
  {
    name: "David Kim",
    role: "Data Analyst at FinTech Innovations",
    img: "https://randomuser.me/api/portraits/men/1.jpg",
    description: (
      <p>
        Leveraging Agent CEO&apos;s AI for our financial analytics has given us a
        competitive edge in predictive accuracy.
        <Highlight>
          Our investment strategies are now powered by real-time AI insights.
        </Highlight>{" "}
        Transformative for the finance industry.
      </p>
    ),
  },
  {
    name: "Jennifer Martinez",
    role: "COO at Supply Chain Solutions",
    img: "https://randomuser.me/api/portraits/women/5.jpg",
    description: (
      <p>
        Agent CEO&apos;s workflow automation tools have drastically reduced our
        operational costs and improved efficiency.
        <Highlight>
          Supply chain management and logistics have never been more streamlined.
        </Highlight>{" "}
        Outstanding results across all departments.
      </p>
    ),
  },
  {
    name: "Robert Thompson",
    role: "CTO at EcoTech Ventures",
    img: "https://randomuser.me/api/portraits/men/14.jpg",
    description: (
      <p>
        By integrating Agent CEO&apos;s sustainable business intelligence, we&apos;ve seen a
        significant improvement in our environmental impact metrics.
        <Highlight>
          We&apos;re leading the industry in data-driven sustainability practices.
        </Highlight>{" "}
        Revolutionary change in business operations.
      </p>
    ),
  },
  {
    name: "Amanda Foster",
    role: "Marketing Manager at Fashion Forward",
    img: "https://randomuser.me/api/portraits/women/56.jpg",
    description: (
      <p>
        Agent CEO&apos;s market analysis AI has transformed how we approach customer
        segmentation and targeting.
        <Highlight>
          Our campaigns are now data-driven with 200% higher customer engagement.
        </Highlight>{" "}
        Revolutionizing digital marketing strategies.
      </p>
    ),
  },
  {
    name: "Michael Chang",
    role: "IT Director at HealthTech Solutions",
    img: "https://randomuser.me/api/portraits/men/18.jpg",
    description: (
      <p>
        Implementing Agent CEO in our patient management systems has
        significantly improved care coordination and operational workflows.
        <Highlight>Patient satisfaction scores increased by 45% with AI automation.</Highlight>{" "}
        Essential for modern healthcare operations.
      </p>
    ),
  },
  {
    name: "Emily Davis",
    role: "Director of Education at LearnTech",
    img: "https://randomuser.me/api/portraits/women/25.jpg",
    description: (
      <p>
        Agent CEO&apos;s AI-powered personalized business insights have doubled our
        strategic planning effectiveness and improved decision-making speed.
        <Highlight>Our business growth rate increased by 150% this quarter.</Highlight>{" "}
        Transforming how we approach business development.
      </p>
    ),
  },
  {
    name: "James Wilson",
    role: "Security Director at SecureTech",
    img: "https://randomuser.me/api/portraits/men/33.jpg",
    description: (
      <p>
        With Agent CEO&apos;s AI-powered security and risk management systems, our
        threat detection and response capabilities have never been stronger.
        <Highlight>Security incidents reduced by 80% with predictive monitoring.</Highlight>{" "}
        Critical for enterprise security operations.
      </p>
    ),
  },
  {
    name: "Rachel Green",
    role: "Creative Director at Design Studios",
    img: "https://randomuser.me/api/portraits/women/47.jpg",
    description: (
      <p>
        Agent CEO&apos;s AI has streamlined our creative workflow, enhanced project
        management, and improved client collaboration significantly.
        <Highlight>Project delivery time decreased by 40% with better quality control.</Highlight>{" "}
        Perfect for creative and design agencies.
      </p>
    ),
  },
  {
    name: "Kevin Park",
    role: "Investment Manager at Startup Accelerator",
    img: "https://randomuser.me/api/portraits/men/52.jpg",
    description: (
      <p>
        Agent CEO&apos;s insights into startup ecosystems and market trends have been
        invaluable for our investment portfolio management and due diligence.
        <Highlight>Our investment success rate improved by 65% using AI analytics.</Highlight>{" "}
        Game-changing for venture capital and investment firms.
      </p>
    ),
  },
];

export default function Testimonials() {
  return (
    <Section
      title="Customer Success Stories"
      subtitle="What our clients say about Agent CEO"
      className="max-w-8xl"
    >
      <div className="relative mt-6 max-h-screen overflow-hidden">
        <div className="gap-4 md:columns-2 xl:columns-3 2xl:columns-4">
          {Array(Math.ceil(testimonials.length / 3))
            .fill(0)
            .map((_, i) => (
              <Marquee
                vertical
                key={i}
                className={cn({
                  "[--duration:60s]": i === 1,
                  "[--duration:30s]": i === 2,
                  "[--duration:70s]": i === 3,
                })}
              >
                {testimonials.slice(i * 3, (i + 1) * 3).map((card, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: Math.random() * 0.8,
                      duration: 1.2,
                    }}
                  >
                    <TestimonialCard {...card} />
                  </motion.div>
                ))}
              </Marquee>
            ))}
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4 w-full bg-gradient-to-t from-background from-20%"></div>
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/4 w-full bg-gradient-to-b from-background from-20%"></div>
      </div>
    </Section>
  );
}
