import React from "react";
import Link from "next/link";
import PublicLayout from '@/components/layout/PublicLayout';

const LandingPage = () => {
  return (
    <PublicLayout>
      <div className="selection:bg-blue-500/30 selection:text-blue-600">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center overflow-hidden px-6 pt-24 pb-20 md:pt-32 md:pb-32">
          <div className="max-w-4xl text-center space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-50 px-4 py-1.5 text-xs font-semibold text-blue-600 backdrop-blur-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex size-2 rounded-full bg-blue-500"></span>
              </span>
              Now supporting 12+ African Languages
            </div>

            <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl text-slate-900">
              Speak the Language of <br className="hidden md:block" />
              <span className="text-blue-600">Your People.</span>
            </h1>

            <p className="mx-auto max-w-2xl text-lg text-slate-600 sm:text-xl">
              Empower your business with an AI voice assistant that understands
              local dialects and nuances. Seamlessly handle orders, inquiries, and
              support across Africa.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <button className="w-full rounded-full bg-blue-600 px-8 py-4 text-center font-bold text-white transition-all hover:bg-blue-700 sm:w-auto">
                Start Free Trial
              </button>
              <button className="w-full rounded-full border border-slate-200 bg-white px-8 py-4 text-center font-bold text-slate-900 transition-all hover:bg-slate-50 sm:w-auto">
                Book a Demo
              </button>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="mx-auto max-w-7xl px-6 py-24 bg-slate-50">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {[
              {
                title: "Native Accents",
                desc: "Deeply trained on Pidgin, Yoruba, Swahili and more. Not just translation - true understanding.",
                icon: "🌍",
              },
              {
                title: "Lightning Fast",
                desc: "Optimized response times less than 1s. Keep your customers engaged without the wait.",
                icon: "⚡",
              },
              {
                title: "Privacy First",
                desc: "Local processing options available for sensitive business data. Your data stays Yours.",
                icon: "🛡️",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group relative rounded-2xl border border-slate-200 bg-white p-8 transition-all hover:border-blue-500/20 shadow-sm"
              >
                <div className="mb-4 text-3xl">{feature.icon}</div>
                <h3 className="mb-3 text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Trust Quote */}
        <section className="bg-white py-24 border-t border-slate-100">
          <div className="mx-auto max-w-4xl px-6 text-center">
            <div className="text-4xl font-serif text-slate-300 mb-8 opacity-50">
              "
            </div>
            <p className="text-2xl font-light italic text-slate-600 sm:text-3xl">
              "LocalVoice AI transformed how I handle delivery orders in Lagos. I
              no longer miss calls during rush hour, and my customers love that it
              speaks their language."
            </p>
            <div className="mt-8 flex flex-col items-center gap-2">
              <div className="size-12 rounded-full border border-blue-500/20 bg-slate-100" />
              <span className="font-bold text-slate-900">Emeka Okafor</span>
              <span className="text-sm text-slate-500 uppercase tracking-widest">
                Founder, LagosDelights
              </span>
            </div>
          </div>
        </section>
      </div>
    </PublicLayout>
  );
};

export default LandingPage;
