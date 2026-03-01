# CredFlow (Cred-Verify)

CredFlow is a role-based credential verification demo app built with React + TypeScript + Vite.

It simulates:
- University issuing student credentials
- Student viewing and managing their credentials
- Merchant verifying credentials (manual ID + QR scanner flow)
- Mock blockchain anchoring and verification status

## Features
- Role-based login for `university`, `student`, and `merchant`
- Credential issuance, edit, revoke, and delete flows
- QR code generation for credentials
- Merchant QR scanner verification (browser camera)
- Mock zero-knowledge-proof style verification token generation
- Dedicated **My Credentials** page for signed-in users

## Tech Stack
- React 18
- TypeScript
- Vite
- React Router
- Tailwind CSS

## Clone and Run

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Cred-Verify
```

### 2. Install dependencies
```bash
npm install
```

### 3. Start development server
```bash
npm run dev
```

Open the URL shown in terminal (usually `http://localhost:5173` or next available port).

### 4. Build for production
```bash
npm run build
```

### 5. Preview production build
```bash
npm run preview
```

## Example Login Credentials

### University
- Email: `Admin@gmail.com`
- Password: `admin@123`

### Merchant
- Email: `merchant@verify.com`
- Password: `merchant123`

### Students
- Email: `alice@student.com`
- Password: `student123`

- Email: `bob@student.com`
- Password: `student123`

- Email: `student@gmail.com`
- Password: `student@123`

## Notes
- Merchant signup is also available from merchant login flow.
- Student accounts can also be created when a university issues a new credential with student email/password.
- QR camera scanning support depends on browser capabilities (`BarcodeDetector` + camera permissions).
