import type { Step, PrimitiveAnimationPayload, MemorySlot, PointerConnection } from "../types";

// Helper to create animation steps for primitives
const createPrimitiveStep = (
  phase: PrimitiveAnimationPayload["animationPhase"],
  title: string,
  body: string,
  bullets: string[],
  memorySlots: MemorySlot[],
  pointerConnections?: PointerConnection[],
  fallingValue?: PrimitiveAnimationPayload["fallingValue"]
): Step[] => [{
  line: 1,
  note: title,
  payload: {
    title,
    body,
    bullets,
    memorySlots,
    pointerConnections,
    fallingValue,
    animationPhase: phase,
  } satisfies PrimitiveAnimationPayload,
}];

// Parse user input like "int a = 5;" or "a = 5"
const parseUserInput = (input: string): { name: string; value: string | number; type: string } | null => {
  const trimmed = input.trim();
  
  // Pattern: type name = value; or name = value;
  const match = trimmed.match(/^(?:(int|float|double|char|bool|string)\s+)?(\w+)\s*=\s*(.+?)\s*;?\s*$/i);
  if (!match) return null;
  
  const [, typeMatch, name, valueStr] = match;
  let type = (typeMatch || "auto").toLowerCase();
  let value: string | number = valueStr;
  
  // Infer type if not specified
  if (type === "auto") {
    if (/^\d+$/.test(valueStr)) {
      type = "int";
      value = parseInt(valueStr, 10);
    } else if (/^\d*\.\d+$/.test(valueStr)) {
      type = "float";
      value = parseFloat(valueStr);
    } else if (valueStr === "true" || valueStr === "false") {
      type = "bool";
      value = valueStr === "true";
    } else if (valueStr.startsWith('"') || valueStr.startsWith("'")) {
      type = "string";
      value = valueStr.slice(1, -1);
    } else if (valueStr.length === 1) {
      type = "char";
      value = valueStr;
    }
  } else {
    // Convert based on explicit type
    if (type === "int") {
      value = parseInt(valueStr, 10);
    } else if (type === "float" || type === "double") {
      value = parseFloat(valueStr);
      type = "float";
    } else if (type === "bool") {
      value = valueStr === "true" || valueStr === "1";
    }
  }
  
  return { name, value, type };
};

// Generate hex-like address
const genAddress = (index: number) => `0x${(0x1000 + index * 0x100).toString(16).toUpperCase()}`;

export const intFloatSteps = (input: string = "int a = 5;"): Step[] => {
  const parsed = parseUserInput(input) || { name: "a", value: 5, type: "int" };
  const slotId = `slot-${parsed.name}`;
  
  return [
    // Phase 1: Show RAM structure being created
    {
      line: 1,
      note: "Creating memory allocation...",
      payload: {
        title: "Integers & Floating-Points",
        body: "Numeric primitives stored in fixed-width memory blocks. Watch as the value falls into its allocated slot!",
        bullets: [
          "int32: 4 bytes, range ±2.1 billion",
          "float64: 8 bytes, ~15 decimal digits precision",
          "Values stored in binary format inside RAM cells",
        ],
        memorySlots: [{
          id: slotId,
          name: parsed.name,
          value: "?",
          address: genAddress(0),
          type: parsed.type as any,
          x: 400,
          y: 250,
          isPlaceholder: true,
          hasValue: false,
        }],
        animationPhase: "creating",
      } satisfies PrimitiveAnimationPayload,
    },
    // Phase 2: Value falling
    {
      line: 1,
      note: `Assigning ${parsed.value} to ${parsed.name}...`,
      payload: {
        title: "Integers & Floating-Points",
        body: "The assigned value travels from the assignment operator down into the memory slot.",
        bullets: [
          "Assignment operator (=) transfers value to memory",
          "Type determines storage format and size",
        ],
        memorySlots: [{
          id: slotId,
          name: parsed.name,
          value: "?",
          address: genAddress(0),
          type: parsed.type as any,
          x: 400,
          y: 250,
          isPlaceholder: true,
          hasValue: false,
        }],
        fallingValue: {
          slotId,
          value: parsed.value,
          progress: 0.5,
        },
        animationPhase: "falling",
      } satisfies PrimitiveAnimationPayload,
    },
    // Phase 3: Value placed
    {
      line: 1,
      note: "Value stored successfully!",
      payload: {
        title: "Integers & Floating-Points",
        body: "The value is now stored in the memory slot. The RAM block holds the binary representation.",
        bullets: [
          "int32: 4 bytes, range ±2.1 billion",
          "float64: 8 bytes, ~15 decimal digits precision",
          "Values stored in binary format inside RAM cells",
        ],
        memorySlots: [{
          id: slotId,
          name: parsed.name,
          value: parsed.value,
          address: genAddress(0),
          type: parsed.type as any,
          x: 400,
          y: 250,
          isPlaceholder: false,
          hasValue: true,
        }],
        animationPhase: "placed",
      } satisfies PrimitiveAnimationPayload,
    },
  ];
};

