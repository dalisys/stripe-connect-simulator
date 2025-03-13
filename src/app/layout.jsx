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
                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-2">
                  <span>Made by</span>
                  <a
                    href="https://github.com/dalisys"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 transition-colors duration-200 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    @dalisys
                  </a>
                  <span>•</span>
                  <a
                    href="https://github.com/dalisys/stripe-connect-simulator"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 transition-colors duration-200 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-1"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                    Repository
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
