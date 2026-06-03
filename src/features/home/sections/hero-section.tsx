import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

import Image from "next/image";

export function HeroSection() {
  return (
    <>
      <main className="overflow-hidden">
        <section className="bg-background">
          <div className="relative py-32 md:pt-44">
            <div className="mask-radial-from-45% mask-radial-to-75% mask-radial-at-top mask-radial-[75%_100%] mask-t-from-50% lg:aspect-9/4 absolute inset-0 aspect-square lg:top-24 dark:opacity-5">
              <Image
                src="https://images.unsplash.com/photo-1740516367177-ae20098c8786?q=80&w=2268&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="hero background"
                width={2268}
                height={1740}
                className="size-full object-cover object-top"
              />
            </div>
            <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
              <div className="mx-auto max-w-md text-center">
                <h1 className="text-balance font-serif text-4xl font-medium sm:text-5xl">
                  One platform to manage all your workspaces.
                </h1>
                <p className="text-muted-foreground mt-4 text-balance">
                  Organize tasks, align your team, and effortlessly switch between projects with our comprehensive task management hub.
                </p>

                <Button asChild className="mt-6 pr-1.5">
                  <Link href="/login">
                    <span className="text-nowrap">Get Started</span>
                    <ChevronRight className="opacity-50" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
