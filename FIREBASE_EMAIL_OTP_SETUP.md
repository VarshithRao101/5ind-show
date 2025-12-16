# Firebase Email OTP Verification Implementation

## Overview
This document outlines the Firebase Email Link Sign-In (OTP Verification) implementation for the CineFind application.

## Implementation Details

### 1. **AuthContext Updates** (`src/context/AuthContext.jsx`)
- **Added imports**: `sendSignInLinkToEmail`, `signInWithEmailLink` from `firebase/auth`
- **New functions**:
  - `sendEmailLink(email)`: Sends verification email link to user
  - `verifyEmailLink(email)`: Verifies the email link and signs in the user
- **ActionCodeSettings**:
  - `url`: "http://localhost:3000/verify"
  - `handleCodeInApp`: true

### 2. **Signup Page Updates** (`src/screens/Auth/Signup.jsx`)
- **Removed**: Password fields (not needed for email link sign-in)
- **Added**: 
  - `emailSent` state to track if email has been sent
  - Success message showing email verification status
- **Flow**:
  1. User enters email only
  2. Click "Send Verification Link"
  3. Email is sent to user's inbox
  4. Shows success message: "OTP has been sent to your email"
  5. User can try different email or go back to login

### 3. **Verify Page Creation** (`src/screens/Auth/Verify.jsx`)
- **Purpose**: Handle email link verification
- **States**:
  - `verifying`: Initial loading state
  - `success`: Email verified successfully
  - `error`: Verification failed
- **Process**:
  1. Retrieves email from localStorage
  2. Checks if URL contains `oobCode` parameter
  3. Calls `verifyEmailLink()` with email
  4. Automatically redirects to genre selection after 2 seconds
- **Error Handling**:
  - Invalid action code: "Invalid or expired verification link"
  - Expired action code: "This verification link has expired"
  - Invalid email: "Invalid email address"
  - Generic errors with specific messages

### 4. **AppRoutes Updates** (`src/AppRoutes.jsx`)
- **Added**: `/verify` route (public route)
- Import Verify component
- Route definition: `<Route path="/verify" element={<Verify />} />`

## Firebase Configuration

The Firebase project must have **Email/Password** authentication provider enabled with:
- ✅ Email/Password enabled
- ✅ Email Link Authentication enabled (default)
- ✅ Email templates configured in Firebase Console

## Flow Diagram

```
Signup Page
    ↓
User enters email → Click "Send Verification Link"
    ↓
sendEmailLink(email) triggered
    ↓
Firebase sends email with link containing oobCode
    ↓
User clicks link in email
    ↓
User redirected to /verify page
    ↓
Verify page runs verification logic
    ↓
verifyEmailLink(email, link) called
    ↓
User authenticated successfully
    ↓
Redirect to Genre Selection (/genres)
```

## Key Features

### ✅ Email Verification
- Uses Firebase `sendSignInLinkToEmail()` API
- Email stored in localStorage for verification page
- URL safe (handles special characters)

### ✅ Error Handling
- Invalid/expired links
- Missing email information
- Network failures
- User-friendly error messages

### ✅ User Experience
- Clean, intuitive signup flow
- Loading states with spinner
- Success confirmation message
- Option to retry with different email
- Auto-redirect after successful verification

### ✅ Security
- Email link valid for 24 hours (Firebase default)
- `handleCodeInApp: true` prevents opening email provider app
- Email verification before account creation
- Email stored securely in localStorage (cleared after use)

## Testing Steps

1. **Signup**:
   - Go to `/signup`
   - Enter valid email
   - Click "Send Verification Link"
   - Should see success message

2. **Verify**:
   - Check email inbox
   - Click verification link
   - Should see "Verifying your email..."
   - Should redirect to genre selection

3. **Error Cases**:
   - Invalid/expired link: Try accessing `/verify?code=invalid`
   - Missing email: Clear localStorage and try to verify

## Environment Configuration

Current setup uses **localhost**:
```javascript
url: 'http://localhost:3000/verify'
```

For production, update to your domain:
```javascript
url: 'https://yourdomain.com/verify'
```

## Database Integration (Optional)

To create user profiles after verification:
```javascript
// In Verify.jsx after successful verification
const createUserProfile = async (user) => {
  const userRef = doc(db, 'users', user.uid);
  await setDoc(userRef, {
    email: user.email,
    createdAt: new Date(),
    // Add other profile fields
  });
};
```

## Notes

- Email link sign-in doesn't create a password
- Users will always sign in via email link
- To enable password-based login, update signup to include password creation
- Email verification happens automatically via Firebase

## Troubleshooting

**Issue**: Email not received
- Check spam folder
- Verify email is correct
- Check Firebase email templates configuration
- Ensure SMTP is configured in Firebase

**Issue**: Link expired
- Links are valid for 24 hours by default
- User should sign up again

**Issue**: Redirect not working
- Check `/verify` route in AppRoutes
- Ensure window.location is available
- Check browser console for errors
