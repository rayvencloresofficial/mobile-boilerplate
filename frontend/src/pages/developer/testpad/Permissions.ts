import { useState, useEffect, useCallback } from "react";
import { getPermissionsApi } from "@/services/rbac.api";
import type { Permission } from "@/types/auth";

export interface SystemPermission {
  id: string;
  slug: string;
  module: string;
  description: string;
}

export interface UseBackendPermissionsResult {
  permissions: SystemPermission[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  modules: string[];
}

/**
 * Fetches the live permissions catalog dynamically from the backend PostgreSQL database.
 * No hardcoded permission fallback lists are used.
 */
export async function fetchBackendPermissions(): Promise<SystemPermission[]> {
  const rawPermissions: Permission[] = await getPermissionsApi();
  return rawPermissions.map((p) => ({
    id: p.id,
    slug: p.slug,
    module: p.module,
    description: p.description || "",
  }));
}

/**
 * React hook to consume live, dynamically-queried permissions directly from the backend API.
 */
export function useBackendPermissions(): UseBackendPermissionsResult {
  const [permissions, setPermissions] = useState<SystemPermission[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBackendPermissions();
      setPermissions(data);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to load permissions from backend.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    fetchBackendPermissions()
      .then((data) => {
        if (!ignore) {
          setPermissions(data);
          setError(null);
        }
      })
      .catch((err) => {
        if (!ignore) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to connect to backend permissions catalog.",
          );
        }
      })
      .finally(() => {
        if (!ignore) {
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const modules = Array.from(new Set(permissions.map((p) => p.module))).sort();

  return {
    permissions,
    loading,
    error,
    refetch,
    modules,
  };
}

export default useBackendPermissions;
