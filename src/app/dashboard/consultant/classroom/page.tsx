import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock } from "lucide-react";
import Link from "next/link";

const modules = [
  {
    id: 1,
    title: "Understanding AI For Business",
    description: "Learn the fundamentals of AI and how to explain it to clients.",
  },
  {
    id: 2,
    title: "Finding Businesses",
    description: "Strategies for finding and researching potential clients.",
  },
  {
    id: 3,
    title: "Booking Discovery Calls",
    description: "How to get meetings with business owners.",
  },
  {
    id: 4,
    title: "Running AI Reports",
    description: "Guide to using the AI Report tool effectively.",
  },
  {
    id: 5,
    title: "Presenting Reports",
    description: "How to present findings and build confidence.",
  },
  {
    id: 6,
    title: "Handling Objections",
    description: "Common objections and how to respond.",
  },
  {
    id: 7,
    title: "Closing Clients",
    description: "Techniques to close deals and get commitments.",
  },
  {
    id: 8,
    title: "Growing Your Consulting Business",
    description: "Strategies for scaling and long-term success.",
  },
];

export default function ClassroomPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Classroom</h1>
        <p className="text-muted-foreground mt-1">Learn to build your AI consulting business</p>
      </div>

      {/* Progress */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Learning Progress</p>
              <p className="text-xs text-muted-foreground mt-1">0 of 8 lessons completed</p>
            </div>
            <div className="text-2xl font-bold text-ploy-blue">0%</div>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-ploy-blue" style={{ width: "0%" }}></div>
          </div>
        </div>
      </Card>

      {/* Modules */}
      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((module) => (
          <Card key={module.id} className="p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-ploy-blue flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="font-semibold">{module.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{module.description}</p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline" className="w-full">
              <Link href={`/dashboard/consultant/classroom/${module.id}`}>
                <Clock className="h-4 w-4 mr-2" />
                Start Lesson
              </Link>
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
