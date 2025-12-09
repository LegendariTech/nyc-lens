// Import fastest-levenshtein for efficient Levenshtein distance calculation
import { distance as levenshteinDistance } from 'fastest-levenshtein';

// Dice coefficient (Sørensen–Dice coefficient) implementation
// This calculates similarity based on bigrams (character pairs)
const compareTwoStrings = (str1: string, str2: string): number => {
    if (str1 === str2) return 1;
    if (str1.length < 2 || str2.length < 2) return 0;

    // Generate bigrams
    const getBigrams = (str: string): Map<string, number> => {
        const bigrams = new Map<string, number>();
        for (let i = 0; i < str.length - 1; i++) {
            const bigram = str.substring(i, i + 2);
            bigrams.set(bigram, (bigrams.get(bigram) || 0) + 1);
        }
        return bigrams;
    };

    const bigrams1 = getBigrams(str1);
    const bigrams2 = getBigrams(str2);

    // Calculate intersection
    let intersection = 0;
    for (const [bigram, count1] of bigrams1) {
        const count2 = bigrams2.get(bigram) || 0;
        intersection += Math.min(count1, count2);
    }

    // Dice coefficient formula: 2 * |intersection| / (|set1| + |set2|)
    const size1 = str1.length - 1;
    const size2 = str2.length - 1;
    return (2 * intersection) / (size1 + size2);
};

// ============ TYPE DEFINITIONS ============

export interface AlgorithmConfig {
    enabled: boolean;
    weight: number;
}

export interface NormalizationConfig {
    lowercase: boolean;
    removeQuotes: boolean;
    collapseWhitespace: boolean;
    removePunctuation: boolean;
    trimWhitespace: boolean;
}

export interface ReplacementMap {
    [key: string]: string;
}

export interface ReplacementCategory {
    enabled: boolean;
    map: ReplacementMap;
}

export interface ReplacementsConfig {
    numbers: ReplacementCategory;
    businessSuffixes: ReplacementCategory;
    custom: ReplacementCategory;
}

export interface RemoveTokensConfig {
    enabled: boolean;
    tokens: string[];
}

export interface SuffixHandlingConfig {
    enabled: boolean;
    mode: 'normalize' | 'remove' | 'keep';
    suffixes: string[];
}

export interface BlockingConfig {
    enabled: boolean;
    strategy: 'firstWord' | 'firstNChars' | 'ngrams' | 'custom';
    firstNChars: number;
}

export interface OutputConfig {
    includeScores: boolean;
    includePairs: boolean;
    includeNormalized: boolean;
}

export interface DuplicateDetectorConfig {
    threshold?: number;
    algorithms?: {
        dice?: Partial<AlgorithmConfig>;
        levenshtein?: Partial<AlgorithmConfig>;
        tokens?: Partial<AlgorithmConfig>;
    };
    normalization?: Partial<NormalizationConfig>;
    replacements?: {
        numbers?: Partial<ReplacementCategory>;
        businessSuffixes?: Partial<ReplacementCategory>;
        custom?: Partial<ReplacementCategory>;
    };
    removeTokens?: Partial<RemoveTokensConfig>;
    suffixHandling?: Partial<SuffixHandlingConfig>;
    blocking?: Partial<BlockingConfig>;
    output?: Partial<OutputConfig>;
}

interface ProcessedItem {
    index: number;
    original: string;
    normalized: string;
    blockKeys: string[];
}

interface SimilarityResult {
    score: number;
    details: {
        dice?: number;
        levenshtein?: number;
        tokens?: number;
    };
}

interface DuplicatePair {
    item1: ProcessedItem;
    item2: ProcessedItem;
    similarity: SimilarityResult;
}

interface DuplicateCluster {
    id: number;
    items: Array<{
        original: string;
        normalized?: string;
    }>;
    canonicalForm: string;
}

interface DuplicateStats {
    totalNames: number;
    uniqueNormalized: number;
    duplicateClusters: number;
    totalDuplicates: number;
}

export interface FindDuplicatesResult {
    clusters: DuplicateCluster[];
    pairs?: DuplicatePair[];
    stats: DuplicateStats;
}

