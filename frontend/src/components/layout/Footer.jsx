import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiMapPin, FiTwitter, FiFacebook, FiInstagram, FiYoutube, FiLinkedin } from 'react-icons/fi'

const footerLinks = {
  platform: [
    { label: 'Olympiads', to: '/olympiads' },
    { label: 'Results', to: '/results' },
    { label: 'Announcements', to: '/announcements' },
    { label: 'Register', to: '/register' },
    { label: 'School Registration', to: '/school-register' },
  ],
  company: [
    { label: 'About Us', to: '/about' },
    { label: 'Contact', to: '/contact' },
    { label: 'FAQ', to: '/faq' },
    { label: 'Student Login', to: '/login' },
  ],
}

const socials = [
  { Icon: FiTwitter, href: '#', label: 'Twitter' },
  { Icon: FiFacebook, href: '#', label: 'Facebook' },
  { Icon: FiInstagram, href: '#', label: 'Instagram' },
  { Icon: FiYoutube, href: '#', label: 'YouTube' },
  { Icon: FiLinkedin, href: '#', label: 'LinkedIn' },
]

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(135deg, #001040 0%, #001F5E 100%)' }}>
      {/* Main Footer */}
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl gradient-orange flex items-center justify-center">
                <span className="text-white font-black text-xl">B</span>
              </div>
              <div>
                <div className="text-white font-black text-lg leading-tight font-display">BHARAT AI</div>
                <div className="text-[#FF8C00] text-xs font-semibold tracking-widest">OLYMPIAD</div>
              </div>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              India's premier AI olympiad platform empowering 50,000+ students from 10,000+ schools across 28+ states.
            </p>
            <div className="flex gap-3">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-[#FF8C00] flex items-center justify-center text-white/70 hover:text-white transition-all duration-200"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">Platform</h4>
            <ul className="space-y-3">
              {footerLinks.platform.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/60 hover:text-[#FF8C00] text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#FF8C00] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/60 hover:text-[#FF8C00] text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-[#FF8C00] opacity-0 group-hover:opacity-100 transition-opacity" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-5 text-sm tracking-wider uppercase">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <FiMail className="text-[#FF8C00] mt-0.5 flex-shrink-0" size={16} />
                <a href="mailto:info@baio.in" className="hover:text-[#FF8C00] transition-colors">info@baio.in</a>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <FiPhone className="text-[#FF8C00] mt-0.5 flex-shrink-0" size={16} />
                <span>+91 1800-XXX-XXXX</span>
              </li>
              <li className="flex items-start gap-3 text-white/60 text-sm">
                <FiMapPin className="text-[#FF8C00] mt-0.5 flex-shrink-0" size={16} />
                <span>New Delhi, India 110001</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-custom py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Bharat AI Olympiad. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service', 'Sitemap'].map((item) => (
              <Link key={item} to="#" className="text-white/40 hover:text-white/70 text-xs transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
