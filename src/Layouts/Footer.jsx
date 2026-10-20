import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
  FaGithub,
} from "react-icons/fa";

const Footer = () => {
  const footerSection = [
    {
      title: "Customer Service",
      links: [
        "Track Your Order",
        "Return & Refund",
        "Shipping Info",
        "Size Guide",
        "Contact Us",
      ],
    },
    {
      title: "About ShopCart",
      links: [
        "Our Story",
        "Career",
        "Press",
        "Affiliate Program",
        "Corporate Sales",
      ],
    },
    {
      title: "Help & Support",
      links: [
        "FAQs",
        "Product Support",
        "Report an Issue",
        "Live Chat",
        "Feedback",
      ],
    },
    {
      title: "Policies",
      links: [
        "Privacy Policy",
        "Terms of Service",
        "Return Policy",
        "Shipping Policy",
        "Cookie Policy",
      ],
    },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: FaFacebookF,
      color: "hover:text-blue-600",
    },
    {
      name: "Instagram",
      icon: FaInstagram,
      color: "hover:text-pink-500",
    },
    {
      name: "Twitter",
      icon: FaTwitter,
      color: "hover:text-sky-500",
    },
    {
      name: "YouTube",
      icon: FaYoutube,
      color: "hover:text-red-600",
    },
    {
      name: "LinkedIn",
      icon: FaLinkedinIn,
      color: "hover:text-blue-700",
    },
    {
        name: "Github",
        icon : FaGithub,
        color: "hover:text-gray-950",
    },
  ];

  return (
    <footer className="border-t border-gray-200 bg-white text-gray-600">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-12">
        {/* Main Footer */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {/* Brand Section */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <a href="/" className="inline-block">
              <h2 className="text-2xl font-extrabold tracking-tight text-black">
                Shop<span className="text-indigo-600">Cart</span>
              </h2>
            </a>
            <p className="mt-3 max-w-sm text-sm leading-6 text-gray-600">
              Your one-stop destination for the latest products at the best
              prices. Shop Smater, live better.
            </p>

            {/* Social Media  */}
            <div className="mt-4 flex items-center gap-3">
              {socialLinks.map(({ name, icon: Icon, color }) => (
                <a
                  key={name}
                  href="#"
                  aria-label={name}
                  className={`flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition-all duration-200 hover:-translate-y-1 hover:bg-gray-200 ${color}`}
                >
                  <Icon size={16} strokeWidth={2.2} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Link Section */}
          {footerSection.map((section) => (
            <div className="min-w-0" key={section.title}>
              <h3 className="mb-3 text-sm font-bold text-gray-900">
                {section.title}
              </h3>

              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-xs leading-5 text-gray-600 transition-colors duration-200 hover:text-indigo-600"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        {/* Bottom Footer */}
        <div className="mt-8 flex flex-col gap-5 border-t border-gray-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Copyright */}
          <p className="text-xs text-gray 600">
            © {new Date().getFullYear()} ShopCart. All rights reserved.
          </p>

          {/* Payment Methods */}
          <div className="flex flex-wrap itemx-center gap-3">
            <span className="mr-1 text-xs text-gray-600">We Accept</span>

            {/* Cards We Accept */}
            <span className="text-sm font-black italic text-blue-700">
              VISA
            </span>

            <div
              className="flex items-center"
              aria-label="MasterCard"
              title="Mastercard"
            >
              <span className="mr-1.5 h-4 w-4 rounded-full bg-red-500" />
              <span className="h-4 w-4 rounded-full bg-yellow-500/90" />
            </div>

            <span className="text-xs font-extrabold italic text-blue-800">
              RuPay
            </span>

            <span className="text-xs font-extrabold italic text-gray-700">
              UPI
            </span>

            <span className="rounded-sm bg-blue-700 px-1 py-0.5 text-xs font-bold text-white">
              Amex
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
