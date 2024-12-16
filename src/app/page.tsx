import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AppBar } from "@/components/AppBar";
// import { Redirect } from "@/components/Redirect";
import { PlaySquare, Layers, Plus } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <AppBar />
      {/* <Redirect /> */}
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Your Music, Your Way
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Create custom spaces, add your favorite songs, and play them
                  in your perfect sequence.
                </p>
              </div>
              <div className="space-x-4">               
                <Button>Get Started</Button>
                <Button variant="outline">Learn More</Button>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-8">
              Key Features
            </h2>
            <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Plus className="h-8 w-8 mb-2" />
                <h3 className="text-xl font-bold">Add Your Songs</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Easily add and manage your favorite tracks from various
                  sources.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <Layers className="h-8 w-8 mb-2" />
                <h3 className="text-xl font-bold">Create Spaces</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Organize your music into custom spaces for different moods or
                  occasions.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 border-gray-800 p-4 rounded-lg">
                <PlaySquare className="h-8 w-8 mb-2" />
                <h3 className="text-xl font-bold">Custom Sequencing</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Play your music in the perfect order, tailored to your
                  preferences.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full py-16 md:py-28 lg:py-36">
          <div className="container px-4 md:px-6 max-w-5xl mx-auto">
            <div className="flex items-center justify-between space-y-8 text-center">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Start Streaming Today
                </h2>
              </div>
              <div className="w-full max-w-sm space-y-2 mt-8">
                <form className="flex space-x-2">
                  <Input
                    className="max-w-lg flex-1"
                    placeholder="Enter your email"
                    type="email"
                  />
                  <Button type="submit">Sign Up</Button>
                </form>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By signing up, you agree to our{" "}
                  <Link className="underline underline-offset-2" href="#">
                    Terms & Conditions
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <div className="text-xs hover:underline underline-offset-4">
          Made with 💖 by{" "}
          <a href="https://x.com/aykansal" className="font-semibold">
            Aykansal
          </a>
        </div>
        <div></div>
      </footer>
    </div>
  );
}
