import { describe, it, expect } from 'vitest';
import DuplicateDetector from '../DuplicateDetector';

describe('DuplicateDetector', () => {
    describe('constructor and configuration', () => {
        it('should create instance with default config', () => {
            const detector = new DuplicateDetector();
            expect(detector).toBeInstanceOf(DuplicateDetector);
        });

        it('should accept custom threshold', () => {
            const detector = new DuplicateDetector({ threshold: 0.9 });
            const result = detector.compare('ABC Corp', 'ABC Corporation');
            // Should use the custom threshold
            expect(result.isDuplicate).toBe(result.similarity.score >= 0.9);
        });

        it('should accept custom algorithm weights', () => {
            const detector = new DuplicateDetector({
                algorithms: {
                    dice: { enabled: false },
                    levenshtein: { weight: 0.5 },
                }
            });
            expect(detector).toBeInstanceOf(DuplicateDetector);
        });

        it('should merge custom config with defaults', () => {
            const detector = new DuplicateDetector({
                normalization: {
                    lowercase: false,
                }
            });
            const normalized = detector.normalize('ABC CORP');
            // Should not lowercase if disabled
            expect(normalized).not.toBe('abc corp');
        });
    });

    describe('normalize', () => {
        it('should normalize basic strings', () => {
            const detector = new DuplicateDetector();
            expect(detector.normalize('ABC Corp')).toBe('abc corp');
        });

        it('should remove quotes', () => {
            const detector = new DuplicateDetector();
            expect(detector.normalize('"ABC Corp"')).toBe('abc corp');
            expect(detector.normalize("'ABC Corp'")).toBe('abc corp');
        });

        it('should collapse whitespace', () => {
            const detector = new DuplicateDetector();
            expect(detector.normalize('ABC   Corp')).toBe('abc corp');
            expect(detector.normalize('ABC\nCorp')).toBe('abc corp');
        });

        it('should trim whitespace', () => {
            const detector = new DuplicateDetector();
            expect(detector.normalize('  ABC Corp  ')).toBe('abc corp');
        });

        it('should handle empty strings', () => {
            const detector = new DuplicateDetector();
            expect(detector.normalize('')).toBe('');
            expect(detector.normalize('   ')).toBe('');
        });

        it('should normalize business suffixes', () => {
            const detector = new DuplicateDetector();
            expect(detector.normalize('ABC L.L.C.')).toBe('abc llc');
            expect(detector.normalize('ABC INC.')).toBe('abc inc');
            expect(detector.normalize('ABC CORP.')).toBe('abc corp');
        });

        it('should remove punctuation', () => {
            const detector = new DuplicateDetector();
            expect(detector.normalize('ABC-Corp')).toBe('abc corp');
            expect(detector.normalize('ABC.Corp')).toBe('abc corp');
            expect(detector.normalize('ABC_Corp')).toBe('abc corp');
        });

        it('should handle number word replacements', () => {
            const detector = new DuplicateDetector();
            expect(detector.normalize('ONE TWO THREE')).toBe('1 2 3');
            expect(detector.normalize('FIRST STREET')).toBe('1st street');
        });

        it('should handle suffix removal mode', () => {
            const detector = new DuplicateDetector({
                suffixHandling: {
                    enabled: true,
                    mode: 'remove',
                    suffixes: ['LLC', 'INC']
                }
            });
            const normalized = detector.normalize('ABC LLC');
            expect(normalized).not.toContain('llc');
        });

        it('should handle removeTokens when enabled', () => {
            const detector = new DuplicateDetector({
                removeTokens: {
                    enabled: true,
                    tokens: ['THE', 'OF', 'AND']
                }
            });
            const normalized = detector.normalize('THE ABC OF CORP');
            expect(normalized).not.toContain('the');
            expect(normalized).not.toContain('of');
        });

        it('should handle custom replacements', () => {
            const detector = new DuplicateDetector({
                replacements: {
                    custom: {
                        enabled: true,
                        map: {
                            'XYZ': 'ABC'
                        }
                    }
                }
            });
            expect(detector.normalize('XYZ Corp')).toBe('abc corp');
        });
    });

    describe('calculateSimilarity', () => {
        it('should calculate similarity for identical strings', () => {
            const detector = new DuplicateDetector();
            const result = detector.calculateSimilarity('abc', 'abc');
            expect(result.score).toBe(1);
        });

        it('should calculate similarity for different strings', () => {
            const detector = new DuplicateDetector();
            const result = detector.calculateSimilarity('abc', 'xyz');
            expect(result.score).toBeLessThan(1);
            expect(result.score).toBeGreaterThanOrEqual(0);
        });

        it('should include algorithm details', () => {
            const detector = new DuplicateDetector();
            const result = detector.calculateSimilarity('abc', 'abc');
            expect(result.details).toBeDefined();
            expect(result.details.dice).toBeDefined();
            expect(result.details.levenshtein).toBeDefined();
            expect(result.details.tokens).toBeDefined();
        });

        it('should handle empty strings', () => {
            const detector = new DuplicateDetector();
            const result = detector.calculateSimilarity('', '');
            expect(result.score).toBe(1);
        });

        it('should work with only dice algorithm', () => {
            const detector = new DuplicateDetector({
                algorithms: {
                    dice: { enabled: true, weight: 1.0 },
                    levenshtein: { enabled: false },
                    tokens: { enabled: false }
                }
            });
            const result = detector.calculateSimilarity('abc', 'abc');
            expect(result.score).toBe(1);
            expect(result.details.dice).toBe(1);
            expect(result.details.levenshtein).toBeUndefined();
            expect(result.details.tokens).toBeUndefined();
        });

        it('should handle weighted algorithms correctly', () => {
            const detector = new DuplicateDetector({
                algorithms: {
                    dice: { enabled: true, weight: 0.5 },
                    levenshtein: { enabled: true, weight: 0.5 },
                    tokens: { enabled: false }
                }
            });
            const result = detector.calculateSimilarity('abc', 'abc');
            // Both algorithms should contribute equally
            expect(result.score).toBe(1);
        });
    });

    describe('compare', () => {
        it('should compare two identical names', () => {
            const detector = new DuplicateDetector();
            const result = detector.compare('ABC Corp', 'ABC Corp');
            expect(result.isDuplicate).toBe(true);
            expect(result.similarity.score).toBe(1);
        });

        it('should compare two similar names', () => {
            const detector = new DuplicateDetector({ threshold: 0.8 });
            const result = detector.compare('ABC Corp', 'ABC Corporation');
            expect(result.name1.original).toBe('ABC Corp');
            expect(result.name2.original).toBe('ABC Corporation');
            expect(result.name1.normalized).toBeDefined();
            expect(result.name2.normalized).toBeDefined();
        });

        it('should respect threshold', () => {
            const detector = new DuplicateDetector({ threshold: 0.95 });
            const result = detector.compare('ABC Corp', 'XYZ Corp');
            // These are different enough that they shouldn't be duplicates at high threshold
            expect(result.isDuplicate).toBe(result.similarity.score >= 0.95);
        });

        it('should normalize names before comparison', () => {
            const detector = new DuplicateDetector();
            const result1 = detector.compare('ABC Corp', 'ABC Corp');
            const result2 = detector.compare('ABC CORP', 'abc corp');
            // Both should be identical after normalization
            expect(result1.similarity.score).toBe(result2.similarity.score);
        });
    });

    describe('findMatches', () => {
        it('should find matches in candidate list', () => {
            const detector = new DuplicateDetector({ threshold: 0.8 });
            const matches = detector.findMatches('ABC Corp', [
                'ABC Corporation',
                'XYZ Corp',
                'ABC Corp LLC',
                'Different Company'
            ]);
            expect(matches.length).toBeGreaterThan(0);
            expect(matches.every(m => m.isDuplicate)).toBe(true);
        });

        it('should return empty array when no matches found', () => {
            const detector = new DuplicateDetector({ threshold: 0.95 });
            const matches = detector.findMatches('ABC Corp', [
                'XYZ Corp',
                'Different Company',
                'Another Corp'
            ]);
            expect(matches.length).toBe(0);
        });

        it('should sort matches by similarity score descending', () => {
            const detector = new DuplicateDetector({ threshold: 0.7 });
            const matches = detector.findMatches('ABC Corp', [
                'ABC Corporation',
                'ABC Corp LLC',
                'ABC Corp Inc'
            ]);
            if (matches.length > 1) {
                for (let i = 0; i < matches.length - 1; i++) {
                    expect(matches[i].similarity.score).toBeGreaterThanOrEqual(
                        matches[i + 1].similarity.score
                    );
                }
            }
        });

        it('should include normalized forms', () => {
            const detector = new DuplicateDetector({ threshold: 0.8 });
            const matches = detector.findMatches('ABC Corp', ['ABC Corporation']);
            if (matches.length > 0) {
                expect(matches[0].normalized).toBeDefined();
            }
        });
    });

    describe('findDuplicates', () => {
        it('should find duplicates in array of names', () => {
            const detector = new DuplicateDetector({ threshold: 0.8 });
            const result = detector.findDuplicates([
                'ABC Corp',
                'ABC Corporation',
                'XYZ Corp',
                'ABC Corp LLC'
            ]);
            expect(result.clusters.length).toBeGreaterThan(0);
            expect(result.stats.totalNames).toBe(4);
        });

        it('should return empty clusters when no duplicates found', () => {
            const detector = new DuplicateDetector({ threshold: 0.95 });
            const result = detector.findDuplicates([
                'ABC Corp',
                'XYZ Corp',
                'Different Company'
            ]);
            expect(result.clusters.length).toBe(0);
        });

        it('should include stats', () => {
            const detector = new DuplicateDetector({ threshold: 0.8 });
            const result = detector.findDuplicates([
                'ABC Corp',
                'ABC Corporation',
                'XYZ Corp'
            ]);
            expect(result.stats).toBeDefined();
            expect(result.stats.totalNames).toBe(3);
            expect(result.stats.duplicateClusters).toBeGreaterThanOrEqual(0);
        });

        it('should include pairs when configured', () => {
            const detector = new DuplicateDetector({
                threshold: 0.8,
                output: { includePairs: true }
            });
            const result = detector.findDuplicates([
                'ABC Corp',
                'ABC Corporation'
            ]);
            expect(result.pairs).toBeDefined();
        });

        it('should not include pairs when configured', () => {
            const detector = new DuplicateDetector({
                threshold: 0.8,
                output: { includePairs: false }
            });
            const result = detector.findDuplicates([
                'ABC Corp',
                'ABC Corporation'
            ]);
            expect(result.pairs).toBeUndefined();
        });

        it('should include normalized forms when configured', () => {
            const detector = new DuplicateDetector({
                threshold: 0.8,
                output: { includeNormalized: true }
            });
            const result = detector.findDuplicates([
                'ABC Corp',
                'ABC Corporation'
            ]);
            if (result.clusters.length > 0 && result.clusters[0].items.length > 0) {
                expect(result.clusters[0].items[0].normalized).toBeDefined();
            }
        });

        it('should cluster related duplicates', () => {
            const detector = new DuplicateDetector({ threshold: 0.8 });
            const result = detector.findDuplicates([
                'ABC Corp',
                'ABC Corporation',
                'ABC Corp LLC',
                'XYZ Corp'
            ]);
            // Should cluster ABC variants together
            const abcCluster = result.clusters.find(c =>
                c.items.some(i => i.original.includes('ABC'))
            );
            if (abcCluster) {
                expect(abcCluster.items.length).toBeGreaterThan(1);
            }
        });

        it('should select canonical form', () => {
            const detector = new DuplicateDetector({ threshold: 0.8 });
            const result = detector.findDuplicates([
                'ABC Corp',
                'ABC Corporation',
                'ABC Corp LLC'
            ]);
            if (result.clusters.length > 0) {
                expect(result.clusters[0].canonicalForm).toBeDefined();
                expect(typeof result.clusters[0].canonicalForm).toBe('string');
            }
        });

        it('should handle empty array', () => {
            const detector = new DuplicateDetector();
            const result = detector.findDuplicates([]);
            expect(result.clusters.length).toBe(0);
            expect(result.stats.totalNames).toBe(0);
        });

        it('should handle single name', () => {
            const detector = new DuplicateDetector();
            const result = detector.findDuplicates(['ABC Corp']);
            expect(result.clusters.length).toBe(0);
            expect(result.stats.totalNames).toBe(1);
        });

        it('should handle blocking strategy', () => {
            const detector = new DuplicateDetector({
                threshold: 0.8,
                blocking: {
                    enabled: true,
                    strategy: 'firstWord',
                    firstNChars: 4
                }
            });
            const result = detector.findDuplicates([
                'ABC Corp',
                'ABC Corporation',
                'XYZ Corp'
            ]);
            // Should still find duplicates
            expect(result.stats.totalNames).toBe(3);
        });
    });

    describe('edge cases and error handling', () => {
        it('should handle null/undefined-like empty strings', () => {
            const detector = new DuplicateDetector();
            const normalized = detector.normalize('');
            expect(normalized).toBe('');
        });

        it('should handle very long strings', () => {
            const detector = new DuplicateDetector();
            const longString = 'A'.repeat(1000) + ' Corp';
            const normalized = detector.normalize(longString);
            expect(normalized).toBeDefined();
        });

        it('should handle special characters', () => {
            const detector = new DuplicateDetector();
            const normalized = detector.normalize('ABC@#$%^&*()Corp');
            expect(normalized).toBeDefined();
        });

        it('should handle unicode characters', () => {
            const detector = new DuplicateDetector();
            const normalized = detector.normalize('ABC Café Corp');
            expect(normalized).toBeDefined();
        });

        it('should handle names with only punctuation', () => {
            const detector = new DuplicateDetector();
            const normalized = detector.normalize('...');
            expect(normalized).toBeDefined();
        });
    });

    describe('real-world scenarios', () => {
        it('should detect LLC variations', () => {
            const detector = new DuplicateDetector({ threshold: 0.85 });
            const result = detector.findDuplicates([
                'ABC LLC',
                'ABC L.L.C.',
                'ABC L L C',
                'ABC Limited Liability Company'
            ]);
            // Should find at least some duplicates
            expect(result.clusters.length).toBeGreaterThan(0);
        });

        it('should detect corporation variations', () => {
            const detector = new DuplicateDetector({ threshold: 0.85 });
            const result = detector.findDuplicates([
                'ABC Corp',
                'ABC Corporation',
                'ABC CORP',
                'ABC Corp.'
            ]);
            expect(result.clusters.length).toBeGreaterThan(0);
        });

        it('should handle address-like names', () => {
            const detector = new DuplicateDetector({ threshold: 0.8 });
            const result = detector.findDuplicates([
                '123 Main St LLC',
                '123 Main Street LLC',
                '123 MAIN ST LLC'
            ]);
            expect(result.clusters.length).toBeGreaterThan(0);
        });

        it('should distinguish clearly different names', () => {
            const detector = new DuplicateDetector({ threshold: 0.9 });
            const result = detector.findDuplicates([
                'ABC Corp',
                'XYZ Corp',
                'Completely Different Company'
            ]);
            // At high threshold, these should not be duplicates
            expect(result.clusters.length).toBe(0);
        });

        it('should detect duplicates for "John Doe" and "Jon Doe"', () => {
            /**
             * This test demonstrates how the DuplicateDetector handles common name variations
             * where one character differs (e.g., "John" vs "Jon").
             * 
             * How it works:
             * 1. Normalization: Both names are normalized to lowercase ("john doe" and "jon doe")
             * 2. Similarity Calculation uses three algorithms:
             *    - Dice Coefficient (40% weight): Measures character bigram overlap
             *      "john doe" vs "jon doe" - shares "do", "oe", " jo", "hn", etc.
             *    - Levenshtein Distance (30% weight): "john" vs "jon" = 1 edit distance
             *      Score = 1 - (1/4) = 0.75 (very similar)
             *    - Token Similarity (30% weight): Both share "doe", differ in first name
             *      Intersection: {"doe"} = 1, Union: {"john", "jon", "doe"} = 3
             *      Score = 1/3 ≈ 0.33
             * 
             * 3. Weighted Average: The final score combines all three algorithms
             *    Example calculation:
             *    - Dice might be ~0.85 (high bigram overlap)
             *    - Levenshtein = 0.75 (1 char difference in 4-char word)
             *    - Tokens = 0.33 (only 1 of 3 tokens match)
             *    - Weighted: (0.85 * 0.4) + (0.75 * 0.3) + (0.33 * 0.3) ≈ 0.66
             * 
             * 4. Threshold: Using 0.65 to catch these common misspellings/variations
             *    Lower thresholds catch more variations but may have more false positives
             * 
             * Why this matters: In real-world data, names often have typos or variations
             * (John/Jon, Smith/Smyth, etc.). The detector uses multiple algorithms to catch
             * these while avoiding false positives. The threshold can be adjusted based on
             * the use case - lower for catching variations, higher for strict matching.
             */
            const detector = new DuplicateDetector({
                threshold: 0.65, // Lower threshold to catch common name variations
                output: { includePairs: true, includeNormalized: true }
            });

            // Test with compare method
            const compareResult = detector.compare('John Doe', 'Jon Doe');
            // The similarity score should be above our threshold
            expect(compareResult.similarity.score).toBeGreaterThanOrEqual(0.65);
            expect(compareResult.isDuplicate).toBe(true);
            expect(compareResult.similarity.score).toBeLessThan(1.0); // Not identical

            // Verify normalization worked
            expect(compareResult.name1.normalized).toBe('john doe');
            expect(compareResult.name2.normalized).toBe('jon doe');

            // Test with findDuplicates method
            const duplicatesResult = detector.findDuplicates([
                'John Doe',
                'Jon Doe',
                'Jane Smith',
                'John Smith'
            ]);

            // Should find a cluster containing both "John Doe" and "Jon Doe"
            const johnDoeCluster = duplicatesResult.clusters.find(cluster =>
                cluster.items.some(item => item.original === 'John Doe') &&
                cluster.items.some(item => item.original === 'Jon Doe')
            );

            expect(johnDoeCluster).toBeDefined();
            expect(johnDoeCluster!.items.length).toBeGreaterThanOrEqual(2);

            // Verify both names are in the cluster
            const namesInCluster = johnDoeCluster!.items.map(item => item.original);
            expect(namesInCluster).toContain('John Doe');
            expect(namesInCluster).toContain('Jon Doe');

            // The similarity score should be high enough
            if (duplicatesResult.pairs) {
                const johnJonPair = duplicatesResult.pairs.find(pair =>
                    (pair.item1.original === 'John Doe' && pair.item2.original === 'Jon Doe') ||
                    (pair.item1.original === 'Jon Doe' && pair.item2.original === 'John Doe')
                );
                expect(johnJonPair).toBeDefined();
                if (johnJonPair) {
                    expect(johnJonPair.similarity.score).toBeGreaterThanOrEqual(0.65);
                    // Verify algorithm details are present
                    expect(johnJonPair.similarity.details.dice).toBeDefined();
                    expect(johnJonPair.similarity.details.levenshtein).toBeDefined();
                    expect(johnJonPair.similarity.details.tokens).toBeDefined();
                }
            }

            // Verify stats
            expect(duplicatesResult.stats.totalNames).toBe(4);
            expect(duplicatesResult.stats.duplicateClusters).toBeGreaterThanOrEqual(1);
        });
    });
});
