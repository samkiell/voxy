"use client";

import React, { useState, useRef } from 'react';
import { Send, Paperclip, X, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { VoiceButton } from '@/components/chat/VoiceButton';

const VOICE_STATUS_CONFIG = {
  recording: { label: 'Recording...', color: 'bg-red-500', pulse: true },
  processing: { label: 'Processing...', color: 'bg-amber-500', pulse: false },
  speaking: { label: 'AI is speaking...', color: 'bg-[#00D18F]', pulse: true },
};

const MessageInput = ({ 
  onSendMessage, 
  onAudioReady, 
  onTyping, 
  onFileUpload,
  isLoading, 
  voiceStatus,
  placeholder = "Write a message..." 
}) => {
  const [content, setContent] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    // File upload flow
    if (selectedFile && onFileUpload) {
      onFileUpload(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (content.trim() && !isLoading) {
      onSendMessage(content.trim());
      setContent('');
      onTyping?.(false);
      if (textareaRef.current) textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e) => {
    const target = e.target;
    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 128)}px`;
    setContent(target.value);

    if (onTyping) {
      onTyping(target.value.trim().length > 0);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const statusConfig = voiceStatus ? VOICE_STATUS_CONFIG[voiceStatus] : null;

  return (
    <div className="px-2 sm:px-4 py-2 sm:py-4 md:px-10 md:py-6 bg-black border-t border-white/[0.03] w-full shrink-0">
      {/* Voice Status Banner */}
      {statusConfig && (
        <div className="max-w-5xl mx-auto mb-2">
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-widest ${
            voiceStatus === 'recording' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
            voiceStatus === 'processing' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
            'bg-[#00D18F]/10 text-[#00D18F] border border-[#00D18F]/20'
          }`}>
            <div className={`w-2 h-2 rounded-full ${statusConfig.color} ${statusConfig.pulse ? 'animate-pulse' : 'animate-spin'}`} />
            <span className="text-[10px]">{statusConfig.label}</span>
          </div>
        </div>
      )}

      {/* Selected File Chip */}
      {selectedFile && (
        <div className="max-w-5xl mx-auto mb-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-300">
            <Paperclip className="size-3 text-[#00D18F]" />
            <span className="truncate max-w-[200px]">{selectedFile.name}</span>
            <button onClick={removeFile} className="text-zinc-500 hover:text-white transition-colors">
              <X className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto flex items-end gap-2 sm:gap-3">
        {/* Input Container */}
        <div className="flex-1 flex items-end gap-1 bg-white/[0.02] border border-white/[0.05] rounded-2xl sm:rounded-[2rem] p-1 sm:p-2 focus-within:ring-4 focus-within:ring-[#00D18F]/5 focus-within:border-[#00D18F]/30 transition-all duration-500 shadow-2xl">
          {/* File Upload Button */}
          <Button 
            type="button" 
            variant="ghost" 
            size="icon" 
            onClick={() => fileInputRef.current?.click()}
            className="text-zinc-500 hover:text-[#00D18F] h-10 w-10 sm:h-12 sm:w-12 rounded-xl sm:rounded-2xl transition-colors shrink-0"
          >
            <Paperclip className="size-5" />
          </Button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xlsx"
          />
          
          <textarea
            ref={textareaRef}
            value={content}
            onChange={handleInput}
            onKeyDown={handleKeyDown}
            onBlur={() => onTyping?.(false)}
            placeholder={placeholder}
            rows={1}
            className="flex-1 bg-transparent border-none outline-none py-2.5 sm:py-3 px-1 sm:px-2 text-[15px] sm:text-[16px] text-white placeholder:text-zinc-700 font-medium resize-none min-h-[40px] sm:min-h-[48px] leading-relaxed transition-all"
          />
        </div>
        
        {/* Send / Voice Button */}
        {content.trim() || selectedFile ? (
          <button
            type="submit"
            disabled={isLoading}
            className="size-10 sm:size-12 md:size-14 rounded-xl sm:rounded-2xl md:rounded-3xl font-bold flex items-center justify-center transition-all duration-500 shadow-xl active:scale-90 shrink-0 bg-[#00D18F] text-black hover:bg-emerald-400 hover:scale-105 shadow-[#00D18F]/20"
          >
            <Send className="size-5 sm:size-6 translate-x-0.5 -translate-y-0.5" strokeWidth={3} />
          </button>
        ) : (
          <VoiceButton onAudioReady={onAudioReady} isLoading={isLoading} />
        )}
      </form>
    </div>
  );
};

export default MessageInput;
