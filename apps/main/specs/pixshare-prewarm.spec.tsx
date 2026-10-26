import * as React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';

const HEALTH_URL = 'https://pixshare-api-edtosoy.onrender.com/health';
const STORAGE_KEY = 'pixshare:last-prewarm-at';
const COOLDOWN_MS = 10 * 60 * 1000;
const NOW = 1_800_000_000_000;

let PixSharePrewarm: typeof import('../src/components/PixSharePrewarm').default;
const fetchMock = jest.fn();
const originalFetch = globalThis.fetch;

beforeEach(() => {
  // Give each test a fresh in-memory cooldown while sharing the renderer's React.
  jest.doMock('react', () => React);
  jest.isolateModules(() => {
    PixSharePrewarm = require('../src/components/PixSharePrewarm').default;
  });
  window.sessionStorage.clear();
  jest.spyOn(Date, 'now').mockReturnValue(NOW);
  fetchMock.mockReset().mockResolvedValue({ type: 'opaque' });
  globalThis.fetch = fetchMock;
});

afterEach(() => {
  jest.restoreAllMocks();
  globalThis.fetch = originalFetch;
});

describe('PixShare prewarming', () => {
  it('renders nothing and sends a credential-free GET on the first client mount', () => {
    const { container } = render(<PixSharePrewarm />);

    expect(container.innerHTML).toBe('');
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(HEALTH_URL, {
      method: 'GET',
      mode: 'no-cors',
      credentials: 'omit',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
      keepalive: true,
    });
    expect(window.sessionStorage.getItem(STORAGE_KEY)).toBe(String(NOW));
  });

  it('does not fetch during server rendering', () => {
    expect(renderToString(<PixSharePrewarm />)).toBe('');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('deduplicates Strict Mode replay, re-renders and remounts', () => {
    const element = (
      <React.StrictMode>
        <PixSharePrewarm />
      </React.StrictMode>
    );
    const view = render(element);
    view.rerender(element);
    view.unmount();
    render(element);

    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('honors a recent session timestamp from a previous page load', () => {
    window.sessionStorage.setItem(STORAGE_KEY, String(NOW - COOLDOWN_MS + 1));
    render(<PixSharePrewarm />);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('allows another attempt on mounting after the ten-minute cooldown', () => {
    const view = render(<PixSharePrewarm />);
    view.unmount();
    jest.spyOn(Date, 'now').mockReturnValue(NOW + COOLDOWN_MS - 1);
    const recent = render(<PixSharePrewarm />);
    recent.unmount();
    expect(fetchMock).toHaveBeenCalledTimes(1);

    jest.spyOn(Date, 'now').mockReturnValue(NOW + COOLDOWN_MS);
    render(<PixSharePrewarm />);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it.each(['invalid', 'Infinity', '-1', String(NOW + COOLDOWN_MS)])(
    'ignores an unusable session timestamp: %s',
    (value) => {
      window.sessionStorage.setItem(STORAGE_KEY, value);
      render(<PixSharePrewarm />);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    },
  );

  it.each(['getItem', 'setItem'] as const)(
    'falls back to memory if sessionStorage.%s throws',
    (method) => {
      jest.spyOn(Storage.prototype, method).mockImplementation(() => {
        throw new DOMException('Storage blocked', 'SecurityError');
      });
      const view = render(<PixSharePrewarm />);
      view.unmount();
      render(<PixSharePrewarm />);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    },
  );

  it('still deduplicates if access to sessionStorage itself is blocked', () => {
    jest.spyOn(window, 'sessionStorage', 'get').mockImplementation(() => {
      throw new DOMException('Storage blocked', 'SecurityError');
    });
    const view = render(<PixSharePrewarm />);
    view.unmount();
    render(<PixSharePrewarm />);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('silently handles a rejected request and retains the cooldown', async () => {
    fetchMock.mockRejectedValue(new TypeError('Network unavailable'));
    const onUnhandled = jest.fn();
    window.addEventListener('unhandledrejection', onUnhandled);
    try {
      const view = render(
        <>
          <PixSharePrewarm />
          <main>Portfolio</main>
        </>,
      );
      await act(async () => {
        await Promise.resolve();
      });
      expect(screen.getByRole('main').textContent).toBe('Portfolio');
      expect(onUnhandled).not.toHaveBeenCalled();
      view.unmount();
      render(<PixSharePrewarm />);
      expect(fetchMock).toHaveBeenCalledTimes(1);
    } finally {
      window.removeEventListener('unhandledrejection', onUnhandled);
    }
  });

  it('silently handles synchronous fetch failures', () => {
    fetchMock.mockImplementation(() => {
      throw new TypeError('Fetch unavailable');
    });
    expect(() => render(<PixSharePrewarm />)).not.toThrow();
  });

  it('keeps client interactions responsive while the health request is pending', () => {
    fetchMock.mockReturnValue(new Promise(() => undefined));
    function ClientShell() {
      const [page, setPage] = React.useState('Portfolio');
      return (
        <>
          <PixSharePrewarm />
          <button onClick={() => setPage('PixShare')}>View PixShare</button>
          <main>{page}</main>
        </>
      );
    }
    render(<ClientShell />);
    expect(screen.getByRole('main').textContent).toBe('Portfolio');
    fireEvent.click(screen.getByRole('button', { name: 'View PixShare' }));
    expect(screen.getByRole('main').textContent).toBe('PixShare');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
