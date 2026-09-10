# Setting Up Digital Notary Desk for Advocate Nileema Saranga on Windows

**Yes! Windows is the primary and official operating system for SecuGen fingerprint scanners and Indian legal/notary hardware.**

This guide explains how to run the app locally or host it on the web (Vercel, Netlify, or custom domain) while communicating seamlessly with the physical SecuGen USB fingerprint reader.

---

### Step 1: Install SecuGen Driver & WebAPI Service on Windows (5 minutes)

1. **Plug in the SecuGen Scanner**:
   * Insert your SecuGen Hamster Pro 20 (or Hamster IV / Plus) into any USB port.
   * Windows will automatically recognize the device.
2. **Download & Install SecuGen WebAPI Client**:
   * Download the official **SecuGen WebAPI Client for Windows** from [secugen.com/webapi](https://secugen.com/webapi/).
   * Run the installer as Administrator (`SGWebAPI_Setup.exe`).
   * This installs a silent Windows background service that automatically listens on `https://localhost:8000` and `https://127.0.0.1:8000`.
3. **One-Time Browser Trust for Localhost (Crucial for Web Hosting)**:
   * When opening from a hosted website (`https://...`), Chrome/Edge restricts calls to local ports until approved once.
   * Open `https://localhost:8000/SGIDDInfo` in Google Chrome or Microsoft Edge.
   * If Chrome shows *"Your connection is not private"*, click **Advanced → Proceed to localhost (unsafe)**.
   * You will see a small JSON response confirming the scanner is ready. Once done, all web pages can capture from SecuGen seamlessly!

---

### Step 2: Deployment & Usage Options

#### Option A: Hosted on the Web (e.g. Vercel, Netlify, Custom Domain)
* Run `npm run build` and deploy the `dist/` folder to Vercel, Netlify, or your server.
* When Mom opens the website (e.g. `https://notary.saranga.in` or `https://notary-app.vercel.app`) on her Windows laptop:
  - The client-side browser JavaScript makes an instant secure request to `https://localhost:8000/SGIFPCapture`.
  - The plugged-in SecuGen USB scanner lights up with its blue optical sensor.
  - The live fingerprint image (BMP Base64) is securely transferred directly into the Notary Certificate and Form XV Register!
  - No client data leaves the local machine.

#### Option B: Local Turnkey Launcher on Windows
* Copy the `notary` folder to Mom's Windows laptop.
* Double-click **`start-windows.bat`**.
* It launches the local server and opens Chrome directly to the desk.
* You can create a desktop shortcut named **"Adv. Nileema Saranga - Notary Desk"**.

---

### Step 3: Mom's Daily Notary Workflow

1. **Client Arrives**:
   * Mom selects the document type (e.g., *Rental Agreement*, *Affidavit*, or *Other Legal Document*).
   * For other deeds (e.g. *Gift Deed*, *Sale Deed*, *Will / मृत्युपत्र*), Mom types the exact name and it appears on the certificate, jurat, and register.
   * The statutory serial number (`NS-2026-XXXX`) automatically increments.
2. **Passport Photo**:
   * Clicks **"Take Photo"** → laptop camera turns on with oval face guide → clicks **"Snap Photo"**.
3. **SecuGen Thumb Impression**:
   * Clicks **"Scan Thumb"** → SecuGen sensor glows blue → client places thumb → crisp 500 DPI biometric print is captured and attached.
4. **Print & Physical Stamping**:
   * Clicks **"Generate & Print Certificate (A4)"** (`Ctrl+P`).
   * Clean, official certificate prints out with:
     - Adv. Nileema Saranga, Reg. No. 15960 / Govt. of India, Badlapur East office address.
     - Book No. (वही क्र.) and Page No. (पान क्र.).
     - Client's verified photo, biometric thumb scan, and identification details.
     - Strict statutory Jurat attestation clause mentioning the specific document name.
     - Clean, spacious notary signature area for Mom's brass seal, notary stamp, and wet-ink signature.
5. **Form XV Register**:
   * The entry is recorded under Rule 11(9) in the statutory 11-column register, ready for printout or CSV/Excel export.
