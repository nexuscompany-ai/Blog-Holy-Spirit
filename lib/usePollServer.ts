import { useEffect, useCallback, useRef } from 'react';

interface UsePollServerOptions {
  url: string;
  interval?: number; // em ms, padrão 5 segundos
  enabled?: boolean;
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook customizado para fazer polling de um endpoint
 * Útil para atualizar dados em tempo real do servidor
 */
export function usePollServer({
  url,
  interval = 5000,
  enabled = true,
  onSuccess,
  onError
}: UsePollServerOptions) {
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const poll = useCallback(async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      onSuccess?.(data);
    } catch (error) {
      const err = error instanceof Error ? error : new Error(String(error));
      onError?.(err);
    }
  }, [url, onSuccess, onError]);

  useEffect(() => {
    if (!enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Faz a primeira chamada imediatamente
    poll();

    // Depois faz as chamadas periódicas
    intervalRef.current = setInterval(poll, interval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [enabled, interval, poll]);

  return { poll };
}
