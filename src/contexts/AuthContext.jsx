import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { authApi, getToken, clearToken } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const token = getToken();
    if (!token) {
      setUser(null);
      setProfile(null);
      setStats([]);
      setLoading(false);
      return null;
    }

    setLoading(true);
    try {
      const data = await authApi.me();
      setUser(data.user || null);
      setProfile(data.profile || null);
      setStats(data.stats || []);
      return data;
    } catch (err) {
      // token inválido o error de red
      try { clearToken(); } catch (_) {}
      setUser(null);
      setProfile(null);
      setStats([]);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Al montar, validar token y obtener usuario
    let mounted = true;
    (async () => {
      try {
        if (!mounted) return;
        await refresh();
      } catch (_) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, [refresh]);

  const login = useCallback(async ({ email, password }) => {
    const data = await authApi.login({ email, password });
    if (data?.user) {
      setUser(data.user);
      setProfile(data.profile || null);
      setStats(data.stats || []);
    }
    return data;
  }, []);

  const register = useCallback(async ({ username, email, password }) => {
    const data = await authApi.register({ username, email, password });
    if (data?.user) {
      setUser(data.user);
      setProfile(data.profile || null);
      setStats(data.stats || []);
    }
    return data;
  }, []);

  const logout = useCallback(() => {
    try { authApi.logout(); } catch (_) {}
    setUser(null);
    setProfile(null);
    setStats([]);
  }, []);

  useEffect(() => {
    const onUnauthorized = () => logout();
    window.addEventListener("rpglog:unauthorized", onUnauthorized);
    return () => window.removeEventListener("rpglog:unauthorized", onUnauthorized);
  }, [logout]);

  const updateProfile = useCallback(async (payload) => {
    const data = await authApi.updateProfile(payload);
    if (data?.user) setUser(data.user);
    return data;
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, stats, loading, login, register, logout, refresh, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

export default AuthContext;
