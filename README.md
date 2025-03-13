# Stripe Connect Fee Simulator

A modern web application that simulates the entire payment workflow for Stripe Connect—including every applicable fee and parameter.

## Project Overview

Stripe's test and sandbox environments currently fall short in simulating its full fee structure. This project addresses that gap by developing a modern, streamlined web application that simulates the complete payment workflow for Stripe Connect—accurately reflecting all fees based on user-defined scenarios.

## Key Features

* **Comprehensive Payment Simulation:** Simulate the complete payment process with accurate fee calculations.
* **Dynamic Fee Calculation:**
   * Calculate and display all relevant Stripe fees.
   * Choose whether "Stripe handles pricing for your users" or "You handle pricing for your users."
   * Input options for customer payment amount, application fees, and negotiated Stripe fees.
* **Flexible Parameter Settings:** Dynamically adjust parameters affecting the payment process:
   * Account Types: Standard, Express, and Custom.
   * Charge Types: Direct, Destination, and Separate.
   * Payout Configurations: Standard or Instant (with applicable fees).
* **Visual Payment Flow Diagram:** Clear illustration of the flow of funds—showing fee deductions and payout timings.

## Tech Stack

* Next.js (React)
* Tailwind CSS
* shadcn/ui components

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Run the development server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser

## License

MIT