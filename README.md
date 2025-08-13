# NextShop - Production-Ready E-Commerce Platform

A full-featured, production-ready e-commerce application built with Next.js 14, TypeScript, Supabase, and Tailwind CSS.

## Features

- 🛍️ Complete shopping experience with product browsing, cart, and checkout
- 🔐 Authentication with email/password via Supabase Auth
- 👤 User profiles and order history
- 👨‍💼 Admin panel for product, category, and order management
- 📦 Real-time order updates
- 📧 Email notifications for order confirmations
- 🚀 Rate limiting and caching with Upstash Redis
- 💳 Cash on Delivery payment (extensible for other methods)
- 📱 Fully responsive and accessible design
- 🎨 Beautiful UI with shadcn/ui components

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Database/Auth**: Supabase (PostgreSQL)
- **Email**: Resend or Brevo
- **Caching/Rate Limiting**: Upstash Redis
- **Deployment**: Vercel

## Prerequisites

- Node.js 18+ and npm
- Supabase account (free tier)
- Upstash Redis account (free tier)
- Resend or Brevo account for emails (free tier)
- Vercel account for deployment (hobby plan)

## Local Development Setup

### 1. Clone and Install

```bash
git clone <repository-url>
cd nextjs-ecommerce
npm install