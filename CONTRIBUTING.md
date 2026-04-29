# Contributing to Medverse AI

Thank you for your interest in contributing to Medverse AI! 🎉

## 📋 Code of Conduct

Please be respectful and constructive in all interactions.

## 🚀 Getting Started

1. **Fork** the repository
2. **Clone** your fork locally
3. **Set up** backend and frontend (see [README.md](README.md))
4. **Create a branch** from `main` for your changes

## 🔧 Development Workflow

### Branch Naming
```
feature/your-feature-name
fix/issue-description
docs/what-you-updated
```

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
```
feat: Add new symptom keywords for ENT
fix: Resolve double-booking race condition
docs: Update API reference for scheduler
style: Fix button alignment on mobile
```

### Pull Request Process
1. Update the README.md if your change affects the public API
2. Ensure the app builds without errors (`npm run build`)
3. Ensure the backend starts without errors (`python app.py`)
4. Write a clear PR description explaining **what** and **why**

## 🏗️ Project Structure

| Directory | Purpose |
|-----------|---------|
| `Backend/features/` | Each AI feature as a self-contained module |
| `Backend/models/` | ML model files (not tracked in git) |
| `Backend/utils/` | Shared preprocessing utilities |
| `Frontend-Medverse-ai/src/pages/` | Page-level React components |
| `Frontend-Medverse-ai/src/components/` | Reusable UI components |
| `Frontend-Medverse-ai/src/services/` | API client functions |

## ⚠️ Important Guidelines

- **Never commit** `.env` files containing API keys
- **Never commit** ML model files (`.h5`, `.pkl`, `.pth`) — add to `.gitignore`
- Keep backend features modular — one file per feature under `features/`
- Use `api.js` for all backend API calls in the frontend
- Test both frontend and backend before submitting a PR

## 🐛 Reporting Bugs

Open a GitHub Issue with:
1. Steps to reproduce
2. Expected vs actual behavior
3. Screenshots if applicable
4. Browser / OS / Python version

## 💡 Suggesting Features

Open a GitHub Issue with:
1. Feature description
2. Use case / motivation
3. Any design mockups or references

---

Thank you for helping make healthcare AI more accessible! 🏥
