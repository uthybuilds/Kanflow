import { PageLayout } from "../layout/PageLayout";
import { Heart, Zap, Shield } from "lucide-react";

export const About = () => {
  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Story */}
          <div className="order-2 lg:order-1">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-8">
              Why I built KanFlow.
            </h1>

            <div className="prose prose-lg text-zinc-400 dark:prose-invert space-y-6">
              <p>
                I started coding KanFlow because I was tired of fighting my own
                tools. I jumped between Jira, Trello, and Asana trying to find
                something that didn't feel like a chore. Every Monday morning
                started with me dreading the project board updates. The tools
                were slow and cluttered and they always felt like they were
                getting in my way instead of helping me ship code.
              </p>

              <p>
                I remember one specific sprint where I spent more time
                configuring workflows and managing tickets than actually writing
                software. That was the breaking point for me. I realized that
                the project management industry had lost its way. They were
                building features for managers who want reports rather than for
                the engineers who actually do the work. I wanted something that
                felt as fast as my text editor.
              </p>

              <p>
                So I decided to build the tool I actually wanted to use. I
                stripped away everything that wasn't essential. No complex
                permission schemes and no endless configuration menus. I focused
                purely on speed and clarity. I wanted a tool where you could
                enter a flow state and stay there. It had to be keyboard centric
                and it had to be beautiful enough that I wouldn't hate looking
                at it all day.
              </p>

              <p>
                KanFlow is just me, Uthman, building the software I wish I had
                when I started. I am not a big corporation trying to sell you
                enterprise contracts. I am just a developer who cares deeply
                about craft and quality. I hope this tool helps you build your
                own ideas faster and with a lot less frustration than I had.
              </p>
            </div>

            <div className="mt-12 pt-12 border-t border-white/5">
              <h3 className="text-lg font-bold text-white mb-6">My Values</h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Heart className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Craftsmanship</h4>
                    <p className="text-sm text-zinc-500 mt-1">
                      I believe software should be built with care and attention
                      to detail.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Zap className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Speed</h4>
                    <p className="text-sm text-zinc-500 mt-1">
                      Waiting for software to load breaks your flow. Speed is a
                      feature.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <Shield className="w-5 h-5 text-green-500" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium">Integrity</h4>
                    <p className="text-sm text-zinc-500 mt-1">
                      No dark patterns. No selling data. Just a good tool for a
                      fair price.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="lg:sticky lg:top-32 order-1 lg:order-2">
            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 shadow-2xl relative group ring-1 ring-white/5">
              <img
                src="/portrait.JPG"
                alt="Uthman Ajanaku"
                className="absolute inset-0 w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl">
                  <p className="text-white font-medium text-lg">
                    "I build for the builders."
                  </p>
                  <p className="text-white/60 text-sm mt-1">
                    Uthman Ajanaku, Founder
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};
