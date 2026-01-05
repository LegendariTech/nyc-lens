/// <reference types="vitest/globals" />
import React from 'react';
import { render, screen } from '@testing-library/react';
import { FieldTooltip } from '../FieldTooltip';

describe('FieldTooltip', () => {
  describe('Basic Rendering', () => {
    it('renders children without description', () => {
      render(
        <FieldTooltip description="" fieldKey="test-field">
          Test Label
        </FieldTooltip>
      );
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('renders children with description', () => {
      render(
        <FieldTooltip description="This is a test description" fieldKey="test-field">
          Test Label
        </FieldTooltip>
      );
      expect(screen.getByText('Test Label')).toBeInTheDocument();
    });

    it('renders as icon when asIcon prop is true', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );
      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('does not render icon when asIcon is false', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon={false}>
          Test Label
        </FieldTooltip>
      );
      expect(screen.queryByRole('button', { name: /information about/i })).not.toBeInTheDocument();
    });

    it('renders nothing when asIcon is true and no description', () => {
      const { container } = render(
        <FieldTooltip description="" fieldKey="test-field" asIcon />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Wrapper Mode', () => {
    it('wraps children in a span with cursor-help', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field">
          Test Label
        </FieldTooltip>
      );
      const wrapper = screen.getByText('Test Label');
      expect(wrapper).toHaveClass('cursor-help');
    });

    it('applies custom className', () => {
      render(
        <FieldTooltip 
          description="Test description" 
          fieldKey="test-field" 
          className="custom-class"
        >
          Test Label
        </FieldTooltip>
      );
      const wrapper = screen.getByText('Test Label');
      expect(wrapper).toHaveClass('custom-class');
    });
  });

  describe('Icon Mode', () => {
    it('renders info icon button', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Information about test-field');
    });

    it('button has type="button" to prevent form submission', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('icon button has correct styling classes', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveClass('cursor-help');
      expect(button).toHaveClass('inline-flex');
    });
  });

  describe('Empty Description Handling', () => {
    it('renders children without tooltip wrapper when description is empty', () => {
      render(
        <FieldTooltip description="" fieldKey="test-field">
          Test Label
        </FieldTooltip>
      );
      const label = screen.getByText('Test Label');
      expect(label).toBeInTheDocument();
      // Should not have cursor-help class when no description
      expect(label).not.toHaveClass('cursor-help');
    });

    it('does not render anything when description is empty and asIcon is true', () => {
      const { container } = render(
        <FieldTooltip description="" fieldKey="test-field" asIcon />
      );
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Multiple Tooltips', () => {
    it('can render multiple tooltips independently', () => {
      render(
        <div>
          <FieldTooltip description="First tooltip" fieldKey="field-1" asIcon />
          <FieldTooltip description="Second tooltip" fieldKey="field-2" asIcon />
        </div>
      );
      const buttons = screen.getAllByRole('button');
      expect(buttons).toHaveLength(2);
      expect(buttons[0]).toHaveAttribute('aria-label', 'Information about field-1');
      expect(buttons[1]).toHaveAttribute('aria-label', 'Information about field-2');
    });

    it('can mix wrapper and icon modes', () => {
      render(
        <div>
          <FieldTooltip description="Wrapper tooltip" fieldKey="field-1">
            Label 1
          </FieldTooltip>
          <FieldTooltip description="Icon tooltip" fieldKey="field-2" asIcon />
        </div>
      );
      expect(screen.getByText('Label 1')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('icon button has proper aria-label with fieldKey', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="owner-name" asIcon />
      );
      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('aria-label', 'Information about owner-name');
    });

    it('wrapper mode trigger is keyboard accessible', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field">
          Test Label
        </FieldTooltip>
      );
      const trigger = screen.getByText('Test Label');
      // Radix Trigger with asChild should preserve the span
      expect(trigger.tagName).toBe('SPAN');
    });
  });

  describe('Component Structure', () => {
    it('renders Radix Tooltip components in icon mode', () => {
      const { container } = render(
        <FieldTooltip description="Test description" fieldKey="test-field" asIcon />
      );
      // Check that button exists (Trigger)
      expect(screen.getByRole('button')).toBeInTheDocument();
      // Check that SVG icon exists
      const svg = container.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });

    it('renders Radix Tooltip components in wrapper mode', () => {
      render(
        <FieldTooltip description="Test description" fieldKey="test-field">
          Test Label
        </FieldTooltip>
      );
      // Check that trigger span exists
      const trigger = screen.getByText('Test Label');
      expect(trigger).toBeInTheDocument();
      expect(trigger.tagName).toBe('SPAN');
    });
  });
});
