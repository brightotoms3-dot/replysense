"use client";

import { Copy, RefreshCw, Share2, Info } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import type { AIResults } from '@/lib/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface ResultsScreenProps {
  results: AIResults;
  onRegenerate: () => void;
  onStartOver: () => void;
  isRegenerateDisabled: boolean;
}

interface ReplyCardProps {
  title: string;
  content: string;
}

export default function ResultsScreen({
  results,
  onRegenerate,
  onStartOver,
  isRegenerateDisabled,
}: ResultsScreenProps) {
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard!',
      description: 'You can now paste the reply.',
    });
  };

  const handleShare = async () => {
    const shareText = `Suggested Replies from ReplySense:\n\nPolite: ${results.politeReply}\n\nConfident: ${results.confidentReply}\n\nNeutral: ${results.neutralReply}\n\nExplanation: ${results.explanation}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ReplySense Suggestions',
          text: shareText,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        // Fallback to copy if sharing fails
        handleCopy(shareText);
        toast({
          title: 'Sharing failed',
          description: "We've copied the results to your clipboard instead.",
        });
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      handleCopy(shareText);
    }
  };

  const ReplyCard = ({ title, content }: ReplyCardProps) => (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <span>{title}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCopy(content)}
            aria-label={`Copy ${title} reply`}
          >
            <Copy className="h-5 w-5" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg text-foreground/80">{content}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in-0 duration-500">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight">Here are your suggested replies</h2>
      </div>

      <div className="space-y-6">
        <ReplyCard title="Polite" content={results.politeReply} />
        <ReplyCard title="Confident" content={results.confidentReply} />
        <ReplyCard title="Neutral / Calm" content={results.neutralReply} />
      </div>

      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-primary">
            <Info className="h-6 w-6" />
            Why this works
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-primary/80">{results.explanation}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button variant="outline" onClick={onStartOver} className="py-6 text-base">
          New Reply
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full">
                <Button 
                  onClick={onRegenerate} 
                  className="w-full py-6 text-base" 
                  disabled={isRegenerateDisabled}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
              </div>
            </TooltipTrigger>
            {isRegenerateDisabled && (
              <TooltipContent>
                <p>Daily limit reached. Pay to unlock more.</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
        <Button variant="secondary" onClick={handleShare} className="py-6 text-base">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </div>
      
      <p className="text-xs text-center text-muted-foreground">
        AI suggestions only. Use your judgment.
      </p>
    </div>
  );
}
