import { useMemo, useState } from "react";
import type { TopicDef } from "@/lib/dsa/types";
import { safeGenerate } from "@/lib/dsa/registry";
import { usePlayer } from "@/lib/dsa/usePlayer";
import { StepRender } from "@/lib/dsa/renderers";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, Pause, SkipBack, SkipForward, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

// Operation definitions for each data structure
const DS_OPERATIONS: Record<string, string[]> = {
  "dynamic-array": ["push_back", "pop_back", "insert", "erase", "resize", "clear", "get", "set"],
  "singly-linked-list": ["push_front", "pop_front", "push_back", "pop_back", "insert", "erase", "reverse", "search"],
  "doubly-linked-list": ["push_front", "pop_front", "push_back", "pop_back", "insert", "erase", "reverse", "search"],
  "circular-linked-list": ["push_front", "pop_front", "push_back", "pop_back", "insert", "erase", "search"],
  "stack": ["push", "pop", "top", "empty", "size"],
  "queue": ["enqueue", "dequeue", "front", "back", "empty", "size"],
  "deque": ["push_front", "push_back", "pop_front", "pop_back", "front", "back", "empty", "size"],
  "hash-map": ["insert", "find", "erase", "update", "contains_key", "clear", "size"],
  "hash-set": ["insert", "find", "erase", "count", "clear", "size", "union", "intersect"],
  "binary-tree": ["insert", "delete", "search", "get_root", "is_empty", "height"],
  "bst": ["insert", "delete", "search", "min", "max", "predecessor", "successor"],
  "avl": ["insert", "delete", "search", "rotate_left", "rotate_right", "balance", "get_height"],
  "red-black": ["insert", "delete", "search", "recolor", "rotate_left", "rotate_right"],
  "splay": ["splay", "insert", "delete", "search", "split", "join"],
  "btree": ["insert", "delete", "search", "split", "merge", "traverse"],
  "heap": ["push", "pop", "top", "heapify", "decrease_key", "increase_key", "extract_min_max"],
  "trie": ["insert", "search", "startsWith", "delete", "longest_common_prefix"],
  "segment-tree": ["build", "update_point", "update_range", "query_range"],
  "fenwick": ["build", "update", "prefix_sum", "range_sum"],
  "adj-matrix": ["add_edge", "remove_edge", "has_edge", "get_weight", "get_out_degree"],
  "adj-list": ["add_edge", "remove_edge", "neighbors", "has_edge", "get_degree"],
  "dsu": ["make_set", "find", "union_sets", "get_connected_components_count"],
};

const ALGO_OPERATIONS: Record<string, string[]> = {
  // Traversals
  "tree-traversals": ["preorder", "inorder", "postorder", "level_order", "morris_inorder"],
  "bfs": ["BFS", "DFS", "bidirectional_BFS"],
  "dfs": ["BFS", "DFS", "bidirectional_BFS"],
  // Sorting
  "bubble-sort": ["bubble_sort"],
  "selection-sort": ["selection_sort"],
  "insertion-sort": ["insertion_sort"],
  "merge-sort": ["merge_sort"],
  "quick-sort": ["quick_sort"],
  "heap-sort": ["heap_sort"],
  "tim-sort": ["tim_sort"],
  "counting-sort": ["counting_sort"],
  "radix-sort": ["radix_sort"],
  "bucket-sort": ["bucket_sort"],
  // Searching
  "linear-search": ["linear_search"],
  "binary-search": ["binary_search"],
  "ternary-search": ["ternary_search"],
  "exponential-search": ["exponential_search"],
  // Advanced Graph
  "dijkstra": ["dijkstra"],
  "bellman-ford": ["bellman_ford"],
  "floyd-warshall": ["floyd_warshall"],
  "0-1-bfs": ["0_1_bfs"],
  "spfa": ["spfa"],
  "kruskal": ["kruskal_mst"],
  "prim": ["prim_mst"],
  "topological-sort": ["topological_sort", "tarjan_scc", "kosaraju_scc", "kahns_algorithm"],
  "ford-fulkerson": ["ford_fulkerson"],
  "edmonds-karp": ["edmonds_karp"],
  "dinics": ["dinics_algorithm"],
  // String
  "kmp": ["kmp_search"],
  "rabin-karp": ["rabin_karp"],
  "z-algorithm": ["z_algorithm"],
  "aho-corasick": ["aho_corasick"],
  "boyer-moore": ["boyer_moore"],
  // Geometry
  "convex-hull": ["convex_hull_graham_scan", "jarvis_march", "line_intersection"],
  // Backtracking
  "backtracking": ["n_queens", "sudoku_solver", "generate_permutations", "generate_subsets", "word_search"],
  // Patterns
  "two-pointers": ["two_pointers"],
  "sliding-window": ["sliding_window"],
  "prefix-sum": ["prefix_sum"],
  "dutch-national-flag": ["dutch_national_flag"],
  "floyd-cycle": ["floyd_cycle_detection", "brent_cycle_detection", "find_middle"],
  "merge-intervals": ["merge_intervals"],
  "monotonic-stack": ["monotonic_stack"],
  "monotonic-queue": ["monotonic_queue"],
  "top-k": ["top_k_elements"],
  "k-way-merge": ["k_way_merge"],
  "island-perimeter": ["island_perimeter_flood_fill"],
  // Paradigms
  "dp": ["memoization_top_down", "tabulation_bottom_up", "state_transition_update"],
  "recursion": ["base_case_check", "recursive_step", "call_stack_unwind"],
  "divide-and-conquer": ["divide_problem", "conquer_subproblems", "combine_results"],
  "greedy": ["sort_by_criterion", "local_optimal_choice", "feasibility_check"],
  "bit-manipulation": ["get_bit", "set_bit", "clear_bit", "toggle_bit", "is_power_of_two", "count_set_bits"],
};

function getOperations(slug: string): string[] {
  return DS_OPERATIONS[slug] || ALGO_OPERATIONS[slug] || [];
}

export function Visualizer({ topic }: { topic: TopicDef }) {
  const [input, setInput] = useState(topic.defaultInput);
  const [applied, setApplied] = useState(topic.defaultInput);
  const [opInput, setOpInput] = useState("");
  const steps = useMemo(() => safeGenerate(topic, applied), [topic, applied]);
  const player = usePlayer(steps);
  const step = player.current;
  const lines = topic.code.split("\n");
  
  const operations = getOperations(topic.slug);
  
  const handleOperation = (op: string) => {
    const value = opInput.trim() || Math.floor(Math.random() * 100).toString();
    // For now, just regenerate with the operation
    // In a full implementation, you'd track state and apply operations incrementally
    const newInput = applied ? `${applied},${value}` : value;
    setApplied(newInput);
    setInput(newInput);
    setOpInput("");
    player.reset();
  };

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
        
        {/* Operations Bar - Only shown when operations are available */}
        {operations.length > 0 && (
          <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-border">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-muted-foreground min-w-[60px]">operation value</span>
              <Input
                className="flex-1 h-8 text-xs mono"
                placeholder="Enter value (or leave empty for random)"
                value={opInput}
                onChange={(e) => setOpInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && operations.length > 0) {
                    handleOperation(operations[0]);
                  }
                }}
              />
            </div>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex gap-1 pb-1">
                {operations.map((op) => (
                  <Button
                    key={op}
                    size="sm"
                    variant="outline"
                    className="text-[10px] h-7 shrink-0"
                    onClick={() => handleOperation(op)}
                  >
                    {op.replace(/_/g, ' ')}
                  </Button>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}
        
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
        </Tabs>
      </div>
    </div>
  );
}
