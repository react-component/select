import { act, render, waitFor } from '@testing-library/react';
import React from 'react';
import Select from '../src';

// The default trigger mock renders popups inline and does not exercise portals.
jest.mock('@rc-component/trigger', () => jest.requireActual('@rc-component/trigger').default);

it('keeps the popup open inside a separate closed shadow root and closes outside', async () => {
  const host = document.createElement('div');
  const popupHost = document.createElement('div');
  document.body.append(host, popupHost);
  const root = host.attachShadow({ mode: 'closed' });
  const popupRoot = popupHost.attachShadow({ mode: 'closed' });
  const mount = document.createElement('div');
  const popupMount = document.createElement('div');
  const outside = document.createElement('div');
  root.appendChild(mount);
  popupRoot.append(popupMount, outside);
  const onPopupVisibleChange = jest.fn();
  const { unmount } = render(
    <Select
      open
      onPopupVisibleChange={onPopupVisibleChange}
      options={[{ value: 'a' }]}
      getPopupContainer={() => popupMount}
      popupRender={() => <div data-testid="popup-content">Content</div>}
    />,
    { container: mount },
  );

  await waitFor(() =>
    expect(popupRoot.querySelector('[data-testid="popup-content"]')).not.toBeNull(),
  );
  const popupContent = popupRoot.querySelector('[data-testid="popup-content"]');
  act(() =>
    popupContent.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true })),
  );
  await act(() => new Promise((resolve) => setTimeout(resolve, 30)));
  expect(onPopupVisibleChange).not.toHaveBeenCalledWith(false);
  act(() => outside.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true })));
  await waitFor(() => expect(onPopupVisibleChange).toHaveBeenCalledWith(false));
  onPopupVisibleChange.mockClear();
  act(() =>
    document.body.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, composed: true })),
  );
  await waitFor(() => expect(onPopupVisibleChange).toHaveBeenCalledWith(false));
  unmount();
  host.remove();
  popupHost.remove();
});
