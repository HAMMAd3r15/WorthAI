"use client"

import { motion } from "framer-motion"
import { Trash2, ShieldAlert } from "lucide-react"

export function DeleteAccountModal({ 
  onClose, 
  onConfirm 
}: { 
  onClose: () => void, 
  onConfirm: () => void 
}) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-[420px] bg-[#111827] border border-white/10 rounded-2xl overflow-hidden shadow-[0_24px_80px_-12px_rgba(0,0,0,0.8)]"
      >
        {/* Danger accent bar */}
        <div className="h-1 w-full bg-gradient-to-r from-red-600 via-red-500 to-red-600" />
        
        <div className="p-8">
          <div className="flex items-start gap-4 mb-5">
            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center shrink-0 mt-0.5">
              <ShieldAlert className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h3 className="text-[17px] font-bold text-white tracking-tight mb-1">Delete Account</h3>
              <p className="text-[13px] text-white/40 leading-relaxed">
                This action is irreversible. All financial data, chat history, and account settings will be permanently removed from our servers.
              </p>
            </div>
          </div>

          {/* Warning box */}
          <div className="bg-red-500/5 border border-red-500/10 rounded-xl px-4 py-3 mb-6">
            <div className="flex items-center gap-2">
              <Trash2 className="w-3.5 h-3.5 text-red-400/70 shrink-0" />
              <p className="text-[11px] text-red-400/70 font-medium">
                Financial profiles, AI conversations, and reports will be erased.
              </p>
            </div>
          </div>

          <div className="h-px bg-white/5 mb-6" />

          <div className="flex gap-3 justify-end">
            <motion.button 
              whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-5 h-11 rounded-xl bg-white/5 text-white/70 text-[12px] font-semibold tracking-wide transition-all border border-white/5 hover:text-white"
            >
              Cancel
            </motion.button>
            <motion.button 
              whileHover={{ backgroundColor: "#b91c1c" }}
              whileTap={{ scale: 0.98 }}
              onClick={onConfirm}
              className="px-5 h-11 rounded-xl bg-red-600/90 text-white text-[12px] font-semibold tracking-wide transition-all"
            >
              Delete Account
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
