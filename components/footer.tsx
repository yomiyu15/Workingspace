import { Mail, Phone, MapPin, Facebook, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer id="contact" className="bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <h3 className="text-2xl font-bold mb-4">WorkSpace Hub</h3>
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
                  Multiple Locations
                  <br />
                  Addis Ababa, Ethiopia
                </span>
              </div>
            </div>
          </div>

          {/* Social & Support */}
          <div>
            <h4 className="font-semibold mb-4">Follow & Support</h4>
            <div className="space-y-3 text-slate-300">
              <div className="flex gap-3 mb-4">
                <a href="#" className="hover:text-blue-400 transition">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="hover:text-blue-400 transition">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
              <p className="text-xs">
                Available: Monday - Friday
                <br />9 AM - 6 PM EAT
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-slate-300 text-sm">
            <p>&copy; 2025 WorkSpace Hub Ethiopia. All rights reserved.</p>
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
