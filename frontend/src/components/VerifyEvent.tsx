import { useState } from "react"
import axios from "axios"
import { CheckCircle2, AlertCircle, AlertTriangle, Loader2 } from "lucide-react"

const VerifyEvent = () => {
  const [eventId, setEventId] = useState(101)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async () => {
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const start = Date.now()
      const res = await axios.post("http://localhost:8000/api/verify-event-supply", { eventId })
      const latency = Date.now() - start
      setResult({ ...res.data, latency })
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = () => {
    if (!result) return ""
    if (result.verification_status === "SYNC_SUCCESS") return "from-emerald-500/10 to-emerald-600/10 border-emerald-200"
    if (result.verification_status === "WEB3_SYNC_LAG") return "from-amber-500/10 to-amber-600/10 border-amber-200"
    return "from-red-500/10 to-red-600/10 border-red-200"
  }

  const getStatusBadgeColor = () => {
    if (!result) return ""
    if (result.verification_status === "SYNC_SUCCESS") return "bg-emerald-100 text-emerald-700"
    if (result.verification_status === "WEB3_SYNC_LAG") return "bg-amber-100 text-amber-700"
    return "bg-red-100 text-red-700"
  }

  const getStatusIcon = () => {
    if (!result) return null
    if (result.verification_status === "SYNC_SUCCESS") return <CheckCircle2 className="w-5 h-5 text-emerald-600" />
    if (result.verification_status === "WEB3_SYNC_LAG") return <AlertTriangle className="w-5 h-5 text-amber-600" />
    return <AlertCircle className="w-5 h-5 text-red-600" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-2">Event Verifier</h1>
          <p className="text-slate-400">Verify supply chain integrity in real-time</p>
        </div>

        {/* Main Card */}
        <div className="bg-slate-800 backdrop-blur border border-slate-700 rounded-2xl p-8 shadow-2xl">
          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-300 mb-3">Event ID</label>
            <input
              type="number"
              value={eventId}
              onChange={(e) => setEventId(Number(e.target.value))}
              disabled={loading}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter event ID"
            />
          </div>

          {/* Verify Button */}
          <button
            onClick={handleVerify}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 disabled:from-slate-600 disabled:to-slate-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 flex items-center justify-center gap-2 transform hover:scale-[1.02] active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify Supply</span>
                <span>→</span>
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-center text-red-700">
              <AlertCircle className="w-6 h-6 mx-auto mb-2" />
              <p className="font-medium">{error}</p>
            </div>
          )}

          {/* Loading Info */}
          {loading && (
            <div className="mt-6 p-6 bg-blue-500/10 border border-blue-500/30 rounded-xl text-center">
              <div className="flex justify-center mb-3">
                <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
              <p className="text-blue-400 font-medium">Verifying event supply chain...</p>
              <p className="text-blue-300 text-sm mt-1">This may take a moment</p>
            </div>
          )}

          {/* Result Section */}
          {result && !loading && (
            <div className="mt-8 space-y-4">
              <div className={`bg-gradient-to-r ${getStatusColor()} border rounded-xl p-6`}>
                <div className="flex items-center gap-3 mb-4">
                  {getStatusIcon()}
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor()}`}>
                    {result.verification_status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-slate-400 text-xs font-medium mb-1">Max Tickets</p>
                    <p className="text-2xl font-bold text-white">{result.max_tickets}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-slate-400 text-xs font-medium mb-1">DB Sales</p>
                    <p className="text-2xl font-bold text-white">{result.db_sales_count}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-slate-400 text-xs font-medium mb-1">Blockchain Count</p>
                    <p className="text-2xl font-bold text-white">{result.blockchain_count}</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4">
                    <p className="text-slate-400 text-xs font-medium mb-1">Latency</p>
                    <p className="text-2xl font-bold text-white">{result.latency}ms</p>
                  </div>
                </div>
              </div>

              {/* New Verify Button */}
              <button
                onClick={() => {
                  setResult(null)
                  setEventId(101)
                  setError(null)
                }}
                className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200"
              >
                Verify Another Event
              </button>
            </div>
          )}
        </div>

        {/* Footer Info */}
        <p className="text-center text-slate-500 text-sm mt-6">Supply chain verification powered by blockchain</p>
      </div>
    </div>
  )
}

export default VerifyEvent
