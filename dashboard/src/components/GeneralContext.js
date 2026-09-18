import React, { useCallback, useMemo, useState } from "react";
import BuyActionWindow from "./BuyActionWindow";

const GeneralContext = React.createContext({
  openOrderWindow: () => {},
  closeOrderWindow: () => {},
  refreshKey: 0,
  refreshData: () => {},
});

export const GeneralContextProvider = ({ children }) => {
  const [orderWindow, setOrderWindow] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshData = useCallback(() => setRefreshKey((value) => value + 1), []);
  const openOrderWindow = useCallback((stock, mode = "BUY") => {
    setOrderWindow({
      uid: typeof stock === "string" ? stock : stock.name,
      price: typeof stock === "object" ? Number(stock.price) : 0,
      mode,
    });
  }, []);
  const closeOrderWindow = useCallback(() => setOrderWindow(null), []);

  const value = useMemo(
    () => ({ openOrderWindow, closeOrderWindow, refreshKey, refreshData }),
    [openOrderWindow, closeOrderWindow, refreshKey, refreshData]
  );

  return (
    <GeneralContext.Provider value={value}>
      {children}
      {orderWindow && (
        <BuyActionWindow
          uid={orderWindow.uid}
          defaultPrice={orderWindow.price}
          initialMode={orderWindow.mode}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
