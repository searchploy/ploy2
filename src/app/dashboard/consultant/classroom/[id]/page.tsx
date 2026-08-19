"use client";

import React, { type ReactNode } from "react";
import { classroomModules } from "@/lib/data/classroom-content";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen, Clock } from "lucide-react";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";

function renderContent(content: string | string[]): ReactNode {
  if (Array.isArray(content)) {
    return (
      <ul className="list-disc list-inside space-y-2">
        {content.map((item, idx) => (
          <li key={idx} className="text-muted-foreground leading-relaxed">
            {item}
          </li>
        ))}
      </ul>
    );
  }

  // Split by double newlines for paragraphs, handle bullet points
  const paragraphs = content.split("\n\n");

  return (
    <div className="space-y-4">
      {paragraphs.map((para, idx) => {
        if (para.includes("•")) {
          // Bullet list
          const items = para.split("\n").filter((line) => line.trim());
          return (
            <ul key={idx} className="list-disc list-inside space-y-2 text-muted-foreground">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="leading-relaxed">
                  {item.replace("•", "").trim()}
                </li>
              ))}
            </ul>
          );
        }

        if (para.includes("Step ") || para.includes("Phase ")) {
          // Structured steps/phases
          const lines = para.split("\n").filter((line) => line.trim());
          return (
            <div key={idx} className="space-y-2">
              {lines.map((line, lineIdx) => (
                <div key={lineIdx} className="text-muted-foreground leading-relaxed">
                  {line}
                </div>
              ))}
            </div>
          );
        }

        return (
          <p key={idx} className="text-muted-foreground leading-relaxed">
            {para}
          </p>
        );
      })}
    </div>
  );
}

export default function LessonPage() {
  const params = useParams();
  const id = parseInt(params.id as string);

  const lesson = classroomModules.find((m) => m.id === id);

  if (!lesson) {
    notFound();
  }

  const prevLesson = classroomModules.find((m) => m.id === id - 1);
  const nextLesson = classroomModules.find((m) => m.id === id + 1);

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard/consultant/classroom">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Classroom
          </Button>
        </Link>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-4 text-sm">
        <span className="text-muted-foreground">
          Module {lesson.id} of {classroomModules.length}
        </span>
        <div className="h-2 flex-1 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-ploy-gold"
            style={{ width: `${(lesson.id / classroomModules.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Main Content */}
      <Card className="p-8 lg:p-12">
        <div className="max-w-3xl mx-auto">
          {/* Title */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="h-5 w-5 text-ploy-gold" />
              <span className="text-sm font-medium text-ploy-gold">Module {lesson.id}</span>
            </div>
            <h1 className="text-4xl font-bold mb-3">{lesson.title}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              {lesson.readTime}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-12">
            {lesson.sections.map((section, idx) => (
              <div key={idx} className="space-y-4">
                {section.title && (
                  <div>
                    {section.type === "intro" && (
                      <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
                    )}
                    {section.type === "concept" && (
                      <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                    )}
                    {section.type === "framework" && (
                      <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                    )}
                    {section.type === "mistakes" && (
                      <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                    )}
                    {section.type === "takeaways" && (
                      <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                    )}
                    {section.type === "homework" && (
                      <h3 className="text-xl font-semibold mb-4">{section.title}</h3>
                    )}
                  </div>
                )}

                {/* Content */}
                <div className="prose prose-invert max-w-none">{renderContent(section.content)}</div>
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-16 pt-8 border-t border-border/50">
            {prevLesson ? (
              <Button asChild variant="outline">
                <Link href={`/dashboard/consultant/classroom/${prevLesson.id}`}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous: {prevLesson.title}
                </Link>
              </Button>
            ) : (
              <div></div>
            )}

            {nextLesson ? (
              <Button asChild variant="gradient">
                <Link href={`/dashboard/consultant/classroom/${nextLesson.id}`}>
                  Next: {nextLesson.title}
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            ) : (
              <Button asChild variant="gradient">
                <Link href="/dashboard/consultant/classroom">
                  Back to Classroom
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
