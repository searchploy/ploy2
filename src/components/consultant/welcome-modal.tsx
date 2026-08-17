"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { markWelcomeModalSeen } from "@/app/actions/consultant";

interface Particle {
  id: number;
  x: number;
  y: number;
  delay: number;
}

export function WelcomeModal({ userId, hasSeen }: { userId: string; hasSeen: boolean }) {
  const [open, setOpen] = useState(!hasSeen);
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (open && !hasSeen) {
      // Generate celebration particles
      const newParticles = Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: -10,
        delay: Math.random() * 0.3,
      }));
      setParticles(newParticles);
    }
  }, [open, hasSeen]);

  const handleClose = async () => {
    setOpen(false);
    await markWelcomeModalSeen(userId);
  };

  return (
    <>
      {/* Celebration particles */}
      {open && (
        <div className="fixed inset-0 pointer-events-none overflow-hidden">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full pointer-events-none animate-pulse"
              style={{
                left: `${particle.x}%`,
                background: ["#5B82F7", "#FF6B6B", "#FFD93D", "#6BCB77"][
                  Math.floor(Math.random() * 4)
                ],
                animation: `fall 3s linear ${particle.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }

        @keyframes celebration-pop {
          0% {
            transform: scale(0) rotate(0);
            opacity: 1;
          }
          50% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1) rotate(0);
            opacity: 1;
          }
        }
      `}</style>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md border border-ploy-blue/20 bg-secondary/80 backdrop-blur-sm">
          <div className="absolute inset-0 -z-10 rounded-lg bg-gradient-to-br from-ploy-blue/10 via-transparent to-transparent" />

          <DialogHeader>
            <div className="flex justify-center mb-6">
              <div
                className="text-5xl"
                style={{
                  animation: "celebration-pop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                🎉
              </div>
            </div>
            <DialogTitle className="text-center text-2xl font-bold">
              Welcome to Ploy Consulting!
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-6">
            <div className="text-center space-y-3">
              <p className="text-lg font-semibold text-ploy-blue">
                We're excited to have you! 🚀
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Start by completing the lessons in our Classroom to learn everything you need to know about AI consulting. Then, you'll be ready to start working with clients and building your consulting business.
              </p>
            </div>

            <div className="bg-ploy-blue/10 border border-ploy-blue/30 rounded-lg p-4 space-y-2">
              <h4 className="font-semibold text-sm">Here's what to do first:</h4>
              <ol className="text-sm text-muted-foreground space-y-2">
                <li>📚 Go through the Classroom lessons</li>
                <li>💼 Add your first client</li>
                <li>📊 Generate an AI Report</li>
                <li>🎯 Start closing deals</li>
              </ol>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleClose}
              variant="outline"
              className="flex-1"
            >
              Got it
            </Button>
            <Button
              asChild
              className="flex-1 bg-ploy-blue hover:bg-ploy-blue/90"
              onClick={handleClose}
            >
              <Link href="/dashboard/consultant/classroom">
                Start Classroom →
              </Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
