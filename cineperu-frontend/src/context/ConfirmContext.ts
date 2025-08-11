import React from "react";

export interface ConfirmOptions {
  message: string;
  onConfirm: () => void;
  onCancel?: () => void;
}

export const ConfirmContext = React.createContext<{
  confirm: (options: ConfirmOptions) => void;
} | null>(null);

export const useConfirm = () => {
  const ctx = React.useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm debe usarse dentro de ConfirmProvider");
  return ctx.confirm;
};
