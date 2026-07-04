import Link from 'next/link'
import Image from 'next/image'

const footerLinks = [
  {
    title: 'About',
    links: ['About FLIQQ', 'Blog', 'Careers', 'Press', 'Community Guidelines'],
  },
  {
    title: 'Support',
    links: ['Help Center', 'Safety', 'Privacy Policy', 'Terms of Service', 'Cookie Policy'],
  },
  {
    title: 'For Creators',
    links: ['Creator Dashboard', 'Partner Program', 'Brand Partnerships', 'Resources', 'Creator Camp'],
  },
  {
    title: 'More',
    links: ['Developers', 'API', 'Download Apps', 'Advertise', 'Sitemap'],
  },
]

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-gray-400 hover:text-white transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 border-t border-white/10 gap-4">
          <div className="flex items-center gap-2">
            <Image src="/logo.svg" alt="FLIQQ" width={24} height={24} />
            <span className="text-sm text-gray-400">
              &copy; 2026 FLIQQ. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
