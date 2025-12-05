import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DateBubble } from '../DateBubble';
import { CATEGORY_METADATA } from '../utils';

describe('DateBubble', () => {
    describe('Date formatting', () => {
        it('should display formatted date', () => {
            render(<DateBubble date="2025-06-16" categoryMetadata={CATEGORY_METADATA.mortgage} />);

            expect(screen.getByText('Jun 16, 2025')).toBeInTheDocument();
        });

        it('should handle different date formats', () => {
            render(<DateBubble date="2023-10-10" categoryMetadata={CATEGORY_METADATA.deed} />);

            expect(screen.getByText('Oct 10, 2023')).toBeInTheDocument();
        });
    });

    describe('Styling based on transaction type', () => {
        it('should apply amber styling for DEED transactions', () => {
            const { container } = render(<DateBubble date="2025-06-16" categoryMetadata={CATEGORY_METADATA.deed} />);

            const bubble = container.querySelector('.border-amber-500');
            expect(bubble).toBeInTheDocument();

            const text = container.querySelector('.text-amber-500');
            expect(text).toBeInTheDocument();
        });

        it('should apply blue styling for MORTGAGE transactions', () => {
            const { container } = render(<DateBubble date="2025-06-16" categoryMetadata={CATEGORY_METADATA.mortgage} />);

            const bubble = container.querySelector('.border-blue-500');
            expect(bubble).toBeInTheDocument();

            const text = container.querySelector('.text-blue-500');
            expect(text).toBeInTheDocument();
        });

        it('should apply red styling for UCC/LIEN transactions', () => {
            const { container } = render(<DateBubble date="2025-06-16" categoryMetadata={CATEGORY_METADATA['ucc-lien']} />);

            const bubble = container.querySelector('.border-red-500');
            expect(bubble).toBeInTheDocument();

            const text = container.querySelector('.text-red-500');
            expect(text).toBeInTheDocument();
        });

        it('should apply gray styling for OTHER transactions', () => {
            const { container } = render(<DateBubble date="2025-06-16" categoryMetadata={CATEGORY_METADATA.other} />);

            const bubble = container.querySelector('.border-gray-500');
            expect(bubble).toBeInTheDocument();

            const text = container.querySelector('.text-gray-500');
            expect(text).toBeInTheDocument();
        });
    });

    describe('Layout', () => {
        it('should have rounded-full class for circular shape', () => {
            const { container } = render(<DateBubble date="2025-06-16" categoryMetadata={CATEGORY_METADATA.mortgage} />);

            const bubble = container.querySelector('.rounded-full');
            expect(bubble).toBeInTheDocument();
        });

        it('should prevent text wrapping', () => {
            const { container } = render(<DateBubble date="2025-06-16" categoryMetadata={CATEGORY_METADATA.mortgage} />);

            const text = container.querySelector('.whitespace-nowrap');
            expect(text).toBeInTheDocument();
        });
    });
});