export const boolSteps = (input: string = "bool flag = true;"): Step[] => {
  const parsed = parseUserInput(input) || { name: "flag", value: true, type: "bool" };
  const slotId = `slot-${parsed.name}`;
  
  return [
    {
      line: 1,
      note: "Creating boolean memory slot...",
      payload: {
        title: "Booleans",
        body: "Boolean values occupy 1 byte of memory representing true (1) or false (0).",
        bullets: [
          "Stored as 0 (false) or 1 (true)",
          "Used for conditions and logical operations",
          "Supports AND, OR, NOT, XOR operations",
        ],
        memorySlots: [{
          id: slotId,
          name: parsed.name,
          value: "?",
          address: genAddress(1),
          type: "bool",
          x: 400,
          y: 250,
          isPlaceholder: true,
          hasValue: false,
        }],
        animationPhase: "creating",
      } satisfies PrimitiveAnimationPayload,
    },
    {
      line: 1,
      note: `Storing ${parsed.value}...`,
      payload: {
        title: "Booleans",
        body: "Boolean value falling into memory. True becomes 1, False becomes 0 internally.",
        bullets: [
          "Logical operations use short-circuit evaluation",
          "Essential for control flow",
        ],
        memorySlots: [{
          id: slotId,
          name: parsed.name,
          value: "?",
          address: genAddress(1),
          type: "bool",
          x: 400,
          y: 250,
          isPlaceholder: true,
          hasValue: false,
        }],
        fallingValue: {
          slotId,
          value: parsed.value ? "TRUE" : "FALSE",
          progress: 0.5,
        },
        animationPhase: "falling",
      } satisfies PrimitiveAnimationPayload,
    },
    {
      line: 1,
      note: "Boolean stored!",
      payload: {
        title: "Booleans",
        body: "The boolean value is stored. In memory: 1 for true, 0 for false.",
        bullets: [
          "Stored as 0 (false) or 1 (true)",
          "Used for conditions and logical operations",
          "Supports AND, OR, NOT, XOR operations",
        ],
        memorySlots: [{
          id: slotId,
          name: parsed.name,
          value: parsed.value,
          address: genAddress(1),
          type: "bool",
          x: 400,
          y: 250,
          isPlaceholder: false,
          hasValue: true,
        }],
        animationPhase: "placed",
      } satisfies PrimitiveAnimationPayload,
    },
  ];
};

