import { useMemo, useState } from "react";
import type { TopicDef } from "@/lib/dsa/types";
import { safeGenerate } from "@/lib/dsa/registry";
import { usePlayer } from "@/lib/dsa/usePlayer";
import { StepRender } from "@/lib/dsa/renderers";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Copy, Download, Share2 } from "lucide-react";
import { toast } from "sonner";

export function Visualizer({ topic }: { topic: TopicDef }) {
  const [input, setInput] = useState(topic.defaultInput);
  const [applied, setApplied] = useState(topic.defaultInput);
  const steps = useMemo(() => safeGenerate(topic, applied), [topic, applied]);
  const player = usePlayer(steps);
  const step = player.current;
  const lines = topic.code.split("\n");

  const copyCode = async () => {
    await navigator.clipboard.writeText(topic.code);
    toast.success("Code copied to clipboard");
  };

  const downloadCpp = () => {
    const cppCode = `#include <iostream>
#include <vector>
#include <string>
using namespace std;

// ${topic.name} - ${topic.explanation}
// Time Complexity: ${topic.complexity.time}
// Space Complexity: ${topic.complexity.space}

${topic.code.split('\n').map(line => line.replace(/^\d+\s+/, '')).join('\n')}

int main() {
    // Example usage - customize based on the algorithm
    cout << "${topic.name} visualization" << endl;
    return 0;
}
`;
    const blob = new Blob([cppCode], { type: "text/x-c++src" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${topic.slug}.cpp`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success(`Downloaded ${topic.slug}.cpp`);
  };

  const shareUrl = async () => {
    const url = `${window.location.origin}/${topic.category === 'ds' ? 'ds' : 'algo'}/${topic.slug}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `${topic.name} — DSA Visualizer`, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Shareable link copied to clipboard");
      }
    } catch {
      // user cancelled share
    }
  };

  // Generate step-by-step explanation from code
  const generateStepGuide = () => {
    const guide: string[] = [];
    guide.push(`Start: Initialize variables and data structures for ${topic.name}.`);

    lines.forEach((line, i) => {
      const lineNo = i + 1;
      const cleanLine = line.replace(/^\d+\s+/, '').trim();
      if (cleanLine.includes('for') || cleanLine.includes('while')) {
        guide.push(`Step ${lineNo}: Loop iteration - ${cleanLine.substring(0, 50)}...`);
      } else if (cleanLine.includes('if')) {
        guide.push(`Step ${lineNo}: Conditional check - ${cleanLine.substring(0, 50)}...`);
      } else if (cleanLine.includes('=')) {
        guide.push(`Step ${lineNo}: Assignment operation - ${cleanLine.substring(0, 50)}...`);
      } else if (cleanLine.includes('swap')) {
        guide.push(`Step ${lineNo}: Swap elements - ${cleanLine}`);
      } else if (cleanLine.includes('return')) {
        guide.push(`Step ${lineNo}: Return result - ${cleanLine}`);
      } else if (cleanLine && !cleanLine.startsWith('//')) {
        guide.push(`Step ${lineNo}: Execute - ${cleanLine}`);
      }
    });

    guide.push(`Complete: ${topic.name} finished. Time: ${topic.complexity.time}, Space: ${topic.complexity.space}`);
    return guide;
  };

  const stepGuide = useMemo(() => generateStepGuide(), [topic.code]);

  // Determine current guide step based on active line
  const currentGuideIndex = useMemo(() => {
    if (!step.line || step.line <= 0) return 0;
    if (step.line >= lines.length) return stepGuide.length - 1;
    return Math.min(step.line, stepGuide.length - 1);
  }, [step.line, lines.length, stepGuide.length]);

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 flex flex-wrap items-center gap-3 bg-card">
        <span className="text-2xl">{topic.emoji}</span>
        <div>
          <h1 className="text-lg font-bold leading-tight">{topic.name}</h1>
          <div className="text-[11px] text-muted-foreground">{topic.group}</div>
        </div>
        <div className="flex gap-2 ml-auto items-center flex-wrap">
          <Badge variant="secondary" className="mono text-[11px]">T: {topic.complexity.time}</Badge>
          <Badge variant="secondary" className="mono text-[11px]">S: {topic.complexity.space}</Badge>
          <Button size="sm" variant="outline" onClick={copyCode} title="Copy code">
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" onClick={downloadCpp} title="Download as C++ file">
            <Download className="h-3.5 w-3.5" />
          </Button>
          <Button size="sm" variant="outline" onClick={shareUrl} title="Share">
            <Share2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 min-h-0 overflow-auto bg-background">
        <StepRender kind={topic.renderer} payload={step.payload} />
      </div>

      {/* Controls */}
      <div className="border-t border-border bg-card p-3 flex flex-col gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="icon" onClick={player.reset} title="Reset"><RotateCcw className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={player.stepBack} title="Step back"><SkipBack className="h-4 w-4" /></Button>
          <Button size="icon" onClick={player.toggle} title={player.playing ? "Pause" : "Play"}>
            {player.playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="outline" size="icon" onClick={player.stepForward} title="Step forward"><SkipForward className="h-4 w-4" /></Button>
          <div className="flex items-center gap-2 min-w-[160px]">
            <span className="text-[10px] text-muted-foreground">speed</span>
            <Slider min={0.25} max={4} step={0.25} value={[player.speed]} onValueChange={(v) => player.setSpeed(v[0])} />
            <span className="text-[10px] mono w-8">{player.speed.toFixed(2)}x</span>
          </div>
          <div className="text-xs mono text-muted-foreground ml-2">
            step {player.index + 1}/{player.total}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted-foreground min-w-[60px]">input</span>
          <input
            className="flex-1 rounded-md border border-input bg-input px-2 py-1 text-xs mono"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={topic.inputHint ?? topic.defaultInput}
          />
          <Button size="sm" onClick={() => { setApplied(input); player.reset(); }}>Apply</Button>
        </div>
        {topic.inputHint ? <div className="text-[10px] text-muted-foreground">hint: {topic.inputHint}</div> : null}
        {step.note ? (
          <div className="text-xs px-2 py-1 rounded-md bg-muted mono">{step.note}</div>
        ) : null}
      </div>

      {/* Info panel */}
      <div className="border-t border-border bg-card">
        <Tabs defaultValue="code">
          <TabsList className="rounded-none border-b border-border w-full justify-start">
            <TabsTrigger value="code">Code</TabsTrigger>
            <TabsTrigger value="explain">Explanation</TabsTrigger>
            <TabsTrigger value="uses">Use Cases</TabsTrigger>
            <TabsTrigger value="guide">Step-by-Step Guide</TabsTrigger>
          </TabsList>
          <TabsContent value="code" className="p-0 max-h-64 overflow-auto">
            <pre className="p-3 text-xs mono bg-dsa-code-bg">
              {lines.map((line, i) => {
                const lineNo = i + 1;
                const isActive = step.line === lineNo;
                return (
                  <div key={i} className={`flex gap-3 px-2 py-0.5 rounded-sm ${isActive ? "bg-dsa-active/20 border-l-2 border-dsa-active" : ""}`}>
                    <span className="text-muted-foreground w-6 text-right select-none">{lineNo}</span>
                    <span>{line || " "}</span>
                  </div>
                );
              })}
            </pre>
          </TabsContent>
          <TabsContent value="explain" className="p-4 text-sm max-h-64 overflow-auto">
            {topic.explanation}
          </TabsContent>
          <TabsContent value="uses" className="p-4 text-sm max-h-64 overflow-auto">
            {topic.useCases?.length ? (
              <ul className="list-disc pl-6 space-y-1">
                {topic.useCases.map((u, i) => <li key={i}>{u}</li>)}
              </ul>
            ) : (
              <div className="text-muted-foreground">—</div>
            )}
          </TabsContent>
          <TabsContent value="guide" className="p-0 max-h-64 overflow-auto">
            <div className="p-4">
              <ol className="space-y-2">
                {stepGuide.map((g, i) => {
                  const active = i === currentGuideIndex;
                  const done = i < currentGuideIndex;
                  return (
                    <li
                      key={i}
                      className={`text-xs leading-snug flex gap-2 rounded-md p-2 transition-colors ${
                        active
                          ? "bg-primary/10 border border-primary/40 text-foreground"
                          : done
                            ? "text-muted-foreground"
                            : "text-muted-foreground/70"
                      }`}
                    >
                      <span
                        className={`shrink-0 w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                          active
                            ? "bg-primary text-primary-foreground"
                            : done
                              ? "bg-muted text-foreground"
                              : "bg-muted/50"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span>{g}</span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}