'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCases } from '@/lib/casesStorage';

export default function EvidenceIntakePage() {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const queryCaseId = params.get('caseId');
      if (queryCaseId) {
        router.replace(`/cases/${queryCaseId}?addEvidence=true`);
      } else {
        const loadedCases = getCases();
        if (loadedCases.length > 0) {
          router.replace(`/cases/${loadedCases[0].id}?addEvidence=true`);
        } else {
          router.replace('/cases');
        }
      }
    }
  }, [router]);

  return null;
}
