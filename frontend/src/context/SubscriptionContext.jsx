import { createContext, useContext, useEffect, useState } from "react";
import { getMySubscription } from "../services/subscriptionService";
import { useAuth } from "./AuthContext";

const SubscriptionContext = createContext(null);

export function SubscriptionProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [subscription, setSubscription] = useState(null);

  const refreshSubscription = async (confirmedSubscription) => {
    if (!isAuthenticated) { setSubscription(null); return; }
    if (confirmedSubscription) {
      setSubscription(confirmedSubscription);
      return confirmedSubscription;
    }
    try {
      const { data } = await getMySubscription();
      setSubscription(data.subscription);
      return data.subscription;
    } catch {
      setSubscription(null);
      return null;
    }
  };

  useEffect(() => { refreshSubscription(); }, [isAuthenticated]);

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      isActive: !!subscription,
      refreshSubscription
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => useContext(SubscriptionContext);
