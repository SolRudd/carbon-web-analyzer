'use strict';

function normalizeLeadEmail(value) {
  return String(value || '').trim().toLowerCase();
}

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function parseLeadCapturePayload(payload = {}, options = {}) {
  const email = normalizeLeadEmail(payload.contactEmail);
  const consent = payload.contactConsent === true;
  const source = String(payload.contactSource || 'homepage_hero').trim().slice(0, 80) || 'homepage_hero';
  const requireEmail = options.requireEmail === true;

  if (!email) {
    if (requireEmail) {
      const error = new Error('Email address is required before running a scan.');
      error.statusCode = 400;
      throw error;
    }

    return {
      shouldCapture: false,
      email: null,
      consent: false,
      source,
    };
  }

  if (!isValidEmail(email)) {
    const error = new Error('A valid email address is required.');
    error.statusCode = 400;
    throw error;
  }

  if (!consent) {
    const error = new Error('Please confirm contact permission before submitting your email.');
    error.statusCode = 400;
    throw error;
  }

  return {
    shouldCapture: true,
    email,
    consent,
    source,
  };
}

module.exports = {
  parseLeadCapturePayload,
};
