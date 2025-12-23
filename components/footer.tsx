import { Mail, Phone, MapPin, Facebook, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-white border-t border-slate-800/70 shadow-[0_-12px_40px_rgba(15,23,42,0.6)]">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">Thrive Coworking Space</h3>
            <p className="text-slate-300">Your trusted platform for flexible workspace solutions in Addis Ababa.</p>
            <p className="text-slate-400 text-sm mt-3">Making premium workspaces accessible to everyone.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="#" className="hover:text-white transition text-sm">
                  About Us
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition text-sm">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#booking" className="hover:text-white transition text-sm">
                  Book Space
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition text-sm">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <div className="space-y-3 text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">+251 9XX XXX XXXX</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm">info@workspacehub.et</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span className="text-sm">
              Our Location
                  <br />
                  Addis Ababa, Ethiopia
                </span>
              </div>
            </div>
          </div>

          {/* Social, Support & Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Stay Connected</h4>
            <div className="space-y-3 text-slate-300">
              <div className="flex gap-3 mb-3">
                <a href="#" className="hover:text-blue-400 transition">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-blue-400 transition">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              <p className="text-xs mb-2">
                Available: Monday - Friday
                <br />9 AM - 6 PM EAT
              </p>
              <form className="mt-2 flex flex-col gap-2">
                <label className="text-xs text-slate-400">Newsletter</label>
                <div className="flex items-center gap-2">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-3 py-2 rounded-md bg-slate-800/80 text-sm text-slate-100 placeholder:text-slate-500 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-md bg-amber-400 text-slate-900 text-xs font-semibold uppercase tracking-wide hover:bg-amber-300 transition-colors"
                  >
                    Join
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-300 text-sm">
            <p>&copy; 2025 Thrive Coworking Space Ethiopia. All rights reserved.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition text-sm">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition text-sm">
                Terms of Service
              </a>
              <a href="#" className="hover:text-white transition text-sm">
                Support
              </a>
              <a href="/login" className="hover:text-white transition text-sm text-gray-400 hover:text-gray-300">
                Admin Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
