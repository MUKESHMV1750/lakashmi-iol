import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Droplets, Award, Leaf, ShieldCheck, Users, Heart,
  ArrowRight, CheckCircle2, HelpCircle, ChevronDown
} from 'lucide-react';

const coreValues = [
  {
    icon: Leaf,
    title: '100% Pure & Organic',
    desc: 'Extracted from handpicked, unadulterated seeds sourced directly from verified organic farms in Tamil Nadu.',
  },
  {
    icon: Droplets,
    title: 'Cold-Pressed (Chekku/Ghani)',
    desc: 'Crafted using traditional wood-pressing methods at low temperatures to preserve vital nutrients, aroma, and natural antioxidants.',
  },
  {
    icon: ShieldCheck,
    title: 'Zero Chemicals & Preservatives',
    desc: 'No solvent extraction, chemical refining, bleaching, or artificial aromas. 100% unrefined natural oil.',
  },
  {
    icon: Heart,
    title: 'Farmer Community Support',
    desc: 'Direct farm-to-bottle model ensuring fair wages and sustainable livelihoods for over 200 local farming families.',
  },
];

const milestones = [
  { year: '2018', title: 'Founded with Tradition', desc: 'Started with just 2 wooden cold press machines in Madurai, Tamil Nadu.' },
  { year: '2020', title: 'FSSAI & Organic Certified', desc: 'Received national food safety certifications and expanded to 10+ oil varieties.' },
  { year: '2022', title: '50,000+ Families Served', desc: 'Expanded pan-India delivery bringing healthy, unrefined oil to homes everywhere.' },
  { year: '2025', title: 'E-Commerce Platform Launch', desc: 'Launched direct-to-consumer online ordering with instant delivery tracking.' },
];

const faqs = [
  {
    q: 'What is cold-pressed (wood-pressed/chekku) oil?',
    a: 'Cold-pressed oil is extracted by crushing seeds in a traditional wooden mortar (Marachekku) without generating heat. This preserves the oil’s natural nutrients, vitamins, and natural aroma.',
  },
  {
    q: 'Are your oils chemical-free and unrefined?',
    a: 'Yes, 100%! We do not use any heat treatment, chemical solvents, or artificial refining agents. Our oils are allowed to settle naturally before packaging.',
  },
  {
    q: 'What is the shelf life of cold-pressed oil?',
    a: 'Our cold-pressed oils have a natural shelf life of 6 to 9 months when stored in a cool, dark place away from direct sunlight.',
  },
  {
    q: 'Do you offer free shipping?',
    a: 'Yes, we offer free shipping across India on all orders above ₹500.',
  },
];

export default function About() {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-bg dark:bg-gray-950 pt-20 md:pt-24">
      {/* Hero Header */}
      <section className="relative bg-gradient-to-b from-forest-green via-dark-olive to-forest-green text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern opacity-10" />
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-warm-brown/80 text-amber-100 rounded-full text-sm font-medium mb-6">
            <Droplets size={16} /> Heritage & Purity Since 2018
          </span>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-6 leading-tight max-w-3xl mx-auto">
            Restoring Health Through Traditional Wood-Pressed Oils
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light leading-relaxed">
            At Oil Business, we craft 100% pure, unrefined cold-pressed oils that preserve every bit of nature's nutrition for your family.
          </p>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="max-w-7xl mx-auto px-4 -mt-10 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-xl text-center">
          {[
            { value: '100,000+', label: 'Happy Customers' },
            { value: '200+', label: 'Local Farmers Supported' },
            { value: '100%', label: 'Cold-Pressed & Pure' },
            { value: '15+', label: 'Oil Varieties' },
          ].map((stat, i) => (
            <div key={i} className="p-3">
              <h3 className="text-3xl md:text-4xl font-bold font-display text-forest-green dark:text-emerald-400">
                {stat.value}
              </h3>
              <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mt-1 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Story Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-warm-brown uppercase tracking-widest">
              Our Journey
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-forest-green dark:text-white leading-tight">
              Bringing Back the Ancient Wisdom of Cold Pressing
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
              Refined oils in modern stores are often extracted using high heat and chemical solvents that strip away essential vitamins and healthy fatty acids.
            </p>
            <p className="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
              Oil Business was born out of a passion to revive traditional Marachekku (wooden mill) methods. By slowly pressing seeds at room temperature, we retain the authentic flavor, rich aroma, and natural nutrients that keep your heart and body healthy.
            </p>

            <div className="space-y-3 pt-2">
              {[
                'Zero chemical solvents or bleaching agents',
                'Slow wood pressing preserves heat-sensitive vitamins',
                'Lab-tested for heavy metals and purity before packaging',
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Link to="/products" className="btn-primary inline-flex items-center gap-2">
                Explore Products <ArrowRight size={18} />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-gray-800">
              <img
                src="https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1000&q=80"
                alt="Cold pressed oil extraction"
                className="w-full h-[450px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-warm-brown text-white p-6 rounded-2xl shadow-xl max-w-xs hidden sm:block">
              <p className="font-display font-bold text-lg mb-1">Authentic Taste</p>
              <p className="text-xs text-amber-100">100% traditional wood-pressed oils for healthy daily cooking.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-bg-secondary dark:bg-gray-900/50 py-20 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-warm-brown uppercase tracking-widest">
              Why Choose Us
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-forest-green dark:text-white mt-2">
              Our Purity Promise
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
              We never compromise on quality, authenticity, or sustainable ethics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreValues.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-forest-green/10 dark:bg-emerald-400/10 flex items-center justify-center text-forest-green dark:text-emerald-400 mb-4 group-hover:bg-forest-green group-hover:text-white transition-colors">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                    {val.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Timeline Milestones */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center max-w-xl mx-auto mb-16">
          <h2 className="text-3xl font-display font-bold text-forest-green dark:text-white">
            Our Journey So Far
          </h2>
          <p className="text-gray-500 text-sm mt-2">Growing step-by-step with trust and quality.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {milestones.map((m, idx) => (
            <div key={idx} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm relative">
              <span className="text-3xl font-bold font-display text-warm-brown block mb-2">
                {m.year}
              </span>
              <h4 className="font-semibold text-base text-gray-900 dark:text-white mb-1">
                {m.title}
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                {m.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-warm-brown uppercase tracking-widest">
            Got Questions?
          </span>
          <h2 className="text-3xl font-display font-bold text-forest-green dark:text-white mt-2">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left font-semibold text-gray-900 dark:text-white text-base hover:text-dark-olive"
              >
                <span className="flex items-center gap-3">
                  <HelpCircle size={18} className="text-warm-brown flex-shrink-0" />
                  {faq.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`transition-transform text-gray-400 ${
                    openFaq === idx ? 'rotate-180 text-dark-olive' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-800">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="bg-gradient-to-r from-forest-green to-dark-olive rounded-3xl p-10 text-center text-white space-y-4 shadow-xl">
          <h2 className="text-3xl font-display font-bold">Experience the Pure Taste of Nature Today</h2>
          <p className="text-white/80 max-w-xl mx-auto text-sm">
            Order 100% natural, cold-pressed oils delivered fresh to your doorstep.
          </p>
          <div className="pt-2">
            <Link to="/products" className="btn-primary bg-warm-brown hover:bg-terracotta text-white px-8 py-3.5 text-base inline-flex items-center gap-2">
              Shop Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
