import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-background border-t py-10 px-6">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
        {/* Branding Section */}
        <div>
          <h2 className="text-2xl font-bold text-primary">Moodflix</h2>
          <p className="text-sm text-muted-foreground mt-2">
            Discover movies and shows tailored for your mood.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            © {new Date().getFullYear()} Moodflix. All rights reserved.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4">Quick Links</h3>
          <nav className="flex flex-col space-y-2">
            <Link href="/about" className="text-sm text-muted-foreground hover:text-primary">
              About
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">
              Contact Us
            </Link>
          </nav>
        </div>

        {/* Social Media Links */}
        <div>
          <h3 className="text-lg font-semibold text-primary mb-4">Follow Us</h3>
          <div className="flex justify-center md:justify-start space-x-4">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaFacebook size={24} />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="mt-8 border-t pt-4 text-center text-sm text-muted-foreground">
        Made by Preetham Devulapally
      </div>
    </footer>
  );
}
