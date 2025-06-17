const Footer = () => {
  return (
    <footer className="w-full bg-black text-gray-300 py-10 mt-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        {/* Company Info */}
        <div>
          <h3 className="text-white text-lg font-semibold mb-3">SHOP.CO</h3>
          <p>
            Your one-stop destination for fashion and lifestyle. We bring you
            the best quality at unbeatable prices.
          </p>
        </div>

        {/* Office Info */}
        <div>
          <h4 className="text-white text-md font-semibold mb-3">Office</h4>
          <address className="not-italic space-y-1">
            <p>SHOP.CO HQ</p>
            <p>123 Fashion Avenue</p>
            <p>Dhaka, Bangladesh</p>
            <p>Postal Code: 1207</p>
          </address>
        </div>

        {/* Customer Service */}
        <div>
          <h4 className="text-white text-md font-semibold mb-3">
            Customer Service
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="/help" className="hover:underline focus:underline">
                Help Center
              </a>
            </li>
            <li>
              <a href="/returns" className="hover:underline focus:underline">
                Returns & Refunds
              </a>
            </li>
            <li>
              <a href="/shipping" className="hover:underline focus:underline">
                Shipping Info
              </a>
            </li>
            <li>
              <a href="/contact" className="hover:underline focus:underline">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="text-white text-md font-semibold mb-3">Contact</h4>
          <address className="not-italic space-y-1">
            <p>
              Phone:{" "}
              <a href="tel:+880123456789" className="hover:underline">
                +880 123 456 789
              </a>
            </p>
            <p>
              Email:{" "}
              <a href="mailto:support@shop.co" className="hover:underline">
                support@shop.co
              </a>
            </p>
          </address>
          <div className="flex space-x-4 mt-4">
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white focus:text-white"
              aria-label="Facebook"
            >
              Facebook
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white focus:text-white"
              aria-label="Instagram"
            >
              Instagram
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white focus:text-white"
              aria-label="Twitter"
            >
              Twitter
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-gray-700 mt-10 pt-6 text-center text-sm text-gray-500">
        © 2025 SHOP.CO. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
