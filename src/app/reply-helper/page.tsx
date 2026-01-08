'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { AIResults, ReplyFormValues } from '@/lib/types';
import { ReplyFormSchema } from '@/lib/types';
import { generateReplies } from '../actions';
import { useUsageLimit } from '@/hooks/use-usage-limit';

import InputScreen from '@/components/input-screen';
import LoadingScreen from '@/components/loading-screen';
import ResultsScreen from '@/components/results-screen';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

type View = "input" | "loading" | "results";

export default function ReplyHelperPage() {
  const [view, setView] = useState<View>('input');
  const [results, setResults] = useState<AIResults | null>(null);
  const [lastInput, setLastInput] = useState<ReplyFormValues | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { isLimitReached, increment, count } = useUsageLimit();
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const { toast } = useToast();

  const form = useForm<ReplyFormValues>({
    resolver: zodResolver(ReplyFormSchema),
    defaultValues: {
      inputText: '',
      category: undefined,
    },
  });
  
  const handleStartOver = () => {
    form.reset();
    setResults(null);
    setLastInput(null);
    setView('input');
  };
  
  const fileToDataUri = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleSubmit = async (values: ReplyFormValues) => {
    if (isLimitReached()) {
      setShowLimitDialog(true);
      return;
    }

    setView('loading');
    setLastInput(values);
    
    let screenshotDataUri: string | undefined = undefined;
    if (values.screenshot) {
      try {
        screenshotDataUri = await fileToDataUri(values.screenshot);
      } catch (err) {
        setError('Failed to read the screenshot file.');
        setView('input');
        toast({
          title: 'Error',
          description: 'Could not process the uploaded screenshot. Please try again.',
          variant: 'destructive'
        });
        return;
      }
    }

    try {
      const response = await generateReplies({
        inputText: values.inputText,
        category: values.category,
        screenshotDataUri: screenshotDataUri,
      });
      if (response) {
        setResults(response);
        increment();
        setView('results');
        setError(null);
      } else {
        throw new Error("Received an empty response from the server.");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast({
        title: 'Generation Failed',
        description: "Sorry, we couldn't generate replies. Please try again.",
        variant: 'destructive'
      });
      setView('input');
    }
  };

  const handleRegenerate = () => {
    if (lastInput) {
      handleSubmit(lastInput);
    }
  };

  const renderView = () => {
    switch (view) {
      case 'input':
        return <InputScreen form={form} onSubmit={handleSubmit} />;
      case 'loading':
        return <LoadingScreen />;
      case 'results':
        return (
          results && (
            <ResultsScreen
              results={results}
              onRegenerate={handleRegenerate}
              onStartOver={handleStartOver}
              isRegenerateDisabled={isLimitReached()}
            />
          )
        );
      default:
        return <InputScreen form={form} onSubmit={handleSubmit} />;
    }
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto">
        {renderView()}
      </div>
      <AlertDialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Daily Limit Reached</AlertDialogTitle>
            <AlertDialogDescription>
              You have used your 3 free reply generations for today. Please come back tomorrow or consider upgrading for unlimited access.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction>Got it</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
