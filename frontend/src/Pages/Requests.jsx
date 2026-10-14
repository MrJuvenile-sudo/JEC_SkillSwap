import React, { useState, useEffect } from "react";
import API from "../services/api";
import LoadingSpinner from "../Components/LoadingSpinner";
import { Inbox, Send, CheckCircle2, XCircle, Clock, Repeat, ArrowRight, MessageSquare, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { get3DAvatarUrl } from "../utils/avatarUtils";

export default function Requests() {
  const [activeTab, setActiveTab] = useState("received"); // 'received' | 'sent'
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [notification, setNotification] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await API.get("/requests");
      if (res.data.success) {
        setReceivedRequests(res.data.received || []);
        setSentRequests(res.data.sent || []);
      }
    } catch (err) {
      console.error("Error loading swap requests:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (requestId, status) => {
    setActionLoading(requestId);
    try {
      const res = await API.put(`/requests/${requestId}/status`, { status });
      if (res.data.success) {
        if (status === "accepted") {
          setNotification("Proposal accepted! Your 1-on-1 Virtual Classroom is now active in Sessions!");
        } else {
          setNotification(res.data.message || `Proposal ${status} successfully!`);
        }
        fetchRequests();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update request");
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "accepted":
        return <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Accepted</span>;
      case "rejected":
        return <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> Declined</span>;
      case "cancelled":
        return <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-slate-100 text-slate-700 border border-slate-300 flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Cancelled</span>;
      default:
        return <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1"><Clock className="w-3.5 h-3.5 animate-pulse" /> Pending Response</span>;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold mb-2">
            <Inbox className="w-3.5 h-3.5 text-indigo-600" />
            <span>Exchange Proposals</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
            Swap Proposals
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Review received learning proposals or manage your outgoing requests.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center gap-1.5 shrink-0 self-start sm:self-center border border-slate-200/80">
          <button
            onClick={() => setActiveTab("received")}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === "received"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Inbox className="w-4 h-4" />
            <span>Received</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-100 text-indigo-800">
              {receivedRequests.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("sent")}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-2 ${
              activeTab === "sent"
                ? "bg-white text-indigo-700 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Sent Proposals</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700">
              {sentRequests.length}
            </span>
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-bold flex items-center justify-between shadow-xs">
          <span>{notification}</span>
          <div className="flex items-center gap-3 ml-4">
            {notification.includes("accepted") && (
              <Link
                to="/exchanges"
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-extrabold shadow-2xs transition-all flex items-center gap-1"
              >
                <span>Launch Room</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
            <button onClick={() => setNotification("")} className="text-emerald-600 font-bold">✕</button>
          </div>
        </div>
      )}

      {loading ? (
        <LoadingSpinner label="Loading swap proposals..." />
      ) : activeTab === "received" ? (
        /* RECEIVED REQUESTS */
        <div>
          {receivedRequests.length > 0 ? (
            <div className="space-y-4">
              {receivedRequests.map((req) => (
                <div key={req.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  <div className="flex items-start gap-4">
                    <img
                      src={req.requester_picture || get3DAvatarUrl("other", req.requester_name)}
                      alt={req.requester_name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20 shrink-0 shadow-sm"
                    />

                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-base font-extrabold text-slate-900">{req.requester_name}</h3>
                        {getStatusBadge(req.status)}
                      </div>

                      {/* Skill Exchange Pair Preview */}
                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                          Teaches You: <strong>{req.offered_skill_name}</strong>
                        </span>
                        <Repeat className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-800 rounded-xl border border-indigo-200">
                          Requests: <strong>{req.requested_skill_name}</strong>
                        </span>
                      </div>

                      {req.message && (
                        <p className="text-xs text-slate-600 italic bg-slate-50/80 p-3.5 rounded-2xl border border-slate-150/80 leading-relaxed">
                          "{req.message}"
                        </p>
                      )}

                      <p className="text-[11px] text-slate-400 font-medium">
                        Proposal received on {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                    {req.status === "pending" ? (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(req.id, "accepted")}
                          disabled={actionLoading === req.id}
                          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Accept Proposal
                        </button>

                        <button
                          onClick={() => handleUpdateStatus(req.id, "rejected")}
                          disabled={actionLoading === req.id}
                          className="px-4 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                        >
                          <XCircle className="w-4 h-4" />
                          Decline
                        </button>
                      </>
                    ) : req.status === "accepted" ? (
                      <Link
                        to="/exchanges"
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
                      >
                        <span>Open Session Room</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    ) : null}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto my-8 space-y-3 shadow-xs">
              <Inbox className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Incoming Proposals</h3>
              <p className="text-xs text-slate-500">When other swappers request an exchange with you, proposals will appear here.</p>
            </div>
          )}
        </div>
      ) : (
        /* SENT REQUESTS */
        <div>
          {sentRequests.length > 0 ? (
            <div className="space-y-4">
              {sentRequests.map((req) => (
                <div key={req.id} className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6">
                  
                  <div className="flex items-start gap-4">
                    <img
                      src={req.receiver_picture || get3DAvatarUrl("other", req.receiver_name)}
                      alt={req.receiver_name}
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/20 shrink-0 shadow-sm"
                    />

                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-base font-extrabold text-slate-900">To: {req.receiver_name}</h3>
                        {getStatusBadge(req.status)}
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
                          You Offer: <strong>{req.offered_skill_name}</strong>
                        </span>
                        <Repeat className="w-4 h-4 text-slate-400 shrink-0" />
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-800 rounded-xl border border-indigo-200">
                          You Request: <strong>{req.requested_skill_name}</strong>
                        </span>
                      </div>

                      {req.message && (
                        <p className="text-xs text-slate-600 italic bg-slate-50/80 p-3.5 rounded-2xl border border-slate-150/80 leading-relaxed">
                          "{req.message}"
                        </p>
                      )}

                      <p className="text-[11px] text-slate-400 font-medium">
                        Sent on {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 self-end md:self-center shrink-0">
                    {req.status === "pending" && (
                      <button
                        onClick={() => handleUpdateStatus(req.id, "cancelled")}
                        disabled={actionLoading === req.id}
                        className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                      >
                        Cancel Proposal
                      </button>
                    )}
                    {req.status === "accepted" && (
                      <Link
                        to="/exchanges"
                        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1.5"
                      >
                        <span>Open Session Room</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>

                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 max-w-md mx-auto my-8 space-y-3 shadow-xs">
              <Send className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-900">No Sent Proposals</h3>
              <p className="text-xs text-slate-500 mb-4">You haven't sent any skill exchange proposals yet.</p>
              <Link to="/explore" className="inline-block px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-md">
                Browse Swappers Directory
              </Link>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
