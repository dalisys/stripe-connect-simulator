import "../styles/globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";

const inter = Inter({ subsets: ["latin"], display: "swap" });

export const metadata = {
  title: "Stripe Connect Fee Simulator",
  description: "Simulate Stripe Connect fee structures and payment flows",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col bg-gray-50">
          <header className="bg-linear-to-r from-stripe-blue to-indigo-800 text-white py-4 shadow-md">
            <div className="container mx-auto px-6 flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold">
                  Stripe Connect Fee Simulator
                </h1>
                <p className="text-sm text-blue-100 mt-1">
                  Calculate fees and visualize payment flows for Stripe Connect
                  integrations
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <a
                  href="https://stripe.com/docs/connect"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-md transition-colors duration-200"
                >
                  Stripe Connect Docs
                </a>
              </div>
            </div>
          </header>
          <main className="grow">
            <div className="container mx-auto px-6 py-6">{children}</div>
          </main>
          <footer className="py-6 border-t border-gray-200 bg-gray-50">
            <div className="container mx-auto px-6">
              <div className="flex flex-col items-center justify-center space-y-3">
                <p className="text-sm text-gray-600 text-center max-w-2xl">
                  This simulator is for demonstration purposes only and is not
                  affiliated with Stripe. All calculations and data should be
                  verified with Stripe's official documentation and tools.
                </p>
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <a
                    href="https://stripe.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 transition-colors duration-200"
                  >
                    Stripe Website
                  </a>
                  <span>•</span>
                  <a
                    href="https://stripe.com/docs/connect"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 transition-colors duration-200"
                  >
                    Connect Documentation
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
