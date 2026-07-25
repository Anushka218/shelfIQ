import { createContext, useContext, useState } from "react";

const RegionContext = createContext();

export function RegionProvider({ children }) {
  const [region, setRegionState] = useState(
    localStorage.getItem("region") || "Lucknow"
  );

  const setRegion = (newRegion) => {
    setRegionState(newRegion);
    localStorage.setItem("region", newRegion);
  };

  return (
    <RegionContext.Provider
      value={{
        region,
        setRegion,
      }}
    >
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  return useContext(RegionContext);
}