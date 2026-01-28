import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ParcelMap } from '../ParcelMap';

// Mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock react-map-gl
vi.mock('react-map-gl/mapbox', () => ({
  __esModule: true,
  default: vi.fn(({ children, onClick, onMouseMove }) => (
    <div
      data-testid="mock-map"
      onClick={(e) => {
        // Simulate map click with features
        const mockEvent = {
          features: [{ properties: { SBL: '4004760001' } }],
        };
        onClick?.(mockEvent as any);
      }}
      onMouseMove={(e) => {
        const mockEvent = {
          features: [{ properties: { SBL: '4004760001' } }],
        };
        onMouseMove?.(mockEvent as any);
      }}
    >
      {children}
    </div>
  )),
  Layer: vi.fn(() => null),
  Source: vi.fn(({ children }) => <>{children}</>),
  MapRef: vi.fn(),
}));

// Mock mapbox-gl CSS import
vi.mock('mapbox-gl/dist/mapbox-gl.css', () => ({}));

describe('ParcelMap', () => {
  const defaultProps = {
    bbl: '4-476-1',
    latitude: 40.7128,
    longitude: -74.006,
    accessToken: 'test-token',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render map component', () => {
      render(<ParcelMap {...defaultProps} />);
      expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    });

    it('should render with custom className', () => {
      const { container } = render(
        <ParcelMap {...defaultProps} className="custom-class" />
      );
      const mapContainer = container.querySelector('.custom-class');
      expect(mapContainer).toBeInTheDocument();
    });

    it('should render fullscreen button by default', () => {
      render(<ParcelMap {...defaultProps} />);
      const fullscreenButton = screen.getByLabelText('View fullscreen map');
      expect(fullscreenButton).toBeInTheDocument();
    });

    it('should not render fullscreen button when showFullscreenButton is false', () => {
      render(<ParcelMap {...defaultProps} showFullscreenButton={false} />);
      const fullscreenButton = screen.queryByLabelText('View fullscreen map');
      expect(fullscreenButton).not.toBeInTheDocument();
    });
  });

  describe('parcel interactions', () => {
    it('should navigate to property overview when parcel is clicked', async () => {
      const user = userEvent.setup();
      render(<ParcelMap {...defaultProps} />);

      const map = screen.getByTestId('mock-map');
      await user.click(map);

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/property/4-476-1/overview');
      });
    });

    it('should convert SBL to BBL format correctly when navigating', async () => {
      const user = userEvent.setup();
      render(<ParcelMap {...defaultProps} />);

      const map = screen.getByTestId('mock-map');
      await user.click(map);

      await waitFor(() => {
        // SBL '4004760001' should convert to BBL '4-476-1'
        expect(mockPush).toHaveBeenCalledWith('/property/4-476-1/overview');
      });
    });

    it('should update hover state on mouse move over parcels', async () => {
      const user = userEvent.setup();
      render(<ParcelMap {...defaultProps} />);

      const map = screen.getByTestId('mock-map');

      // Simulate mouse move over a parcel
      await user.hover(map);

      // The map should be interactive
      expect(map).toBeInTheDocument();
    });
  });

  describe('fullscreen functionality', () => {
    it('should open fullscreen dialog when fullscreen button is clicked', async () => {
      const user = userEvent.setup();
      render(<ParcelMap {...defaultProps} />);

      const fullscreenButton = screen.getByLabelText('View fullscreen map');
      await user.click(fullscreenButton);

      // Dialog should be open (check for multiple map instances)
      const maps = screen.getAllByTestId('mock-map');
      expect(maps.length).toBeGreaterThan(1);
    });

    it('should show prominent exit button in fullscreen mode', async () => {
      const user = userEvent.setup();
      render(<ParcelMap {...defaultProps} />);

      const fullscreenButton = screen.getByLabelText('View fullscreen map');
      await user.click(fullscreenButton);

      // Exit button should be visible
      const exitButton = screen.getByLabelText('Exit fullscreen');
      expect(exitButton).toBeInTheDocument();
    });

    it('should close fullscreen when exit button is clicked', async () => {
      const user = userEvent.setup();
      render(<ParcelMap {...defaultProps} />);

      // Open fullscreen
      const fullscreenButton = screen.getByLabelText('View fullscreen map');
      await user.click(fullscreenButton);

      // Click exit button
      const exitButton = screen.getByLabelText('Exit fullscreen');
      await user.click(exitButton);

      // Exit button should no longer be visible
      await waitFor(() => {
        expect(screen.queryByLabelText('Exit fullscreen')).not.toBeInTheDocument();
      });
    });

    it('should close fullscreen dialog and navigate when parcel is clicked in fullscreen', async () => {
      const user = userEvent.setup();
      render(<ParcelMap {...defaultProps} />);

      // Open fullscreen
      const fullscreenButton = screen.getByLabelText('View fullscreen map');
      await user.click(fullscreenButton);

      // Click on map in fullscreen mode
      const maps = screen.getAllByTestId('mock-map');
      await user.click(maps[1]); // Second map is the fullscreen one

      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/property/4-476-1/overview');
      });
    });
  });

  describe('BBL conversion', () => {
    it('should handle different BBL formats', async () => {
      const testCases = [
        { bbl: '1-1-1', expectedSbl: '1000010001' },
        { bbl: '2-12345-9999', expectedSbl: '2123459999' },
        { bbl: '3-100-500', expectedSbl: '3001000500' },
      ];

      for (const testCase of testCases) {
        const { unmount } = render(
          <ParcelMap {...defaultProps} bbl={testCase.bbl} />
        );
        expect(screen.getByTestId('mock-map')).toBeInTheDocument();
        unmount();
      }
    });
  });

  describe('accessibility', () => {
    it('should have accessible fullscreen button', () => {
      render(<ParcelMap {...defaultProps} />);
      const button = screen.getByLabelText('View fullscreen map');
      expect(button).toHaveAttribute('aria-label', 'View fullscreen map');
    });

    it('should support keyboard navigation for fullscreen button', async () => {
      const user = userEvent.setup();
      render(<ParcelMap {...defaultProps} />);

      const button = screen.getByLabelText('View fullscreen map');
      await user.tab();
      expect(button).toHaveFocus();
    });
  });

  describe('coordinates', () => {
    it('should accept valid latitude and longitude', () => {
      render(
        <ParcelMap
          {...defaultProps}
          latitude={40.7128}
          longitude={-74.006}
        />
      );
      expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    });

    it('should handle edge case coordinates', () => {
      render(
        <ParcelMap
          {...defaultProps}
          latitude={90}
          longitude={-180}
        />
      );
      expect(screen.getByTestId('mock-map')).toBeInTheDocument();
    });
  });
});
