import { calculateStripeFees } from "../lib/stripe-fee-calculator";

/**
 * FeeCalculator component - processes input data and returns calculated fees
 *
 * @param {Object} formData - Form data with payment and fee configuration
 * @returns {Object} Calculated fees and payment distribution
 */
export default function FeeCalculator(formData) {
  // Calculate fees based on the provided form data
  return calculateStripeFees(formData);
}