interface CompareResult {
    name1: { original: string; normalized: string };
    name2: { original: string; normalized: string };
    similarity: SimilarityResult;
    isDuplicate: boolean;
}

interface MatchResult {
    candidate: string;
    normalized: string;
    similarity: SimilarityResult;
    isDuplicate: boolean;
}

// ============ CLASS IMPLEMENTATION ============

export class DuplicateDetector {
    private config: {
        threshold: number;
        algorithms: {
            dice: AlgorithmConfig;
            levenshtein: AlgorithmConfig;
            tokens: AlgorithmConfig;
        };
        normalization: NormalizationConfig;
        replacements: ReplacementsConfig;
        removeTokens: RemoveTokensConfig;
        suffixHandling: SuffixHandlingConfig;
        blocking: BlockingConfig;
        output: OutputConfig;
    };

    constructor(config: DuplicateDetectorConfig = {}) {
        // Deep merge config with defaults
        const defaultConfig = this.getDefaultConfig();
        this.config = this.deepMergeConfig(defaultConfig, config);
    }

    private getDefaultConfig() {
        return {
            threshold: 0.85,
            algorithms: {
                dice: { enabled: true, weight: 0.4 },
                levenshtein: { enabled: true, weight: 0.3 },
                tokens: { enabled: true, weight: 0.3 },
            },
            normalization: {
                lowercase: true,
                removeQuotes: true,
                collapseWhitespace: true,
                removePunctuation: true,
                trimWhitespace: true,
            },
            replacements: {
                numbers: {
                    enabled: true,
                    map: {
                        'ONE': '1', 'TWO': '2', 'THREE': '3', 'FOUR': '4', 'FIVE': '5',
                        'SIX': '6', 'SEVEN': '7', 'EIGHT': '8', 'NINE': '9', 'TEN': '10',
                        'FIRST': '1ST', 'SECOND': '2ND', 'THIRD': '3RD', 'FOURTH': '4TH',
                    }
                },
                businessSuffixes: {
                    enabled: true,
                    map: {
                        'L.P.': 'LP', 'L. P.': 'LP', 'L P': 'LP',
                        'L.L.C.': 'LLC', 'L.L.C': 'LLC', 'L L C': 'LLC',
                        'INC.': 'INC', 'INCORPORATED': 'INC',
                        'CORP.': 'CORP', 'CORPORATION': 'CORP',
                        'CO.': 'CO', 'COMPANY': 'CO',
                        'LTD.': 'LTD', 'LIMITED': 'LTD',
                        'ASSOC.': 'ASSOC', 'ASSOCIATES': 'ASSOC', 'ASSOCIATION': 'ASSOC',
                        'MGMT': 'MANAGEMENT', 'MGT': 'MANAGEMENT',
                        'PROP': 'PROPERTIES', 'PROPS': 'PROPERTIES',
                        'RLTY': 'REALTY',
                        'HLDG': 'HOLDING', 'HLDGS': 'HOLDINGS',
                        'GRP': 'GROUP', 'GP': 'GROUP',
                        'INTL': 'INTERNATIONAL', "INT'L": 'INTERNATIONAL',
                        'DEPT': 'DEPARTMENT',
                        'CTR': 'CENTER',
                        'BLDG': 'BUILDING',
                        'SVC': 'SERVICE', 'SVCS': 'SERVICES',
                        'DEV': 'DEVELOPMENT',
                    }
                },
                custom: { enabled: true, map: {} }
            },
            removeTokens: { enabled: false, tokens: ['THE', 'OF', 'AND', '&'] },
            suffixHandling: {
                enabled: true,
                mode: 'normalize',
                suffixes: ['LLC', 'LP', 'INC', 'CORP', 'CO', 'LTD', 'ASSOC', 'TRUST', 'PARTNERS', 'PARTNERSHIP']
            } as SuffixHandlingConfig,
            blocking: { enabled: false, strategy: 'firstWord', firstNChars: 4 } as BlockingConfig,
            output: { includeScores: true, includePairs: true, includeNormalized: true },
        };
    }

