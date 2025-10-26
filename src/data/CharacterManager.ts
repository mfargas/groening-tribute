import { z } from 'zod';
import { Character, CharacterArchetype, CharacterStats } from '../types/game';

// Character data schema with Zod validation
export const CharacterDataSchema = z.object({
  id: z.string(),
  name: z.string(),
  archetype: z.enum(['maternal', 'warrior', 'rebel']),
  description: z.string(),
  era: z.string(), // Which era of animation this represents
  stats: z.object({
    speed: z.number().min(0).max(10),
    strength: z.number().min(0).max(10),
    agility: z.number().min(0).max(10),
    intelligence: z.number().min(0).max(10),
    specialAbility: z.string(),
    specialCooldown: z.number().min(0),
  }),
  spriteSheet: z.string(),
  animations: z.record(z.string(), z.object({
    frames: z.number(),
    duration: z.number(),
    loop: z.boolean(),
  })),
  abilities: z.array(z.object({
    name: z.string(),
    description: z.string(),
    cooldown: z.number(),
    effect: z.string(),
    icon: z.string(),
  })),
  culturalContext: z.object({
    era: z.string(),
    representation: z.string(),
    evolution: z.string(),
  }),
});

export type CharacterData = z.infer<typeof CharacterDataSchema>;

// Character data definitions
export const CHARACTER_DATA: CharacterData[] = [
  {
    id: 'marge',
    name: 'Marge Simpson',
    archetype: 'maternal',
    description: 'The nurturing matriarch who balances family responsibilities with personal growth',
    era: '1980s-1990s',
    stats: {
      speed: 3,
      strength: 4,
      agility: 3,
      intelligence: 7,
      specialAbility: 'Maternal Instinct',
      specialCooldown: 5000,
    },
    spriteSheet: '/sprites/marge.png',
    animations: {
      idle: { frames: 4, duration: 1000, loop: true },
      walk: { frames: 6, duration: 800, loop: true },
      special: { frames: 8, duration: 2000, loop: false },
      hurt: { frames: 3, duration: 500, loop: false },
    },
    abilities: [
      {
        name: 'Maternal Instinct',
        description: 'Automatically collects nearby collectibles and protects from one hit',
        cooldown: 5000,
        effect: 'shield',
        icon: '🛡️',
      },
      {
        name: 'Family Bond',
        description: 'Increases score multiplier for 10 seconds',
        cooldown: 15000,
        effect: 'multiplier',
        icon: '👨‍👩‍👧‍👦',
      },
    ],
    culturalContext: {
      era: '1980s-1990s',
      representation: 'Traditional maternal figure with hidden depths',
      evolution: 'From housewife stereotype to complex character with agency',
    },
  },
  {
    id: 'leela',
    name: 'Leela',
    archetype: 'warrior',
    description: 'The fierce warrior who challenges gender norms through strength and leadership',
    era: '1990s-2000s',
    stats: {
      speed: 6,
      strength: 8,
      agility: 7,
      intelligence: 6,
      specialAbility: 'Cyclops Vision',
      specialCooldown: 3000,
    },
    spriteSheet: '/sprites/leela.png',
    animations: {
      idle: { frames: 4, duration: 1000, loop: true },
      walk: { frames: 6, duration: 600, loop: true },
      attack: { frames: 8, duration: 1000, loop: false },
      special: { frames: 10, duration: 1500, loop: false },
      hurt: { frames: 3, duration: 400, loop: false },
    },
    abilities: [
      {
        name: 'Cyclops Vision',
        description: 'Reveals hidden enemies and collectibles for 5 seconds',
        cooldown: 3000,
        effect: 'reveal',
        icon: '👁️',
      },
      {
        name: 'Combat Training',
        description: 'Deals damage to all enemies on screen',
        cooldown: 8000,
        effect: 'damage',
        icon: '⚔️',
      },
    ],
    culturalContext: {
      era: '1990s-2000s',
      representation: 'Strong female leader breaking gender barriers',
      evolution: 'From sidekick to captain, challenging sci-fi tropes',
    },
  },
  {
    id: 'bean',
    name: 'Princess Bean',
    archetype: 'rebel',
    description: 'The rebellious princess who rejects traditional roles and embraces chaos',
    era: '2010s-Present',
    stats: {
      speed: 8,
      strength: 3,
      agility: 9,
      intelligence: 5,
      specialAbility: 'Royal Charm',
      specialCooldown: 4000,
    },
    spriteSheet: '/sprites/bean.png',
    animations: {
      idle: { frames: 4, duration: 1000, loop: true },
      walk: { frames: 6, duration: 500, loop: true },
      dodge: { frames: 4, duration: 300, loop: false },
      special: { frames: 6, duration: 1200, loop: false },
      hurt: { frames: 3, duration: 400, loop: false },
    },
    abilities: [
      {
        name: 'Royal Charm',
        description: 'Temporarily confuses enemies, making them move randomly',
        cooldown: 4000,
        effect: 'confuse',
        icon: '👸',
      },
      {
        name: 'Rebellious Spirit',
        description: 'Gains temporary invincibility and double speed',
        cooldown: 12000,
        effect: 'invincible',
        icon: '🔥',
      },
    ],
    culturalContext: {
      era: '2010s-Present',
      representation: 'Anti-princess who rejects traditional femininity',
      evolution: 'Modern deconstruction of princess tropes',
    },
  },
];

