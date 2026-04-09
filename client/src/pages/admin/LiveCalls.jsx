import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import api from "../../services/api";

const socket = io("http://localhost:5000");

export default function LiveCalls() {
  const [calls, setCalls] = useState([]);
  const [selectedCall, setSelectedCall] = useState(null);

  useEffect(() => {
    fetchCalls();

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      socket.emit("join-admin-live-calls");
    });

    socket.on("live-call-update", (payload) => {
      console.log("LIVE CALL UPDATE:", payload);

      setCalls((prev) => {
        const exists = prev.find((c) => c.callId === payload.callId);

        if (payload.liveStatus === "ended") {
          return prev.filter((c) => c.callId !== payload.callId);
        }

        if (exists) {
          return prev.map((c) =>
            c.callId === payload.callId ? { ...c, ...payload } : c
          );
        }

        return [payload, ...prev];
      });

      setSelectedCall((prev) => {
        if (prev?.callId === payload.callId) {
          if (payload.liveStatus === "ended") return null;
          return { ...prev, ...payload };
        }
        return prev;
      });
    });

    return () => {
      socket.off("connect");
      socket.off("live-call-update");
    };
  }, []);

  const fetchCalls = async () => {
    try {
      const res = await api.get("/admin/live-calls/ongoing");
      setCalls(res.data.ongoingCalls || []);
    } catch (error) {
      console.error("Fetch live calls error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mb-6">
        <p className="text-sm font-semibold text-emerald-600 uppercase tracking-widest">
          Admin Monitor
        </p>
        <h1 className="text-3xl font-extrabold text-slate-900">
          Live Calls Ongoing
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <h2 className="font-semibold mb-4 text-slate-800">Active Calls</h2>

          <div className="space-y-3">
            {calls.length === 0 ? (
              <p className="text-sm text-slate-500">No live calls right now.</p>
            ) : (
              calls.map((call) => (
                <button
                  key={call.callId}
                  onClick={() => setSelectedCall(call)}
                  className={`w-full text-left border rounded-xl p-3 transition ${
                    selectedCall?.callId === call.callId
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  <p className="font-semibold text-slate-800">
                    {call.studentName || "Unknown Student"}
                  </p>
                  <p className="text-sm text-slate-500">
                    {call.phone || "No phone"}
                  </p>
                  <p className="text-xs text-emerald-600 mt-1">
                    ● {call.liveStatus || "ongoing"}
                  </p>
                </button>
              ))
            )}
          </div>
        </div>

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
          <h2 className="font-semibold mb-4 text-slate-800">Live Transcript</h2>

          {!selectedCall ? (
            <p className="text-sm text-slate-500">
              Select a live call to view transcript.
            </p>
          ) : (
            <>
              <div className="mb-4 pb-3 border-b border-slate-200">
                <p className="font-bold text-slate-800">
                  {selectedCall.studentName || "Unknown Student"}
                </p>
                <p className="text-sm text-slate-500">
                  {selectedCall.phone || "No phone"}
                </p>
              </div>

              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {(selectedCall.messages || []).map((msg, idx) => {
                  const isAI = msg.sender === "ai";

                  return (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl ${
                        isAI
                          ? "bg-slate-100 text-slate-700"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      <p className="text-xs font-bold uppercase mb-1">
                        {isAI ? "AI Counsellor" : "Student"}
                      </p>
                      <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}