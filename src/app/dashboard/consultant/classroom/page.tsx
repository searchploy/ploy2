import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { classroomModules } from "@/lib/data/classroom-content";

// Read from the lesson content itself. This page used to keep its own copy of
// the list, so adding a lesson left it invisible here.
const modules = classroomModules;

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
              <p className="text-xs text-muted-foreground mt-1">0 of {modules.length} lessons completed</p>
            </div>
            <div className="text-2xl font-bold text-ploy-gold">0%</div>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-ploy-gold" style={{ width: "0%" }}></div>
          </div>
        </div>
      </Card>

      {/* Modules */}
      <div className="grid gap-4 sm:grid-cols-2">
        {modules.map((module) => (
          <Card key={module.id} className="p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-3">
              <BookOpen className="h-5 w-5 text-ploy-gold flex-shrink-0 mt-1" />
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
