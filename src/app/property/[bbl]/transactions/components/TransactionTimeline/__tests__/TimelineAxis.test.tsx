import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TimelineAxis } from '../TimelineAxis';
import { TIMELINE_CONFIG } from '../constants';

describe('TimelineAxis', () => {
    describe('Basic rendering', () => {
        it('should render timeline axis element', () => {
            const { container } = render(<TimelineAxis />);
            const axis = container.querySelector('div');
            expect(axis).toBeInTheDocument();
        });

        it('should have absolute positioning', () => {
            const { container } = render(<TimelineAxis />);
            const axis = container.querySelector('.absolute');
            expect(axis).toBeInTheDocument();
        });

        it('should span from top to bottom', () => {
            const { container } = render(<TimelineAxis />);
            const axis = container.querySelector('.top-0.bottom-0');
            expect(axis).toBeInTheDocument();
        });
    });

    describe('Styling', () => {
        it('should have correct width class (w-0.5)', () => {
            const { container } = render(<TimelineAxis />);
            const axis = container.querySelector('.w-0\\.5');
            expect(axis).toBeInTheDocument();
        });

        it('should have background color with opacity', () => {
            const { container } = render(<TimelineAxis />);
            const axis = container.querySelector('.bg-foreground\\/20');
            expect(axis).toBeInTheDocument();
        });

        it('should have all required classes', () => {
            const { container } = render(<TimelineAxis />);
            const axis = container.firstChild as HTMLElement;
            
            expect(axis).toHaveClass('absolute');
            expect(axis).toHaveClass('top-0');
            expect(axis).toHaveClass('bottom-0');
            expect(axis).toHaveClass('w-0.5');
            expect(axis).toHaveClass('bg-foreground/20');
        });
    });

    describe('Positioning', () => {
        it('should use TIMELINE_AXIS_OFFSET from config for left position', () => {
            const { container } = render(<TimelineAxis />);
            const axis = container.firstChild as HTMLElement;
            
            expect(axis).toHaveStyle({
                left: `${TIMELINE_CONFIG.TIMELINE_AXIS_OFFSET}px`,
            });
        });

        it('should have inline style for left offset', () => {
            const { container } = render(<TimelineAxis />);
            const axis = container.firstChild as HTMLElement;
            
            const style = axis.getAttribute('style');
            expect(style).toContain(`left: ${TIMELINE_CONFIG.TIMELINE_AXIS_OFFSET}px`);
        });

        it('should use correct offset value from constants', () => {
            const { container } = render(<TimelineAxis />);
            const axis = container.firstChild as HTMLElement;
            
            // Verify it uses the constant value (should be 60 based on constants.ts)
            expect(axis.style.left).toBe(`${TIMELINE_CONFIG.TIMELINE_AXIS_OFFSET}px`);
        });
    });

    describe('Component structure', () => {
        it('should render as a single div element', () => {
            const { container } = render(<TimelineAxis />);
            const children = container.childNodes;
            expect(children.length).toBe(1);
            expect(children[0].nodeName).toBe('DIV');
        });

        it('should not have any child elements', () => {
            const { container } = render(<TimelineAxis />);
            const axis = container.firstChild as HTMLElement;
            expect(axis.children.length).toBe(0);
        });
    });

    describe('Accessibility', () => {
        it('should be a presentational element (no semantic meaning)', () => {
            const { container } = render(<TimelineAxis />);
            const axis = container.firstChild as HTMLElement;
            
            // It's a div with no ARIA attributes, which is appropriate for a decorative element
            expect(axis.tagName).toBe('DIV');
            expect(axis.getAttribute('role')).toBeNull();
            expect(axis.getAttribute('aria-label')).toBeNull();
        });
    });
});

