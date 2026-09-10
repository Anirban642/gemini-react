# 💬 Nexa AI

**Nexa AI** is an intelligent chatbot built with React and powered by Groq's Llama model. It delivers conversational intelligence for a variety of tasks, from answering questions to creative writing.

---

## 🚀 Features

- ✨ Groq API integration through a secure serverless proxy  
- 💡 Chat with smart, context-aware responses  
- ⏱️ Typing animation with real-time response formatting  
- 💻 Modern React UI with state-managed context  
- ⚡ Fully responsive and easy to customize  

---

## 🛠️ Tech Stack

- **React** (Frontend)  
- **Context API** (State management)  
- **Groq API** (Llama 3.3 70B)  
- **Vite** (Build tool)  
- **GitHub Actions** (CI/CD for deployment)

---

## 📦 Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/nexa-ai.git
cd nexa-ai
npm install
```

---

## 🔑 Configure the API

The browser never receives the Groq key. The `api/chat.js` Vercel function sends requests to Groq, and the key must be stored as a Vercel environment variable.

1. Import this repository into Vercel and deploy it.
2. In the Vercel project settings, add `GROQ_API` with your Groq API key.
3. Add `ALLOWED_ORIGIN` with the exact GitHub Pages URL, for example `https://yourusername.github.io`.
4. Redeploy the Vercel project.

For local development, create an ignored `.env` file for the Vercel function:

```env
GROQ_API=your_groq_api_key
ALLOWED_ORIGIN=http://localhost:5173
```

---

## 🧪 Run Locally

```bash
npm run dev
```

---

## 🚀 Deployment

This project uses GitHub Actions for auto-deployment to **GitHub Pages**. The frontend still needs the public URL of the Vercel function:

1. In the GitHub repository settings, add an Actions secret named `VITE_API_URL`.
2. Set its value to your Vercel endpoint, for example `https://your-project.vercel.app/api/chat`.
3. Push to the `main` branch. GitHub Actions will build and publish the frontend to `gh-pages`.

Never put `GROQ_API` in a `VITE_*` variable or commit it to the repository. Values prefixed with `VITE_` are intentionally included in the public browser bundle.

---

## 🧠 Credits

- [Google Generative AI](https://ai.google.dev/)  
- [Peaceiris GitHub Pages Action](https://github.com/peaceiris/actions-gh-pages)

---

## 📄 License

MIT License © 2025 Anirban Das