    private deepMergeConfig(
        target: ReturnType<typeof this.getDefaultConfig>,
        source: DuplicateDetectorConfig
    ): typeof target {
        const result = { ...target };

        if (source.threshold !== undefined) {
            result.threshold = source.threshold;
        }

        if (source.algorithms) {
            if (source.algorithms.dice) {
                result.algorithms.dice = { ...result.algorithms.dice, ...source.algorithms.dice };
            }
            if (source.algorithms.levenshtein) {
                result.algorithms.levenshtein = { ...result.algorithms.levenshtein, ...source.algorithms.levenshtein };
            }
            if (source.algorithms.tokens) {
                result.algorithms.tokens = { ...result.algorithms.tokens, ...source.algorithms.tokens };
            }
        }

        if (source.normalization) {
            result.normalization = { ...result.normalization, ...source.normalization };
        }

        if (source.replacements) {
            if (source.replacements.numbers) {
                result.replacements.numbers = {
                    ...result.replacements.numbers,
                    ...source.replacements.numbers,
                    map: { ...result.replacements.numbers.map, ...(source.replacements.numbers.map || {}) }
                };
            }
            if (source.replacements.businessSuffixes) {
                result.replacements.businessSuffixes = {
                    ...result.replacements.businessSuffixes,
                    ...source.replacements.businessSuffixes,
                    map: { ...result.replacements.businessSuffixes.map, ...(source.replacements.businessSuffixes.map || {}) }
                };
            }
            if (source.replacements.custom) {
                result.replacements.custom = {
                    ...result.replacements.custom,
                    ...source.replacements.custom,
                    map: { ...result.replacements.custom.map, ...(source.replacements.custom.map || {}) }
                };
            }
        }

        if (source.removeTokens) {
            result.removeTokens = { ...result.removeTokens, ...source.removeTokens };
        }

        if (source.suffixHandling) {
            result.suffixHandling = { ...result.suffixHandling, ...source.suffixHandling };
        }

        if (source.blocking) {
            result.blocking = { ...result.blocking, ...source.blocking };
        }

        if (source.output) {
            result.output = { ...result.output, ...source.output };
        }

        return result;
    }

    // ============ NORMALIZATION PIPELINE ============

