# 🚨 QUICK EMAIL FIX - 2 Minutes Setup

## The Problem
Your reservation system works perfectly, but emails aren't sending because the **Resend API key** is missing from Supabase.

## The Solution (2 steps, 2 minutes)

### Step 1: Get Resend API Key (1 minute)
1. Go to **[resend.com](https://resend.com)**
2. Click **"Sign Up"** (it's free)
3. Verify your email
4. Go to **"API Keys"** in dashboard
5. Click **"Create API Key"**
6. Copy the key (starts with `re_`)

### Step 2: Add to Supabase (1 minute)
1. Go to your **Supabase project dashboard**
2. Navigate to **Edge Functions** → **Settings**
3. Find **"Environment Variables"** section
4. Click **"Add new variable"**
5. Set:
   - **Name**: `RESEND_API_KEY`
   - **Value**: [paste your Resend API key]
6. Click **"Save"**

## Test It
1. Make a test reservation in your app
2. Check your email inbox
3. You should receive a beautiful confirmation email!

## What You Get
✅ **Professional emails** in customer's language (EN/FR/NL)  
✅ **Complete reservation details** with restaurant branding  
✅ **Automatic sending** for all future reservations  
✅ **Status-aware messaging** (confirmed vs pending)  

## Current Status
- 🟢 **Reservations**: Working perfectly
- 🟢 **Database**: All data saved
- 🟢 **App confirmations**: Working
- 🔴 **Emails**: Missing API key ← **Fix this now!**

## After Setup
All systems will be 🟢 **fully operational**!

---

**Need help?** The email system is already professionally built - you just need to add the API key to activate it.