'use client';

import { scanReceipt } from '@/actions/transactions';
import { Button } from '@/components/ui/button';
import useFetch from '@/hooks/use-fetch';
import { Camera } from 'lucide-react';
import { useRef } from 'react';

const {
  loading: scanReceiptLoading,
  fn: scanReceiptFn,
  data: scannedData,
} = useFetch(scanReceipt);

const handleReceiptScan = () => {
  //
};

const ReceiptScanner = ({ onScanComplete }) => {
  const fileInputRef = useRef();
  return (
    <div>
      <input
        type='file'
        ref={fileInputRef}
        className='hidden'
        accept='image/*'
        capture='environment'
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />
      <Button>
        {scanReceiptLoading ? (
          <></>
        ) : (
          <>
            <Camera className='mr-2 h-4 w-4' />
            <span>Scan Receipt with AI</span>
          </>
        )}
      </Button>
    </div>
  );
};

export default ReceiptScanner;
