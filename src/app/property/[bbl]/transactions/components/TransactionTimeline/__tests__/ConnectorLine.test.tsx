import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ConnectorLine } from '../ConnectorLine';
import { TIMELINE_CONFIG } from '../constants';

describe('ConnectorLine', () => {
    describe('SVG rendering', () => {
        it('should render SVG with correct dimensions', () => {
            const { container } = render(<ConnectorLine isDeed={false} />);

            const svg = container.querySelector('svg');
            expect(svg).toBeInTheDocument();
            expect(svg).toHaveStyle({
                width: `${TIMELINE_CONFIG.CONNECTOR_LINE_WIDTH}px`,
                height: `${TIMELINE_CONFIG.CONNECTOR_LINE_HEIGHT}px`,
            });
        });

        it('should render dashed line', () => {
            const { container } = render(<ConnectorLine isDeed={false} />);

            const line = container.querySelector('line');
            expect(line).toBeInTheDocument();
            expect(line).toHaveAttribute('stroke-dasharray', '4 3');
        });

        it('should render end circle', () => {
            const { container } = render(<ConnectorLine isDeed={false} />);

            const circle = container.querySelector('circle');
            expect(circle).toBeInTheDocument();
            expect(circle).toHaveAttribute('r', String(TIMELINE_CONFIG.CONNECTOR_DOT_RADIUS));
        });
    });

    describe('Styling based on transaction type', () => {
        it('should apply amber color for DEED transactions', () => {
            const { container } = render(<ConnectorLine isDeed={true} />);

            const line = container.querySelector('line');
            expect(line).toHaveClass('text-amber-500/50');

            const circle = container.querySelector('circle');
            expect(circle).toHaveClass('text-amber-500');
        });

        it('should apply blue color for MORTGAGE transactions', () => {
            const { container } = render(<ConnectorLine isDeed={false} />);

            const line = container.querySelector('line');
            expect(line).toHaveClass('text-blue-500/50');

            const circle = container.querySelector('circle');
            expect(circle).toHaveClass('text-blue-500');
        });
    });

    describe('Line positioning', () => {
        it('should position line horizontally at center', () => {
            const { container } = render(<ConnectorLine isDeed={false} />);

            const line = container.querySelector('line');
            const centerY = TIMELINE_CONFIG.CONNECTOR_LINE_HEIGHT / 2;

            expect(line).toHaveAttribute('y1', String(centerY));
            expect(line).toHaveAttribute('y2', String(centerY));
        });

        it('should span full width', () => {
            const { container } = render(<ConnectorLine isDeed={false} />);

            const line = container.querySelector('line');

            expect(line).toHaveAttribute('x1', '0');
            expect(line).toHaveAttribute('x2', String(TIMELINE_CONFIG.CONNECTOR_LINE_WIDTH));
        });
    });

    describe('Circle positioning', () => {
        it('should position circle at end of line', () => {
            const { container } = render(<ConnectorLine isDeed={false} />);

            const circle = container.querySelector('circle');
            const centerY = TIMELINE_CONFIG.CONNECTOR_LINE_HEIGHT / 2;

            expect(circle).toHaveAttribute('cx', String(TIMELINE_CONFIG.CONNECTOR_LINE_WIDTH));
            expect(circle).toHaveAttribute('cy', String(centerY));
        });
    });
});

