import { useState } from 'react';
import {
  Mail, Phone, MapPin, Clock, Send, CheckCircle,
  MessageSquare, Headset, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      toast.success('Thank you! Your message has been received.');
    }, 1000);
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone & WhatsApp',
      lines: ['+91 98765 43210', '+91 91234 56789'],
      subtext: 'Mon - Sat: 9:00 AM - 7:00 PM',
      color: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    },
    {
      icon: Mail,
      title: 'Email Support',
      lines: ['support@oilbusiness.com', 'sales@oilbusiness.com'],
      subtext: 'Responses within 24 hours',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
    },
    {
      icon: MapPin,
      title: 'Store & Mill Location',
      lines: ['123 Heritage Mill Road, Gandhi Nagar', 'Madurai, Tamil Nadu - 625020'],
      subtext: 'Visit us for fresh oil extraction demo',
      color: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    },
    {
      icon: Clock,
      title: 'Business Hours',
      lines: ['Monday - Saturday: 9:00 AM - 8:00 PM', 'Sunday: 10:00 AM - 2:00 PM'],
      subtext: 'Open all days for online orders',
      color: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
    },
  ];

  return (
    <div className="min-h-screen bg-bg dark:bg-gray-950 pt-20 md:pt-24">
      {/* Header Banner */}
      <section className="bg-gradient-to-r from-forest-green to-dark-olive text-white py-16 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-warm-brown/80 text-amber-100 rounded-full text-xs font-semibold mb-4">
            <Headset size={14} /> We're Here to Help
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">Get in Touch</h1>
          <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto font-light">
            Have questions about our cold-pressed oils, bulk orders, or your delivery? Reach out to us anytime!
          </p>
        </div>
      </section>

      {/* Main Section */}
      <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, idx) => {
            const Icon = info.icon;
            return (
              <div
                key={idx}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all"
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${info.color}`}>
                  <Icon size={24} />
                </div>
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">
                  {info.title}
                </h3>
                {info.lines.map((line, lIdx) => (
                  <p key={lIdx} className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {line}
                  </p>
                ))}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
                  {info.subtext}
                </p>
              </div>
            );
          })}
        </div>

        {/* Contact Form & Map / Store Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form */}
          <div className="lg:col-span-7 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-warm-brown/10 flex items-center justify-center text-warm-brown">
                <MessageSquare size={20} />
              </div>
              <div>
                <h2 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
                  Send Us a Message
                </h2>
                <p className="text-xs text-gray-500">Fill in the details below and our team will respond shortly.</p>
              </div>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center space-y-3">
                <CheckCircle size={48} className="text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">Message Sent Successfully!</h3>
                <p className="text-sm text-emerald-600 dark:text-emerald-400">
                  Thank you for reaching out to Oil Business. Our customer support representative will contact you shortly.
                </p>
                <button
                  onClick={() => { setSubmitted(false); setForm({ name: '', email: '', phone: '', subject: '', message: '' }); }}
                  className="btn-primary mt-4 py-2.5 text-sm"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="John Doe"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="your@email.com"
                      className="input-field"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Mobile / WhatsApp</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="98765 43210"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      placeholder="Product query, bulk order, feedback..."
                      className="input-field"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">Your Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help you..."
                    className="input-field resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full btn-primary py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {loading ? 'Sending Message...' : 'Send Message'} {!loading && <Send size={18} />}
                </button>
              </form>
            )}
          </div>

          {/* Side Banner & Bulk Order Callout */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-gradient-to-br from-forest-green to-dark-olive text-white rounded-3xl p-8 shadow-md space-y-6 relative overflow-hidden">
              <div className="flex items-center gap-3">
                <Sparkles size={24} className="text-amber-300" />
                <h3 className="text-xl font-display font-bold">Bulk & B2B Orders</h3>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Looking for wholesale prices, hotel supplies, or corporate gifting packages? We offer customized packaging and direct refinery discounts for bulk orders.
              </p>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 space-y-2 border border-white/20">
                <p className="text-xs font-semibold text-amber-200 uppercase tracking-wider">Direct Wholesale Desk</p>
                <p className="text-lg font-bold text-white">+91 98765 43210</p>
                <p className="text-xs text-white/70">bulk@oilbusiness.com</p>
              </div>
            </div>

            {/* Visit Store Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-sm space-y-3">
              <h4 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <MapPin size={18} className="text-warm-brown" /> Visit Our Press Mill
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                Experience the aroma of freshly cold-pressed oils live at our crushing facility in Madurai. Open for guided tours every Saturday from 10:00 AM to 1:00 PM.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
