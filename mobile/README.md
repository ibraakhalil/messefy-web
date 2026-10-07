# Messefy Mobile (Tauri 2.0 + React + Vite + Bun)

একটি আধুনিক, দ্রুত ও নির্ভরযোগ্য মেস ম্যানেজমেন্ট মোবাইল অ্যাপ্লিকেশন। এটি **Tauri 2.0 (Rust)** ইঞ্জিন এবং **Vite + React (TypeScript) + Tailwind CSS** এর সাহায্যে তৈরি করা হয়েছে।

---

## 🛠️ টেকনোলজি স্ট্যাক

- **রানটাইম ও প্যাকেজ ম্যানেজার:** [Bun](https://bun.sh)
- **নেটিভ কোর:** Tauri 2.0 (Rust)
- **ফ্রন্টএন্ড:** React 19 + TypeScript + Vite 8
- **স্টাইলিং:** Tailwind CSS v4 (Messefy এর এমারেল্ড কালার প্যালেট)
- **আইকন:** Lucide React

---

## 🚀 রান করার নির্দেশিকা

### ১. ব্রাউজার প্রিভিউ (সুপার ফাস্ট হট-রিলোড)
মোবাইল ভিউ ব্রাউজারে দ্রুত ডেভেলপ ও টেস্ট করতে:
```bash
# প্রজেক্ট রুট থেকে
bun run mobile:dev

# অথবা mobile ডিরেক্টরি থেকে
cd mobile
bun run dev
```
এটি `http://localhost:5173` ঠিকানায় ওপেন হবে। ব্রাউজারের DevTools থেকে Mobile View (e.g., iPhone/Pixel) সিলেক্ট করে টেস্ট করতে পারেন।

---

### ২. Tauri ডেস্কটপ উইন্ডো প্রিভিউ (নেটিভ ওয়েবভিউ টেস্ট)
```bash
# প্রজেক্ট রুট থেকে
bun run mobile:tauri

# অথবা mobile ডিরেক্টরি থেকে
cd mobile
bun run tauri:dev
```

---

### ৩. Android মোবাইল এমুলেটর / ডিভাইসে রান
অ্যান্ড্রয়েড বিল্ডের জন্য Android Studio, Android SDK ও NDK ইন্সটল থাকতে হবে:
```bash
cd mobile

# প্রথমবার অ্যান্ড্রয়েড প্রজেক্ট জেনারেট করতে:
bun x tauri android init

# সংযুক্ত অ্যান্ড্রয়েড ডিভাইস বা এমুলেটরে রান করতে:
bun run tauri:android
```

---

## 📂 ফোল্ডার স্ট্রাকচার

- `src-tauri/`: Rust ইঞ্জিন, প্ল্যাটফর্ম সেটিংস (`tauri.conf.json`), আইকন ও মোবাইল ক্যাপাবিলিটিস।
- `src/components/home/`:
  - `MessHeader.tsx`: মেসের নাম, বর্তমান মাস, থিম সুইচ এবং নোটিফিকেশন।
  - `PeriodSummaryCard.tsx`: মিল রেট, মোট মিল, মোট খরচের মূল সামারি কার্ড।
  - `MyStatusCard.tsx`: ব্যবহারকারীর নিজের ব্যালেন্স ও জমা।
  - `TodayMealCard.tsx`: আজকের দুপুর/রাতের মিল কাউন্টার ও টগল।
  - `QuickActions.tsx`: দ্রুত এন্ট্রি বাটন (মিল, জমা, খরচ)।
  - `RecentActivityList.tsx`: সাম্প্রতিক খরচের তালিকা।
- `src/components/navigation/`:
  - `BottomNavbar.tsx`: টাচ-ফ্রেন্ডলি মোবাইল বটম বার।
- `src/types/`: মেস ডাটা মডেল ও টাইপ ডেফিনিশন।
- `src/lib/`: ইউটিলিটি ফাংশন (`formatCurrency`, `cn`)।
