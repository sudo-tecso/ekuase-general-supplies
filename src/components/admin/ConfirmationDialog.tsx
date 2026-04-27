"use client";

import React from "react";
import { Modal } from "@/components/shared/Modal";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "warning" | "info";
  isLoading?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  isLoading = false,
}) => {
  const variantStyles = {
    danger: "bg-destructive text-white shadow-destructive/20 hover:shadow-destructive/40",
    warning: "bg-orange-500 text-white shadow-orange-500/20 hover:shadow-orange-500/40",
    info: "bg-accent text-white shadow-accent/20 hover:shadow-accent/40",
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-md">
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${variant === "danger" ? "bg-destructive/10" : "bg-accent/10"}`}>
          <AlertTriangle className={`w-8 h-8 ${variant === "danger" ? "text-destructive" : "text-accent"}`} />
        </div>
        
        <div className="space-y-2">
          <h3 className="text-xl font-black text-secondary">{title}</h3>
          <p className="text-sm font-medium text-muted-foreground">{description}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full pt-4">
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl text-sm font-bold text-secondary hover:bg-muted transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-6 py-3 rounded-xl text-sm font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg ${variantStyles[variant]}`}
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
