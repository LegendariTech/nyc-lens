import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { TimelineDot } from '../TimelineDot';

describe('TimelineDot', () => {
    describe('Basic rendering', () => {
        it('should render timeline dot element', () => {
            const { container } = render(<TimelineDot isDeed={true} />);
            const dot = container.querySelector('div');
            expect(dot).toBeInTheDocument();
        });

        it('should render with flex layout', () => {
            const { container } = render(<TimelineDot isDeed={true} />);
            const wrapper = container.querySelector('.flex.flex-col.items-center');
            expect(wrapper).toBeInTheDocument();
        });
    });

    describe('Deed styling', () => {
        it('should apply amber styling when isDeed is true', () => {
            const { container } = render(<TimelineDot isDeed={true} />);
            const dot = container.querySelector('.border-amber-500.bg-amber-500');
            expect(dot).toBeInTheDocument();
        });

        it('should have correct classes for deed dot', () => {
            const { container } = render(<TimelineDot isDeed={true} />);
            const dot = container.querySelector('.w-3.h-3.rounded-full.border-2');
            
            expect(dot).toHaveClass('border-amber-500');
            expect(dot).toHaveClass('bg-amber-500');
            expect(dot).not.toHaveClass('border-blue-500');
            expect(dot).not.toHaveClass('bg-blue-500');
        });

        it('should render with all deed-specific classes', () => {
            const { container } = render(<TimelineDot isDeed={true} />);
            const dot = container.querySelector('.w-3.h-3.rounded-full.border-2');
            
            expect(dot).toHaveClass('w-3');
            expect(dot).toHaveClass('h-3');
            expect(dot).toHaveClass('rounded-full');
            expect(dot).toHaveClass('border-2');
            expect(dot).toHaveClass('border-amber-500');
            expect(dot).toHaveClass('bg-amber-500');
        });
    });

    describe('Non-deed styling', () => {
        it('should apply blue styling when isDeed is false', () => {
            const { container } = render(<TimelineDot isDeed={false} />);
            const dot = container.querySelector('.border-blue-500.bg-blue-500');
            expect(dot).toBeInTheDocument();
        });

        it('should have correct classes for non-deed dot', () => {
            const { container } = render(<TimelineDot isDeed={false} />);
            const dot = container.querySelector('.w-3.h-3.rounded-full.border-2');
            
            expect(dot).toHaveClass('border-blue-500');
            expect(dot).toHaveClass('bg-blue-500');
            expect(dot).not.toHaveClass('border-amber-500');
            expect(dot).not.toHaveClass('bg-amber-500');
        });

        it('should render with all non-deed-specific classes', () => {
            const { container } = render(<TimelineDot isDeed={false} />);
            const dot = container.querySelector('.w-3.h-3.rounded-full.border-2');
            
            expect(dot).toHaveClass('w-3');
            expect(dot).toHaveClass('h-3');
            expect(dot).toHaveClass('rounded-full');
            expect(dot).toHaveClass('border-2');
            expect(dot).toHaveClass('border-blue-500');
            expect(dot).toHaveClass('bg-blue-500');
        });
    });

    describe('Connector line', () => {
        it('should render connector line below dot', () => {
            const { container } = render(<TimelineDot isDeed={true} />);
            const connector = container.querySelector('.w-0\\.5.flex-1.bg-foreground\\/20.mt-2');
            expect(connector).toBeInTheDocument();
        });

        it('should have correct connector line classes', () => {
            const { container } = render(<TimelineDot isDeed={true} />);
            const connector = container.querySelector('.w-0\\.5.flex-1.bg-foreground\\/20.mt-2');
            
            expect(connector).toHaveClass('w-0.5');
            expect(connector).toHaveClass('flex-1');
            expect(connector).toHaveClass('bg-foreground/20');
            expect(connector).toHaveClass('mt-2');
        });

        it('should render connector line for both deed and non-deed', () => {
            const { container: container1 } = render(<TimelineDot isDeed={true} />);
            const { container: container2 } = render(<TimelineDot isDeed={false} />);
            
            const connector1 = container1.querySelector('.w-0\\.5.flex-1.bg-foreground\\/20.mt-2');
            const connector2 = container2.querySelector('.w-0\\.5.flex-1.bg-foreground\\/20.mt-2');
            
            expect(connector1).toBeInTheDocument();
            expect(connector2).toBeInTheDocument();
        });
    });

    describe('Component structure', () => {
        it('should have wrapper div with flex layout', () => {
            const { container } = render(<TimelineDot isDeed={true} />);
            const wrapper = container.firstChild as HTMLElement;
            
            expect(wrapper).toHaveClass('flex');
            expect(wrapper).toHaveClass('flex-col');
            expect(wrapper).toHaveClass('items-center');
        });

        it('should have dot as first child', () => {
            const { container } = render(<TimelineDot isDeed={true} />);
            const wrapper = container.firstChild as HTMLElement;
            const dot = wrapper.children[0];
            
            expect(dot).toHaveClass('w-3');
            expect(dot).toHaveClass('h-3');
            expect(dot).toHaveClass('rounded-full');
        });

        it('should have connector line as second child', () => {
            const { container } = render(<TimelineDot isDeed={true} />);
            const wrapper = container.firstChild as HTMLElement;
            const connector = wrapper.children[1];
            
            expect(connector).toHaveClass('w-0.5');
            expect(connector).toHaveClass('flex-1');
        });

        it('should have exactly two children (dot and connector)', () => {
            const { container } = render(<TimelineDot isDeed={true} />);
            const wrapper = container.firstChild as HTMLElement;
            expect(wrapper.children.length).toBe(2);
        });
    });

    describe('Visual appearance', () => {
        it('should render circular dot (rounded-full)', () => {
            const { container } = render(<TimelineDot isDeed={true} />);
            const dot = container.querySelector('.rounded-full');
            expect(dot).toBeInTheDocument();
        });

        it('should have fixed size dot (w-3 h-3)', () => {
            const { container } = render(<TimelineDot isDeed={true} />);
            const dot = container.querySelector('.w-3.h-3');
            expect(dot).toBeInTheDocument();
        });

        it('should have border on dot (border-2)', () => {
            const { container } = render(<TimelineDot isDeed={true} />);
            const dot = container.querySelector('.border-2');
            expect(dot).toBeInTheDocument();
        });
    });

    describe('Edge cases', () => {
        it('should handle isDeed prop change', () => {
            const { container, rerender } = render(<TimelineDot isDeed={true} />);
            let dot = container.querySelector('.border-amber-500');
            expect(dot).toBeInTheDocument();

            rerender(<TimelineDot isDeed={false} />);
            dot = container.querySelector('.border-blue-500');
            expect(dot).toBeInTheDocument();
            expect(container.querySelector('.border-amber-500')).not.toBeInTheDocument();
        });

        it('should render consistently with same props', () => {
            const { container: container1 } = render(<TimelineDot isDeed={true} />);
            const { container: container2 } = render(<TimelineDot isDeed={true} />);
            
            const dot1 = container1.querySelector('.border-amber-500');
            const dot2 = container2.querySelector('.border-amber-500');
            
            expect(dot1).toBeInTheDocument();
            expect(dot2).toBeInTheDocument();
        });
    });

    describe('Accessibility', () => {
        it('should be a presentational element (no semantic meaning)', () => {
            const { container } = render(<TimelineDot isDeed={true} />);
            const wrapper = container.firstChild as HTMLElement;
            
            // It's a div with no ARIA attributes, which is appropriate for a decorative element
            expect(wrapper.tagName).toBe('DIV');
            expect(wrapper.getAttribute('role')).toBeNull();
            expect(wrapper.getAttribute('aria-label')).toBeNull();
        });
    });
});

