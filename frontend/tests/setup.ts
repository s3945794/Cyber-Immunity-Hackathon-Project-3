import '@testing-library/jest-dom'

// Firebase client/admin modules were removed from the frontend — the browser
// no longer connects to Firebase or Firestore directly. TideCloak is the
// only authentication provider; any future server-side database access goes
// through the Express backend (see backend/src/lib/firebase.ts), not the
// frontend. No Firebase mocks are needed here anymore.