// Character Manager class
export class CharacterManager {
  private characters: Map<string, CharacterData> = new Map();
  private currentCharacter: string = 'marge';

  constructor() {
    this.loadCharacters();
  }

  private loadCharacters(): void {
    CHARACTER_DATA.forEach((charData) => {
      // Validate character data with Zod
      try {
        const validatedData = CharacterDataSchema.parse(charData);
        this.characters.set(validatedData.id, validatedData);
      } catch (error) {
        console.error(`Invalid character data for ${charData.id}:`, error);
      }
    });
  }

  getCharacter(id: string): CharacterData | undefined {
    return this.characters.get(id);
  }

  getAllCharacters(): CharacterData[] {
    return Array.from(this.characters.values());
  }

  getCurrentCharacter(): CharacterData | undefined {
    return this.characters.get(this.currentCharacter);
  }

  setCurrentCharacter(id: string): boolean {
    if (this.characters.has(id)) {
      this.currentCharacter = id;
      return true;
    }
    return false;
  }

  getCharactersByArchetype(archetype: CharacterArchetype): CharacterData[] {
    return Array.from(this.characters.values()).filter(
      char => char.archetype === archetype
    );
  }

  // Character comparison and analysis
  compareCharacters(char1Id: string, char2Id: string): {
    speed: { char1: number; char2: number; winner: string };
    strength: { char1: number; char2: number; winner: string };
    agility: { char1: number; char2: number; winner: string };
    intelligence: { char1: number; char2: number; winner: string };
  } | null {
    const char1 = this.getCharacter(char1Id);
    const char2 = this.getCharacter(char2Id);

    if (!char1 || !char2) return null;

    return {
      speed: {
        char1: char1.stats.speed,
        char2: char2.stats.speed,
        winner: char1.stats.speed > char2.stats.speed ? char1.name : char2.name,
      },
      strength: {
        char1: char1.stats.strength,
        char2: char2.stats.strength,
        winner: char1.stats.strength > char2.stats.strength ? char1.name : char2.name,
      },
      agility: {
        char1: char1.stats.agility,
        char2: char2.stats.agility,
        winner: char1.stats.agility > char2.stats.agility ? char1.name : char2.name,
      },
      intelligence: {
        char1: char1.stats.intelligence,
        char2: char2.stats.intelligence,
        winner: char1.stats.intelligence > char2.stats.intelligence ? char1.name : char2.name,
      },
    };
  }

  // Cultural analysis
  getCulturalAnalysis(): {
    eraDistribution: Record<string, number>;
    archetypeDistribution: Record<string, number>;
    evolutionTimeline: Array<{ era: string; characters: string[] }>;
  } {
    const characters = this.getAllCharacters();
    
    const eraDistribution: Record<string, number> = {};
    const archetypeDistribution: Record<string, number> = {};
    const evolutionTimeline: Array<{ era: string; characters: string[] }> = [];

    characters.forEach((char) => {
      // Era distribution
      eraDistribution[char.era] = (eraDistribution[char.era] || 0) + 1;
      
      // Archetype distribution
      archetypeDistribution[char.archetype] = (archetypeDistribution[char.archetype] || 0) + 1;
    });

    // Create evolution timeline
    const eras = [...new Set(characters.map(char => char.era))].sort();
    eras.forEach(era => {
      evolutionTimeline.push({
        era,
        characters: characters.filter(char => char.era === era).map(char => char.name),
      });
    });

    return {
      eraDistribution,
      archetypeDistribution,
      evolutionTimeline,
    };
  }

  // Export character data for external use
  exportCharacterData(): string {
    return JSON.stringify(Array.from(this.characters.values()), null, 2);
  }

  // Import and validate character data
  importCharacterData(jsonData: string): { success: boolean; errors: string[] } {
    try {
      const data = JSON.parse(jsonData);
      const errors: string[] = [];

      if (Array.isArray(data)) {
        data.forEach((charData, index) => {
          try {
            CharacterDataSchema.parse(charData);
            this.characters.set(charData.id, charData);
          } catch (error) {
            errors.push(`Character ${index}: ${error}`);
          }
        });
      } else {
        errors.push('Data must be an array of character objects');
      }

      return {
        success: errors.length === 0,
        errors,
      };
    } catch (error) {
      return {
        success: false,
        errors: [`Invalid JSON: ${error}`],
      };
    }
  }
}
