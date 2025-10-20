import { describe, it, expect } from 'vitest';
import { findMatchInText, getSynonyms } from '../textMatcher';

describe('textMatcher', () => {
  describe('findMatchInText - Direct Matches', () => {
    it('should find exact match', () => {
      const result = findMatchInText('123 Broadway', 'Broadway');
      expect(result).toEqual({ start: 4, length: 8 });
    });

    it('should find case-insensitive match', () => {
      const result = findMatchInText('123 BROADWAY', 'broadway');
      expect(result).toEqual({ start: 4, length: 8 });
    });

    it('should find match at the beginning', () => {
      const result = findMatchInText('Broadway Street', 'Broadway');
      expect(result).toEqual({ start: 0, length: 8 });
    });

    it('should find partial match', () => {
      const result = findMatchInText('45 Broadway', '45');
      expect(result).toEqual({ start: 0, length: 2 });
    });

    it('should return null for no match', () => {
      const result = findMatchInText('123 Broadway', 'Park');
      expect(result).toBeNull();
    });
  });

  describe('findMatchInText - Synonym Matches', () => {
    it('should match BLVD when query is Boulevard', () => {
      const result = findMatchInText('123 Main BLVD', 'Boulevard');
      expect(result).toEqual({ start: 9, length: 4 });
    });

    it('should match Boulevard when query is BLVD', () => {
      const result = findMatchInText('123 Main Boulevard', 'BLVD');
      expect(result).toEqual({ start: 9, length: 9 });
    });

    it('should match BOUL when query is Boulevard', () => {
      const result = findMatchInText('123 Main BOUL', 'Boulevard');
      expect(result).toEqual({ start: 9, length: 4 });
    });

    it('should match Avenue when query is AVE', () => {
      const result = findMatchInText('123 Park Avenue', 'AVE');
      // Matches "AVE" part of "Avenue" (synonym match - matches actual synonym length)
      expect(result).toEqual({ start: 9, length: 3 });
    });

    it('should match AVE when query is Avenue', () => {
      const result = findMatchInText('123 Park AVE', 'Avenue');
      // AVE is a synonym of Avenue, so it matches the full "AVE"
      expect(result).toEqual({ start: 9, length: 3 });
    });

    it('should match AV when query is Avenue', () => {
      const result = findMatchInText('123 Park AV', 'Avenue');
      expect(result).toEqual({ start: 9, length: 2 });
    });

    it('should match Street when query is ST', () => {
      const result = findMatchInText('123 Main Street', 'ST');
      // Matches "ST" which is a synonym of "Street"
      expect(result).toEqual({ start: 9, length: 2 });
    });

    it('should match ST when query is Street', () => {
      const result = findMatchInText('123 Main ST', 'Street');
      expect(result).toEqual({ start: 9, length: 2 });
    });
  });

  describe('findMatchInText - Ordinal Synonyms', () => {
    it('should match First when query is 1st', () => {
      const result = findMatchInText('First Avenue', '1st');
      expect(result).toEqual({ start: 0, length: 5 });
    });

    it('should match 1ST when query is First', () => {
      const result = findMatchInText('1ST Avenue', 'First');
      expect(result).toEqual({ start: 0, length: 3 });
    });

    it('should match 1-ST when query is First', () => {
      const result = findMatchInText('1-ST Avenue', 'First');
      expect(result).toEqual({ start: 0, length: 4 });
    });

    it('should match Second when query is 2nd', () => {
      const result = findMatchInText('Second Avenue', '2nd');
      expect(result).toEqual({ start: 0, length: 6 });
    });

    it('should match 2-ND when query is Second', () => {
      const result = findMatchInText('2-ND Avenue', 'Second');
      expect(result).toEqual({ start: 0, length: 4 });
    });

    it('should match Third when query is 3rd', () => {
      const result = findMatchInText('Third Street', '3rd');
      expect(result).toEqual({ start: 0, length: 5 });
    });

    it('should match 42ND when query is 42-ND', () => {
      const result = findMatchInText('42ND Street', '42-ND');
      expect(result).toEqual({ start: 0, length: 4 });
    });
  });

  describe('findMatchInText - Direction Synonyms', () => {
    it('should match North when query is N', () => {
      const result = findMatchInText('North Broadway', 'N');
      // Direct substring match finds "N" at position 0
      expect(result).toEqual({ start: 0, length: 1 });
    });

    it('should match N when query is North', () => {
      const result = findMatchInText('N Broadway', 'North');
      // "N" is a synonym of "North"
      expect(result).toEqual({ start: 0, length: 1 });
    });

    it('should match East when query is E', () => {
      const result = findMatchInText('East 42nd Street', 'E');
      // Direct substring match finds "E" at position 0
      expect(result).toEqual({ start: 0, length: 1 });
    });

    it('should match SOUTH when query is S', () => {
      const result = findMatchInText('SOUTH Main', 'S');
      // Direct substring match finds "S" at position 0
      expect(result).toEqual({ start: 0, length: 1 });
    });
  });

  describe('findMatchInText - Multi-word Queries', () => {
    it('should match first word in multi-word query', () => {
      const result = findMatchInText('123 Main Boulevard', 'Main BLVD');
      // Matches "Main Boulevard" (including space)
      expect(result).toEqual({ start: 4, length: 14 });
    });

    it('should match synonym in multi-word query', () => {
      const result = findMatchInText('123 Main BLVD', 'Main Boulevard');
      // Matches "Main BLVD" (including space)
      expect(result).toEqual({ start: 4, length: 9 });
    });

    it('should prioritize direct match over synonym in multi-word', () => {
      const result = findMatchInText('First Avenue BLVD', 'First Avenue');
      expect(result).toEqual({ start: 0, length: 12 });
    });
  });

  describe('findMatchInText - Edge Cases', () => {
    it('should handle empty text', () => {
      const result = findMatchInText('', 'Broadway');
      expect(result).toBeNull();
    });

    it('should handle empty query', () => {
      const result = findMatchInText('123 Broadway', '');
      expect(result).toBeNull();
    });

    it('should handle query with extra spaces', () => {
      const result = findMatchInText('123 Broadway', '  Broadway  ');
      expect(result).toEqual({ start: 4, length: 8 });
    });

    it('should handle text with multiple spaces', () => {
      const result = findMatchInText('123  Broadway', 'Broadway');
      expect(result).toEqual({ start: 5, length: 8 });
    });

    it('should preserve original case in match position', () => {
      const result = findMatchInText('123 BROADWAY BLVD', 'boulevard');
      // "boulevard" is a synonym of "BLVD", so it matches "BLVD" at position 13
      expect(result).toEqual({ start: 13, length: 4 });
    });
  });

  describe('findMatchInText - Complex Addresses', () => {
    it('should match in full address', () => {
      const result = findMatchInText('123 Fifth Avenue', '5th');
      expect(result).toEqual({ start: 4, length: 5 });
    });

    it('should match abbreviated street type', () => {
      const result = findMatchInText('45 Broadway ST', 'Street');
      expect(result).toEqual({ start: 12, length: 2 });
    });

    it('should match full street type for abbreviation query', () => {
      const result = findMatchInText('45 Broadway Street', 'ST');
      // Direct substring match finds "ST" in "Street"
      expect(result).toEqual({ start: 12, length: 2 });
    });

    it('should match multi-word with synonym and partial: "31 w tre" in "31 WEST TREMONT AVENUE"', () => {
      const result = findMatchInText('31 WEST TREMONT AVENUE', '31 w tre');
      expect(result).not.toBeNull();
      expect(result?.start).toBe(0);
      // Should match "31 WEST TRE" (11 characters including spaces)
      expect(result?.length).toBeGreaterThanOrEqual(11);
    });

    it('should match "45 bro" in "45 Broadway"', () => {
      const result = findMatchInText('45 Broadway', '45 bro');
      // Matches "45 Bro" - only the partial match portion
      expect(result).toEqual({ start: 0, length: 6 });
    });

    it('should match "w 42" in "West 42nd Street"', () => {
      const result = findMatchInText('West 42nd Street', 'w 42');
      // "w" is synonym of "West", "42" matches "42nd" partially
      // Matches "West 42" - only the partial match portion
      expect(result).toEqual({ start: 0, length: 7 });
    });
  });

  describe('getSynonyms', () => {
    it('should return all synonyms for Boulevard', () => {
      const synonyms = getSynonyms('Boulevard');
      expect(synonyms).toContain('boulevard');
      expect(synonyms).toContain('blvd');
      expect(synonyms).toContain('boul');
      expect(synonyms).toContain('boulv');
    });

    it('should return all synonyms for BLVD', () => {
      const synonyms = getSynonyms('BLVD');
      expect(synonyms).toContain('boulevard');
      expect(synonyms).toContain('blvd');
      expect(synonyms).toContain('boul');
    });

    it('should return all synonyms for Avenue', () => {
      const synonyms = getSynonyms('Avenue');
      expect(synonyms).toContain('avenue');
      expect(synonyms).toContain('ave');
      expect(synonyms).toContain('av');
      expect(synonyms).toContain('aven');
      expect(synonyms).toContain('avenu');
    });

    it('should return empty array for unknown word', () => {
      const synonyms = getSynonyms('XYZ123');
      expect(synonyms).toEqual([]);
    });

    it('should handle case insensitivity', () => {
      const synonymsLower = getSynonyms('avenue');
      const synonymsUpper = getSynonyms('AVENUE');
      expect(synonymsLower).toEqual(synonymsUpper);
    });
  });
});

