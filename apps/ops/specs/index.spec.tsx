import { render } from '@testing-library/react';
import Page from '../src/app/page';
import { MenuProvider } from '../src/context/MenuContext';

describe('Page', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <MenuProvider>
        <Page />
      </MenuProvider>,
    );

    expect(baseElement).toBeTruthy();
  });
});
