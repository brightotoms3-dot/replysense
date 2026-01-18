'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Wand2,
  Loader2,
  Sparkles,
  RotateCcw,
  Lightbulb,
} from 'lucide-react';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

import {
  RIZZ_VIBES,
  RIZZ_SCENARIOS,
  RizzAssistantFormSchema,
  type RizzAssistantFormValues,
  type RizzAssistantResults,
} from '@/lib/types';
import { generateRizz } from '../actions';
import { useUsageLimit } from '@/hooks/use-usage-limit';
import PaywallDialog from '@/components/paywall-dialog';
import { useToast } from '@/hooks/use-toast';

export default function RizzAssistantPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<RizzAssistantResults | null>(null);
  const { toast } = useToast();
  const { isLimitReached, increment, resetUsage } = useUsageLimit();
  const [showLimitDialog, setShowLimitDialog] = useState(false);

  const form = useForm<RizzAssistantFormValues>({
    resolver: zodResolver(RizzAssistantFormSchema),
    defaultValues: {
      lastMessage: '',
      conversationContext: '',
      vibe: 'Witty',
      scenario: 'Dating App',
    },
  });

  const onSubmit = async (values: RizzAssistantFormValues) => {
    if (isLimitReached()) {
      setShowLimitDialog(true);
      return;
    }

    setIsLoading(true);
    setResults(null);

    try {
      const response = await generateRizz(values);
      if (response) {
        setResults(response);
        increment();
      } else {
        throw new Error('Received an empty response from the server.');
      }
    } catch (err) {
      toast({
        title: 'Generation Failed',
        description: "Sorry, we couldn't generate lines. Please try again.",
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    resetUsage();
    setShowLimitDialog(false);
    toast({
      title: 'Thank you for your support!',
      description: 'Your daily limit has been reset.',
    });
  };
  
  const handleStartOver = () => {
    setResults(null);
    form.reset();
  };

  return (
    <>
      <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Rizz Assistant</h1>
          <p className="text-muted-foreground">
            Your personal AI wingman for charming replies.
          </p>
        </div>
        
        {!results && !isLoading && (
            <Card>
            <CardContent className="p-6">
                <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                >
                    <FormField
                      control={form.control}
                      name="lastMessage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Their Last Message</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., 'Not much, just chilling. U?'"
                              className="min-h-[100px] resize-y text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="vibe"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Desired Vibe</FormLabel>
                                <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                >
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select a vibe" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {RIZZ_VIBES.map(vibe => (
                                    <SelectItem key={vibe} value={vibe}>
                                        {vibe}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="scenario"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel>Scenario</FormLabel>
                                <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                >
                                <FormControl>
                                    <SelectTrigger>
                                    <SelectValue placeholder="Select a scenario" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {RIZZ_SCENARIOS.map(scenario => (
                                    <SelectItem key={scenario} value={scenario}>
                                        {scenario}
                                    </SelectItem>
                                    ))}
                                </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="conversationContext"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Conversation Context (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="e.g., 'We matched on Hinge, talked about dogs.'"
                              className="min-h-[80px] resize-y text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                    type="submit"
                    className="w-full text-lg py-6"
                    size="lg"
                    disabled={isLoading}
                    >
                    {isLoading ? (
                        <>
                        <Loader2 className="mr-2 animate-spin" />
                        Generating...
                        </>
                    ) : (
                        <>
                        <Wand2 className="mr-2" />
                        Generate Lines
                        </>
                    )}
                    </Button>
                </form>
                </Form>
            </CardContent>
            </Card>
        )}

        {isLoading && (
            <div className="flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in-0 duration-500">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">Generating Rizz...</h2>
                    <p className="text-muted-foreground">This should only take a moment.</p>
                </div>
            </div>
        )}

        {results && (
          <div className="space-y-6">
            <Card className="animate-in fade-in-0 duration-500">
                <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <Sparkles /> Your Lines
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-lg">{results.suggestion1}</p>
                    </div>
                     <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-lg">{results.suggestion2}</p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                        <Lightbulb className="h-6 w-6 text-primary" />
                        The Strategy
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-lg text-foreground/80">{results.explanation}</p>
                </CardContent>
            </Card>

            <Button variant="outline" onClick={handleStartOver} className="w-full">
                <RotateCcw className="mr-2" />
                Start Over
            </Button>
          </div>
        )}

        <p className="text-xs text-center text-muted-foreground">
          AI suggestions only. Always be respectful and use your best judgment.
        </p>
      </div>
      <PaywallDialog
        isOpen={showLimitDialog}
        onClose={() => setShowLimitDialog(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}
