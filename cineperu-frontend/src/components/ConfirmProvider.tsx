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

export const ConfirmProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [options, setOptions] = React.useState<ConfirmOptions | null>(null);

  const confirm = (opts: ConfirmOptions) => setOptions(opts);
  const handleConfirm = () => {
    options?.onConfirm();
    setOptions(null);
  };
  const handleCancel = () => {
    options?.onCancel?.();
    setOptions(null);
  };

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {options && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", background: "rgba(0,0,0,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 3000
        }}>
          <div style={{ background: "#23243a", color: "#fff", borderRadius: 16, padding: 32, minWidth: 320, boxShadow: "0 4px 24px #0008" }}>
            <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 18 }}>{options.message}</div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
              <button onClick={handleCancel} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#444", color: "#fff", fontWeight: 500, cursor: "pointer" }}>Cancelar</button>
              <button onClick={handleConfirm} style={{ padding: "8px 18px", borderRadius: 8, border: "none", background: "#e50914", color: "#fff", fontWeight: 600, cursor: "pointer" }}>Aceptar</button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
