import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { spyElementPrototypes } from './utils/domHook';
import Select from '../src';

jest.mock('../src/utils/platformUtil');
// Mock VirtualList
jest.mock('rc-virtual-list', () => {
  const OriReact = jest.requireActual('react');
  const OriList = jest.requireActual('rc-virtual-list').default;

  return OriReact.forwardRef((props, ref) => {
    const oriRef = OriReact.useRef();

    OriReact.useImperativeHandle(ref, () => ({
      ...oriRef.current,
      scrollTo: (arg) => {
        global.scrollToArgs = arg;
        oriRef.current.scrollTo(arg);
      },
    }));

    return <OriList {...props} ref={oriRef} />;
  });
});

describe('List.Scroll', () => {
  let mockElement;
  let boundingRect = {
    top: 0,
    bottom: 0,
    width: 100,
    height: 50,
  };

  beforeAll(() => {
    mockElement = spyElementPrototypes(HTMLElement, {
      offsetHeight: {
        get: () => 100,
      },
      clientHeight: {
        get: () => 50,
      },
      getBoundingClientRect: () => boundingRect,
      offsetParent: {
        get: () => document.body,
      },
    });
  });

  afterAll(() => {
    mockElement.mockRestore();
  });

  beforeEach(() => {
    boundingRect = {
      top: 0,
      bottom: 0,
      width: 100,
      height: 50,
    };
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show scrollbar when showScrollBar is true', async () => {
    const options = Array.from({ length: 10 }, (_, index) => ({
      label: `${index + 1}`,
      value: `${index + 1}`,
    }));

    const { container } = render(<Select open showScrollBar options={options} />);

    await waitFor(() => {
      const scrollbarElement = container.querySelector('.rc-virtual-list-scrollbar-visible');
      expect(scrollbarElement).not.toBeNull();
    });
  });
  it('should not have scrollbar when showScrollBar is false', async () => {
    const options = Array.from({ length: 10 }, (_, index) => ({
      label: `${index + 1}`,
      value: `${index + 1}`,
    }));

    const { container } = render(<Select open showScrollBar={false} options={options} />);

    await waitFor(() => {
      const scrollbarElement = container.querySelector('.rc-virtual-list-scrollbar-visible');
      expect(scrollbarElement).toBeNull();
    });
  });
});
