import { Link } from 'react-router-dom';
import { Droplets, Phone, Mail, MapPin, Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const categories = ['Groundnut Oil', 'Sesame Oil', 'Coconut Oil', 'Olive Oil', 'Mustard Oil', 'Sunflower Oil'];
const quickLinks = [
  { to: '/about', label: 'About Us' },
  { to: '/products', label: 'Products' },
  { to: '/contact', label: 'Contact' },
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
];

export default function Footer() {
  return (
    <footer className="bg-forest-green text-white">
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-warm-brown rounded-xl flex items-center justify-center">
                <Droplets size={22} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl">Oil<span className="text-warm-brown">Business</span></span>
            </Link>
            <p className="text-green-200 text-sm leading-relaxed mb-6">
              Premium cold-pressed and organic oils sourced directly from farmers. Pure, natural, and healthy for your family.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 bg-green-700/50 hover:bg-warm-brown rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110">
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-semibold text-warm-brown mb-4 text-sm uppercase tracking-wider">Categories</h4>
            <ul className="space-y-2">
              {categories.map((cat) => (
                <li key={cat}>
                  <Link to={`/products?keyword=${cat}`} className="text-green-200 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                    → {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-warm-brown mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {quickLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="text-green-200 hover:text-white text-sm transition-colors duration-200 hover:translate-x-1 inline-block">
                    → {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-warm-brown mb-4 text-sm uppercase tracking-wider">Contact</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-sage-green mt-0.5 flex-shrink-0" />
                <p className="text-green-200 text-sm">123 Oil Mills Road, Chennai, Tamil Nadu 600001</p>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={16} className="text-sage-green flex-shrink-0" />
                <a href="tel:+919876543210" className="text-green-200 hover:text-white text-sm transition-colors">+91 98765 43210</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-sage-green flex-shrink-0" />
                <a href="mailto:info@oilbusiness.com" className="text-green-200 hover:text-white text-sm transition-colors">info@oilbusiness.com</a>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-6">
              <p className="text-sm text-green-200 mb-3">Subscribe for offers & updates:</p>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 bg-green-700/40 border border-green-600 rounded-xl text-sm text-white placeholder-green-400 focus:outline-none focus:border-warm-brown"
                />
                <button type="submit" className="px-4 py-2 bg-warm-brown text-white text-sm rounded-xl hover:bg-terracotta transition-colors">
                  Go
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-green-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-green-300 text-sm">© 2024 Oil Business. All rights reserved.</p>
          <div className="flex items-center gap-4 text-sm text-green-300">
            <span>FSSAI Certified</span>
            <span>•</span>
            <span>ISO 22000:2018</span>
            <span>•</span>
            <span>Organic India Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