    normalize(str: string): string {
        if (!str) return '';

        let result = str;
        const opts = this.config.normalization;

        // Remove quotes
        if (opts.removeQuotes) {
            result = result.replace(/["""''`]/g, '');
        }

        // Collapse whitespace
        if (opts.collapseWhitespace) {
            result = result.replace(/\s+/g, ' ');
        }

        // Trim
        if (opts.trimWhitespace) {
            result = result.trim();
        }

        // Uppercase for consistent processing (we'll lowercase at the end if needed)
        result = result.toUpperCase();

        // Apply replacements
        result = this.applyReplacements(result);

        // Remove punctuation (after replacements so "L.P." -> "LP" works)
        if (opts.removePunctuation) {
            result = result.replace(/[.,\-_']/g, ' ').replace(/\s+/g, ' ').trim();
        }

        // Remove tokens
        if (this.config.removeTokens.enabled) {
            const tokens = this.config.removeTokens.tokens;
            const tokenPattern = new RegExp(`\\b(${tokens.join('|')})\\b`, 'gi');
            result = result.replace(tokenPattern, ' ').replace(/\s+/g, ' ').trim();
        }

        // Handle suffixes
        result = this.handleSuffixes(result);

        // Final lowercase if configured
        if (opts.lowercase) {
            result = result.toLowerCase();
        }

        return result;
    }

    private applyReplacements(str: string): string {
        let result = str;
        const replacements = this.config.replacements;

        for (const [, config] of Object.entries(replacements)) {
            if (!config.enabled) continue;

            // Sort by length descending to replace longer matches first
            const sortedKeys = Object.keys(config.map).sort((a, b) => b.length - a.length);

            for (const key of sortedKeys) {
                const pattern = new RegExp(`\\b${this.escapeRegex(key)}\\b`, 'gi');
                result = result.replace(pattern, config.map[key]);
            }
        }

        return result;
    }

    private handleSuffixes(str: string): string {
        const config = this.config.suffixHandling;
        if (!config.enabled) return str;

        const suffixPattern = new RegExp(
            `\\b(${config.suffixes.join('|')})\\b`,
            'gi'
        );

        switch (config.mode) {
            case 'remove':
                return str.replace(suffixPattern, '').replace(/\s+/g, ' ').trim();
            case 'normalize':
                // Already normalized via replacements, just ensure consistency
                return str;
            case 'keep':
            default:
                return str;
        }
    }

    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    // ============ SIMILARITY ALGORITHMS ============

    calculateSimilarity(str1: string, str2: string): SimilarityResult {
        const algorithms = this.config.algorithms;
        let totalWeight = 0;
        let weightedScore = 0;
        const scores: SimilarityResult['details'] = {};

        // Dice coefficient (string-similarity)
        if (algorithms.dice?.enabled) {
            const score = compareTwoStrings(str1, str2);
            scores.dice = score;
            weightedScore += score * algorithms.dice.weight;
            totalWeight += algorithms.dice.weight;
        }

        // Levenshtein distance (normalized)
        if (algorithms.levenshtein?.enabled) {
            const distance = levenshteinDistance(str1, str2);
            const maxLen = Math.max(str1.length, str2.length);
            const score = maxLen === 0 ? 1 : 1 - (distance / maxLen);
            scores.levenshtein = score;
            weightedScore += score * algorithms.levenshtein.weight;
            totalWeight += algorithms.levenshtein.weight;
        }

        // Token-based (Jaccard on words)
        if (algorithms.tokens?.enabled) {
            const score = this.tokenSimilarity(str1, str2);
            scores.tokens = score;
            weightedScore += score * algorithms.tokens.weight;
            totalWeight += algorithms.tokens.weight;
        }

        const finalScore = totalWeight > 0 ? weightedScore / totalWeight : 0;

        return {
            score: finalScore,
            details: scores
        };
    }

    private tokenSimilarity(str1: string, str2: string): number {
        const tokens1 = new Set(str1.split(/\s+/).filter(Boolean));
        const tokens2 = new Set(str2.split(/\s+/).filter(Boolean));

        const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
        const union = new Set([...tokens1, ...tokens2]);

        return union.size === 0 ? 1 : intersection.size / union.size;
    }

    // ============ BLOCKING (Performance Optimization) ============

    private getBlockKey(normalizedStr: string): string | string[] {
        const config = this.config.blocking;
        if (!config.enabled) return 'all';

        switch (config.strategy) {
            case 'firstWord':
                return normalizedStr.split(/\s+/)[0] || '';
            case 'firstNChars':
                return normalizedStr.substring(0, config.firstNChars);
            case 'ngrams':
                // Return multiple block keys for n-gram blocking
                return this.getNGrams(normalizedStr, 3);
            default:
                return 'all';
        }
    }

    private getNGrams(str: string, n: number): string[] {
        const ngrams: string[] = [];
        const cleaned = str.replace(/\s+/g, '');
        for (let i = 0; i <= cleaned.length - n; i++) {
            ngrams.push(cleaned.substring(i, i + n));
        }
        return ngrams;
    }

    // ============ MAIN DETECTION METHODS ============

    /**
     * Process an array of names and find duplicates
     */
    findDuplicates(names: string[]): FindDuplicatesResult {
        // Normalize all names
        const processed: ProcessedItem[] = names.map((original, index) => {
            const normalized = this.normalize(original);
            const blockKeyResult = this.getBlockKey(normalized);
            const blockKeys = Array.isArray(blockKeyResult) ? blockKeyResult : [blockKeyResult];

            return {
                index,
                original,
                normalized,
                blockKeys: this.config.blocking.enabled ? blockKeys : ['all']
            };
        });

        // Build blocks
        const blocks = new Map<string, ProcessedItem[]>();
        for (const item of processed) {
            for (const key of item.blockKeys) {
                if (!blocks.has(key)) blocks.set(key, []);
                blocks.get(key)!.push(item);
            }
        }

        // Find pairs
        const pairs: DuplicatePair[] = [];
        const compared = new Set<string>();

        for (const [, items] of blocks) {
            for (let i = 0; i < items.length; i++) {
                for (let j = i + 1; j < items.length; j++) {
                    const pairKey = [items[i].index, items[j].index].sort((a, b) => a - b).join('-');
                    if (compared.has(pairKey)) continue;
                    compared.add(pairKey);

                    const similarity = this.calculateSimilarity(
                        items[i].normalized,
                        items[j].normalized
                    );

                    if (similarity.score >= this.config.threshold) {
                        pairs.push({
                            item1: items[i],
                            item2: items[j],
                            similarity
                        });
                    }
                }
            }
        }

        // Cluster pairs into groups
        const clusters = this.clusterPairs(pairs, processed);

        return {
            clusters,
            pairs: this.config.output.includePairs ? pairs : undefined,
            stats: {
                totalNames: names.length,
                uniqueNormalized: new Set(processed.map(p => p.normalized)).size,
                duplicateClusters: clusters.length,
                totalDuplicates: clusters.reduce((sum, c) => sum + c.items.length, 0)
            }
        };
    }

    private clusterPairs(pairs: DuplicatePair[], processed: ProcessedItem[]): DuplicateCluster[] {
        // Union-Find for clustering
        const parent = new Map<number, number>();

        const find = (x: number): number => {
            if (!parent.has(x)) parent.set(x, x);
            const px = parent.get(x)!;
            if (px !== x) {
                parent.set(x, find(px));
            }
            return parent.get(x)!;
        };

        const union = (x: number, y: number): void => {
            const px = find(x);
            const py = find(y);
            if (px !== py) parent.set(px, py);
        };

        // Union all pairs
        for (const pair of pairs) {
            union(pair.item1.index, pair.item2.index);
        }

        // Group by root
        const groups = new Map<number, ProcessedItem[]>();
        for (const item of processed) {
            const root = find(item.index);
            if (!groups.has(root)) groups.set(root, []);
            groups.get(root)!.push(item);
        }

        // Filter to only groups with duplicates
        const clusters: DuplicateCluster[] = [];
        for (const [root, items] of groups) {
            if (items.length > 1) {
                clusters.push({
                    id: root,
                    items: items.map(i => ({
                        original: i.original,
                        normalized: this.config.output.includeNormalized ? i.normalized : undefined
                    })),
                    canonicalForm: this.selectCanonical(items)
                });
            }
        }

        return clusters;
    }

    private selectCanonical(items: ProcessedItem[]): string {
        // Select the "best" canonical form - shortest non-empty, most common, or first
        const counts: Record<string, number> = {};
        for (const item of items) {
            counts[item.normalized] = (counts[item.normalized] || 0) + 1;
        }

        // Find most common normalized form
        let maxCount = 0;
        let canonical = items[0].original;

        for (const item of items) {
            const count = counts[item.normalized];
            if (count > maxCount || (count === maxCount && item.original.length < canonical.length)) {
                maxCount = count;
                canonical = item.original;
            }
        }

        return canonical;
    }

    /**
     * Compare two specific names
     */
    compare(name1: string, name2: string): CompareResult {
        const norm1 = this.normalize(name1);
        const norm2 = this.normalize(name2);
        const similarity = this.calculateSimilarity(norm1, norm2);

        return {
            name1: { original: name1, normalized: norm1 },
            name2: { original: name2, normalized: norm2 },
            similarity,
            isDuplicate: similarity.score >= this.config.threshold
        };
    }

    /**
     * Find matches for a single name against a list
     */
    findMatches(name: string, candidates: string[]): MatchResult[] {
        const normName = this.normalize(name);

        return candidates
            .map(candidate => {
                const normCandidate = this.normalize(candidate);
                const similarity = this.calculateSimilarity(normName, normCandidate);
                return {
                    candidate,
                    normalized: normCandidate,
                    similarity,
                    isDuplicate: similarity.score >= this.config.threshold
                };
            })
            .filter(r => r.isDuplicate)
            .sort((a, b) => b.similarity.score - a.similarity.score);
    }
}

export default DuplicateDetector;
