import { useState, useEffect, useCallback } from 'react';

export interface JobLog {
  id: number;
  timestamp: string;
  bookmarkId: number;
  url: string;
  status: 'processing' | 'success' | 'error';
  message: string;
}

export function useJobs() {
  const [logs, setLogs] = useState<JobLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    try {
      // @ts-ignore
      const data = await window.electronAPI.jobs.getEnrichmentLogs();
      setLogs(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
    
    // @ts-ignore
    const unsubscribe = window.electronAPI.events?.onJobsUpdated(() => {
      fetchLogs();
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [fetchLogs]);

  return { logs, loading, refresh: fetchLogs };
}
