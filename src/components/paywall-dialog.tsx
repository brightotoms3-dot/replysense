"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ExternalLink, PartyPopper, Wallet } from 'lucide-react';

interface PaywallDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: () => void;
}

const chipperCashLink = "https://chip.me/9714103949";

export default function PaywallDialog({ isOpen, onClose, onPaymentSuccess }: PaywallDialogProps) {
  const { toast } = useToast();
  const [paymentStep, setPaymentStep] = useState<'initial' | 'confirm'>('initial');

  const handlePayClick = () => {
    window.open(chipperCashLink, '_blank');
    setPaymentStep('confirm');
    toast({
      title: "You're halfway there!",
      description: "Complete the payment in the new tab, then confirm here.",
    });
  };

  const handleConfirmPayment = () => {
    onPaymentSuccess();
    setPaymentStep('initial'); // Reset for next time
  };
  
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose();
      // Reset the dialog state when it's closed
      setTimeout(() => setPaymentStep('initial'), 300);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        {paymentStep === 'initial' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl text-center">Out of replies 😅</DialogTitle>
              <DialogDescription className="text-center pt-2">
                Grab small credit and keep the convo flowing.
                <p className="text-xs text-muted-foreground mt-2">
                  Most users spend less than ₦500 total.
                </p>
              </DialogDescription>
            </DialogHeader>
            <Button onClick={handlePayClick} className="w-full py-6 text-lg">
              <Wallet className="mr-2" />
              Pay with Chipper Cash
            </Button>
          </>
        )}
        {paymentStep === 'confirm' && (
           <>
             <DialogHeader>
               <DialogTitle className="text-2xl text-center">Did you send it?</DialogTitle>
               <DialogDescription className="text-center pt-2">
                 Once you've sent the payment on Chipper Cash, click the button below to unlock your daily replies.
               </DialogDescription>
             </DialogHeader>
             <DialogFooter className="sm:justify-center">
               <Button onClick={handleConfirmPayment} className="w-full py-6 text-lg" variant="default">
                 <PartyPopper className="mr-2" />
                 Yes, I've Paid!
               </Button>
             </DialogFooter>
             <Button
                variant="link"
                className="text-xs text-muted-foreground mx-auto"
                onClick={() => window.open(chipperCashLink, '_blank')}
             >
                Re-open payment link <ExternalLink className="ml-1" />
             </Button>
           </>
        )}
      </DialogContent>
    </Dialog>
  );
}