export const charStringSteps = (input: string = 'char c = "A";'): Step[] => {
  const parsed = parseUserInput(input) || { name: "c", value: "A", type: "char" };
  const slotId = `slot-${parsed.name}`;
  const displayValue = typeof parsed.value === "string" ? parsed.value.charAt(0) : parsed.value;
  
  return [
    {
      line: 1,
      note: "Allocating character storage...",
      payload: {
        title: "Characters & Strings",
        body: "Characters are stored as ASCII/Unicode code points. Each char takes 1 byte (ASCII) or more (UTF-8).",
        bullets: [
          "ASCII: 1 byte per character (0-255)",
          "Unicode: variable bytes for international chars",
          "Strings are arrays of characters",
        ],
        memorySlots: [{
          id: slotId,
          name: parsed.name,
          value: "?",
          address: genAddress(2),
          type: "char",
          x: 400,
          y: 250,
          isPlaceholder: true,
          hasValue: false,
        }],
        animationPhase: "creating",
      } satisfies PrimitiveAnimationPayload,
    },
    {
      line: 1,
      note: `Placing character '${displayValue}'...`,
      payload: {
        title: "Characters & Strings",
        body: "Character value descending into memory. Stored as numeric ASCII/Unicode code.",
        bullets: [
          "'A' = 65, 'a' = 97 in ASCII",
          "Strings are immutable in many languages",
        ],
        memorySlots: [{
          id: slotId,
          name: parsed.name,
          value: "?",
          address: genAddress(2),
          type: "char",
          x: 400,
          y: 250,
          isPlaceholder: true,
          hasValue: false,
        }],
        fallingValue: {
          slotId,
          value: `'${displayValue}'`,
          progress: 0.5,
        },
        animationPhase: "falling",
      } satisfies PrimitiveAnimationPayload,
    },
    {
      line: 1,
      note: "Character stored!",
      payload: {
        title: "Characters & Strings",
        body: "Character stored as its ASCII/Unicode numeric value. Display shows the glyph.",
        bullets: [
          "ASCII: 1 byte per character (0-255)",
          "Unicode: variable bytes for international chars",
          "Strings are arrays of characters",
        ],
        memorySlots: [{
          id: slotId,
          name: parsed.name,
          value: displayValue,
          address: genAddress(2),
          type: "char",
          x: 400,
          y: 250,
          isPlaceholder: false,
          hasValue: true,
        }],
        animationPhase: "placed",
      } satisfies PrimitiveAnimationPayload,
    },
  ];
};

export const pointerSteps = (input: string = "int* p = &x;"): Step[] => {
  // Create two slots: one for the variable x, one for pointer p
  const xSlot: MemorySlot = {
    id: "slot-x",
    name: "x",
    value: 10,
    address: genAddress(10),
    type: "int",
    x: 250,
    y: 250,
    isPlaceholder: false,
    hasValue: true,
  };
  
  const pSlot: MemorySlot = {
    id: "slot-p",
    name: "p",
    value: genAddress(10),
    address: genAddress(11),
    type: "pointer",
    x: 550,
    y: 250,
    isPlaceholder: true,
    hasValue: false,
  };
  
  return [
    {
      line: 1,
      note: "Creating variable x...",
      payload: {
        title: "Pointers & References",
        body: "First, we create a regular variable 'x' with value 10. It gets its own memory hut.",
        bullets: [
          "Variables store values directly",
          "Each variable has a unique memory address",
          "Pointers will store these addresses",
        ],
        memorySlots: [xSlot],
        animationPhase: "creating",
      } satisfies PrimitiveAnimationPayload,
    },
    {
      line: 1,
      note: "Creating pointer p...",
      payload: {
        title: "Pointers & References",
        body: "Now creating pointer 'p'. Pointers are shown as huts that will contain addresses pointing to other huts.",
        bullets: [
          "Pointers store memory addresses, not values",
          "Pointer syntax: type* name",
          "Address-of operator (&) gets variable's address",
        ],
        memorySlots: [xSlot, pSlot],
        animationPhase: "creating",
      } satisfies PrimitiveAnimationPayload,
    },
    {
      line: 1,
      note: "Linking pointer to address...",
      payload: {
        title: "Pointers & References",
        body: "The pointer 'p' now contains the address of 'x'. Follow the dashed arrow to see what it points to!",
        bullets: [
          "Dereference operator (*) accesses pointed value",
          "*p = 20 would change x to 20",
          "Multiple pointers can point to same address",
        ],
        memorySlots: [
          xSlot,
          { ...pSlot, hasValue: true, value: genAddress(10), isPlaceholder: false },
        ],
        pointerConnections: [{
          fromId: "slot-p",
          toAddress: genAddress(10),
          toId: "slot-x",
        }],
        animationPhase: "linking",
      } satisfies PrimitiveAnimationPayload,
    },
  ];
};
