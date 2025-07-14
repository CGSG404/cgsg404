"use client";
import React, { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { type Review } from "@/components/ReviewDetail/types";
import { Star, Gift, Wallet, Shield, MessageSquare, Clock } from "lucide-react";

type Props = {
  review: Review;
};

const navItems = [
  { id: "overview", label: "Overview" },
  { id: "bonus", label: "Bonus & Rewards" },
  { id: "rating", label: "Rating Expert" },
  { id: "discussion", label: "Player Feedback" },
  { id: "payments", label: "Payment Methods" },
  { id: "safety", label: "Safety & Trust" },
];

import { supabase } from "@/lib/supabaseClient";

interface Comment {
  name: string;
  text: string;
  date: number; // timestamp
}

export default function CasinoTabs({ review }: Props) {
  const [active, setActive] = useState<string>("overview");
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState<string>("");
  const [text, setText] = useState<string>("");

  // load comments from Supabase berdasarkan slug
  useEffect(() => {
    let ignore = false;
    (async () => {
      const { data, error } = await supabase
        .from("comments")
        .select("name, text, created_at")
        .eq("slug", review.slug)
        .order("created_at", { ascending: false });
      if (!ignore && data) {
        setComments(
          data.map((c) => ({
            name: c.name,
            text: c.text,
            date: new Date(c.created_at).getTime(),
          }))
        );
      }
      if (error) console.error("Load comments error", error);
    })();
    return () => {
      ignore = true;
    };
  }, [review.slug]);

  const MAX_CHARS = 500;
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    if (text.trim().length > MAX_CHARS) return;
    (async () => {
      const { data, error } = await supabase
        .from("comments")
        .insert({ slug: review.slug, name: name.trim(), text: text.trim() })
        .select("name, text, created_at")
        .single();
      if (error) {
        console.error("Insert comment error", error);
        return;
      }
      if (data) {
        const newComment: Comment = {
          name: data.name,
          text: data.text,
          date: new Date(data.created_at).getTime(),
        };
        setComments((prev) => [newComment, ...prev]);
      }
    })();
    setName("");
    setText("");
  };

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-6 text-gray-900 dark:text-gray-100">
      {/* Header Card */}
      <div className="flex flex-col items-center gap-4 text-center bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm p-8">
        <div className="relative h-28 w-28">
          <Image src={review.logo} alt={review.name} fill className="object-contain" priority />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-emerald-900">{review.name}</h1>
        <div className="flex items-center gap-2 mt-2">
          <Star className="h-5 w-5 text-emerald-600" />
          <span className="text-emerald-600 font-bold text-2xl">
            {review.rating}
            <span className="text-gray-400">/10</span>
          </span>
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex flex-nowrap whitespace-nowrap justify-start gap-2 overflow-x-auto bg-white dark:bg-slate-800 rounded-lg p-2 shadow-sm">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActive(item.id)}
            className={`rounded px-4 py-2 text-sm font-medium transition-colors duration-200 border
              ${active === item.id ? "bg-emerald-600 text-white border-emerald-600" : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"}`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Content */}
      <section className="space-y-6">
        {active === "overview" && (
          <div className="space-y-6">
            <p className="text-gray-600 text-lg">
              {review.description}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Gift className="h-6 w-6 text-emerald-600" />
                  <span className="text-lg font-semibold">Bonus</span>
                </div>
                <p className="text-emerald-600 font-semibold text-xl">
                  {review.bonus}
                </p>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="h-6 w-6 text-emerald-600" />
                  <span className="text-lg font-semibold">Games</span>
                </div>
                <ul className="list-disc list-inside text-gray-600">
                  {review.games.map((game, index) => (
                    <li key={index}>{game}</li>
                  ))}
                </ul>
              </div>
              <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Wallet className="h-6 w-6 text-emerald-600" />
                  <span className="text-lg font-semibold">Payment Methods</span>
                </div>
                <ul className="list-disc list-inside text-gray-600">
                  {review.paymentMethods.map((method, index) => (
                    <li key={index}>{method}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
        {active === "bonus" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-emerald-900">Welcome Bonus</h2>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm">
              <div className="text-emerald-600 font-bold text-3xl mb-4">
                {review.bonus}
              </div>
              <p className="text-gray-600 text-lg">
                Claim your bonus by creating an account and making your first deposit.
              </p>
              <div className="mt-4">
                <h3 className="font-semibold mb-2">Bonus Terms:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>Available for new players only</li>
                  <li>Minimum deposit applies</li>
                  <li>Wagering requirements apply</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        {active === "rating" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-emerald-900">Expert Rating</h2>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-emerald-600 font-bold text-3xl">
                  {review.rating}
                </span>
                <span className="text-gray-400">/10</span>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Rating Breakdown:</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span>Games & Entertainment</span>
                    <span className="text-emerald-600">9.5/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Customer Support</span>
                    <span className="text-emerald-600">9.2/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Payment Processing</span>
                    <span className="text-emerald-600">9.0/10</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Website & Mobile App</span>
                    <span className="text-emerald-600">9.3/10</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {active === "discussion" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-emerald-900">Player Feedback</h2>
            {/* Comment form */}
            
            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-sm">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea
                  className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-emerald-600 focus:ring-emerald-600"
                  rows={4}
                  maxLength={MAX_CHARS}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Write your comment (max 500 characters)"
                  required
                />
                <div className="text-xs text-right text-gray-400">{text.length}/{MAX_CHARS}</div>
              </div>
              <button
                type="submit"
                className="bg-emerald-600 text-white px-4 py-2 rounded font-medium hover:bg-emerald-700 transition"
              >
                Submit Comment
              </button>
            </form>

            {/* Comments list */}
            <div className="space-y-4">
              {comments.length === 0 && (
                <p className="text-sm text-gray-500 italic">No comments yet.</p>
              )}
              {comments.map((c, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm border border-slate-100 dark:border-slate-800"
                >
                  <div className="h-10 w-10 flex-shrink-0 rounded-full bg-emerald-600 flex items-center justify-center text-white font-semibold">
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                    <span className="font-medium">{c.name}</span>
                    <span className="text-gray-400 text-xs">
                      {new Date(c.date).toLocaleDateString()}
                    </span>
                          <div className="flex items-center justify-between">
                          <span className="font-medium text-emerald-900 dark:text-emerald-400">{c.name}</span>
                          <span className="text-xs text-gray-400">
                            {new Date(c.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="mt-1 text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap">{c.text}</p>
                      </div>
                </div>
              ))}
            </div>
          </div>

        )}
        {active === "payments" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-emerald-900">Payment Methods</h2>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {review.paymentMethods.map((method, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Wallet className="h-5 w-5 text-emerald-600" />
                      <span className="font-medium">{method}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                      Available for deposits and withdrawals
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        {active === "safety" && (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-emerald-900">Safety & Trust</h2>
            <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-6 w-6 text-emerald-600" />
                <span className="text-lg font-semibold">Safety Index</span>
              </div>
              <div className="text-emerald-600 font-bold text-3xl mb-4">
                {review.safetyIndex}
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold">Security Features:</h3>
                <ul className="list-disc list-inside text-gray-600">
                  <li>SSL Encryption</li>
                  <li>Verified Licenses</li>
                  <li>Regular Audits</li>
                  <li>Secure Payment Processing</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
