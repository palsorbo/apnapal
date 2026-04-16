"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "../../../lib/api";
import { Credits, CreditTransaction, RechargePlan } from "@apnapal/types";
import { Skeleton } from "../../../components/Skeleton";

const PLANS: RechargePlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    credits: 50,
    price: 49,
    priceDisplay: '₹49'
  },
  {
    id: 'pro',
    name: 'Pro',
    credits: 150,
    price: 99,
    priceDisplay: '₹99'
  },
  {
    id: 'ultra',
    name: 'Ultra',
    credits: 400,
    price: 199,
    priceDisplay: '₹199'
  }
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function CreditsScreen() {
  const router = useRouter();
  const [credits, setCredits] = useState<Credits | null>(null);
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRechargeSheet, setShowRechargeSheet] = useState(false);
  const [recharging, setRecharging] = useState<string | null>(null);

  useEffect(() => {
    loadCreditsData();
  }, []);

  const loadCreditsData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [creditsData, transactionsData] = await Promise.all([
        api.getCredits(),
        api.getCreditTransactions(10)
      ]);
      setCredits(creditsData);
      setTransactions(transactionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load credits data");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreTransactions = async () => {
    try {
      setLoadingTransactions(true);
      const moreTransactions = await api.getCreditTransactions(50);
      setTransactions(moreTransactions);
    } catch (err) {
      console.error("Failed to load more transactions:", err);
    } finally {
      setLoadingTransactions(false);
    }
  };

  const handleRecharge = async (plan: RechargePlan) => {
    try {
      setRecharging(plan.id);
      setError(null);

      // Create Razorpay order
      const orderData = await api.createRechargeOrder(plan.id);

      // Load Razorpay script if not already loaded
      if (!window.Razorpay) {
        await loadRazorpayScript();
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Will need to add this env var
        amount: orderData.amount,
        currency: 'INR',
        name: 'ApnaPal',
        description: `Recharge ${plan.credits} credits`,
        order_id: orderData.order_id,
        handler: async (response: any) => {
          try {
            // Verify payment
            await api.verifyRecharge({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              credits: orderData.credits
            });

            // Refresh credits data
            await loadCreditsData();
            setShowRechargeSheet(false);
            alert(`Successfully recharged ${plan.credits} credits!`);
          } catch (err) {
            console.error("Payment verification failed:", err);
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          // Could prefill user details if available
        },
        theme: {
          color: '#E8610A' // Saffron color
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initiate recharge");
    } finally {
      setRecharging(null);
    }
  };

  const loadRazorpayScript = (): Promise<void> => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  };

  const formatTransactionAmount = (amount: number, type: string) => {
    const prefix = amount > 0 ? '+' : '';
    const color = amount > 0 ? 'var(--color-jade)' : 'var(--color-ink)';
    return (
      <span style={{ color, fontWeight: '600' }}>
        {prefix}{amount} credits
      </span>
    );
  };

  const formatTransactionType = (type: string) => {
    switch (type) {
      case 'recharge':
        return 'Recharge';
      case 'text_message':
        return 'Text Message';
      case 'voice_message':
        return 'Voice Message';
      case 'bonus':
        return 'Bonus';
      default:
        return type;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div
        className="min-h-screen-dvh"
        style={{
          background: "var(--color-cream)",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <header style={{ padding: "48px 16px 24px 16px" }}>
          <Skeleton width="40px" height="40px" borderRadius="50%" />
        </header>
        <main style={{ padding: "0 16px" }}>
          <Skeleton height="160px" borderRadius="20px" style={{ marginBottom: "24px" }} />
          <Skeleton width="140px" height="24px" style={{ marginBottom: "16px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Skeleton height="70px" borderRadius="14px" />
            <Skeleton height="70px" borderRadius="14px" />
            <Skeleton height="70px" borderRadius="14px" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen-dvh"
      style={{
        background: "var(--color-cream)",
        color: "var(--color-ink)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <header
        style={{
          padding: "48px 16px 24px 16px",
          display: "flex",
          alignItems: "center",
          gap: "16px",
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            background: "var(--color-surface)",
            border: "1px solid var(--color-ink-faint)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          ←
        </button>
        <h1
          className="font-fraunces"
          style={{
            fontSize: "var(--text-title-lg)",
            fontWeight: 400,
            margin: 0,
          }}
        >
          Credits
        </h1>
      </header>

      {/* Content */}
      <main style={{ padding: "0 16px 32px 16px" }}>
        {error && (
          <div
            style={{
              background: "var(--color-rose-light)",
              border: "1px solid var(--color-rose)",
              borderRadius: "14px",
              padding: "12px 16px",
              marginBottom: "20px",
            }}
          >
            <p
              style={{
                color: "#7A1035",
                fontSize: "var(--text-caption)",
                margin: 0,
              }}
            >
              {error}
            </p>
          </div>
        )}

        {/* Balance Card */}
        <div
          style={{
            background: "var(--color-surface)",
            borderRadius: "20px",
            border: "0.5px solid var(--color-ink-faint)",
            padding: "24px 20px",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "16px" }}>
            <div
              style={{
                fontSize: "var(--text-display)",
                fontWeight: "400",
                color: "var(--color-ink)",
                marginBottom: "4px",
              }}
            >
              {credits?.balance || 0}
            </div>
            <div
              style={{
                fontSize: "var(--text-body)",
                color: "var(--color-ink-mid)",
              }}
            >
              Credits Available
            </div>
          </div>

          <button
            onClick={() => setShowRechargeSheet(true)}
            style={{
              background: "var(--color-saffron)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "14px",
              padding: "14px 24px",
              fontSize: "15px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Recharge Credits
          </button>
        </div>

        {/* Transaction History */}
        <div style={{ marginBottom: "24px" }}>
          <h2
            style={{
              fontSize: "var(--text-title)",
              fontWeight: 500,
              margin: "0 0 16px 0",
              color: "var(--color-ink)",
            }}
          >
            Transaction History
          </h2>

          {transactions.length === 0 ? (
            <div
              style={{
                background: "var(--color-surface)",
                borderRadius: "14px",
                padding: "32px 24px",
                textAlign: "center",
                border: "0.5px solid var(--color-ink-faint)",
              }}
            >
              <div style={{ fontSize: "40px", marginBottom: "12px" }}>💳</div>
              <p style={{ color: "var(--color-ink-mid)", fontWeight: 500, marginBottom: "4px" }}>
                Abhi koi history nahi hai
              </p>
              <p style={{ color: "var(--color-ink-soft)", fontSize: "13px" }}>
                Jab aap credits use karenge, yahan dikhayi dega.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  style={{
                    background: "var(--color-surface)",
                    borderRadius: "14px",
                    padding: "16px",
                    border: "0.5px solid var(--color-ink-faint)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "var(--text-body)",
                        fontWeight: 500,
                        color: "var(--color-ink)",
                        marginBottom: "4px",
                      }}
                    >
                      {formatTransactionType(transaction.type)}
                    </div>
                    <div
                      style={{
                        fontSize: "var(--text-micro)",
                        color: "var(--color-ink-soft)",
                      }}
                    >
                      {formatDate(transaction.created_at)}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {formatTransactionAmount(transaction.amount, transaction.type)}
                  </div>
                </div>
              ))}

              {transactions.length >= 10 && (
                <button
                  onClick={loadMoreTransactions}
                  disabled={loadingTransactions}
                  style={{
                    background: "transparent",
                    border: "1px solid var(--color-ink-faint)",
                    color: "var(--color-ink-mid)",
                    borderRadius: "14px",
                    padding: "12px 16px",
                    fontSize: "14px",
                    cursor: loadingTransactions ? "not-allowed" : "pointer",
                    opacity: loadingTransactions ? 0.7 : 1,
                  }}
                >
                  {loadingTransactions ? "Loading..." : "Load More"}
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Recharge Bottom Sheet */}
      {showRechargeSheet && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "var(--color-overlay)",
            display: "flex",
            alignItems: "flex-end",
            zIndex: 1000,
          }}
          onClick={() => setShowRechargeSheet(false)}
        >
          <div
            style={{
              background: "var(--color-surface)",
              borderRadius: "24px 24px 0 0",
              padding: "20px 24px",
              paddingBottom: "calc(24px + env(safe-area-inset-bottom))",
              width: "100%",
              maxHeight: "80vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Handle bar */}
            <div
              style={{
                width: "40px",
                height: "4px",
                borderRadius: "2px",
                background: "var(--color-ink-faint)",
                margin: "0 auto 20px",
              }}
            />

            <h2
              className="font-fraunces"
              style={{
                fontSize: "var(--text-title-lg)",
                fontWeight: 400,
                margin: "0 0 20px 0",
                textAlign: "center",
              }}
            >
              Recharge Credits
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {PLANS.map((plan) => (
                <div
                  key={plan.id}
                  style={{
                    background: "var(--color-cream-dark)",
                    borderRadius: "16px",
                    padding: "20px",
                    border: "1px solid var(--color-ink-faint)",
                    position: "relative",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div
                        style={{
                          fontSize: "var(--text-title)",
                          fontWeight: 500,
                          color: "var(--color-ink)",
                          marginBottom: "4px",
                        }}
                      >
                        {plan.name}
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-body)",
                          color: "var(--color-ink-mid)",
                        }}
                      >
                        {plan.credits} credits
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div
                        style={{
                          fontSize: "var(--text-title)",
                          fontWeight: 600,
                          color: "var(--color-saffron)",
                          marginBottom: "4px",
                        }}
                      >
                        {plan.priceDisplay}
                      </div>
                      <div
                        style={{
                          fontSize: "var(--text-micro)",
                          color: "var(--color-ink-soft)",
                        }}
                      >
                        One-time payment
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRecharge(plan)}
                    disabled={recharging === plan.id}
                    style={{
                      width: "100%",
                      background: "var(--color-saffron)",
                      color: "#FFFFFF",
                      border: "none",
                      borderRadius: "12px",
                      padding: "12px 16px",
                      fontSize: "15px",
                      fontWeight: 600,
                      marginTop: "16px",
                      cursor: recharging === plan.id ? "not-allowed" : "pointer",
                      opacity: recharging === plan.id ? 0.7 : 1,
                    }}
                  >
                    {recharging === plan.id ? "Processing..." : `Buy ${plan.name}`}
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowRechargeSheet(false)}
              style={{
                width: "100%",
                background: "transparent",
                color: "var(--color-ink-mid)",
                border: "1px solid var(--color-ink-faint)",
                borderRadius: "14px",
                padding: "12px 16px",
                fontSize: "15px",
                fontWeight: 500,
                marginTop: "16px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}