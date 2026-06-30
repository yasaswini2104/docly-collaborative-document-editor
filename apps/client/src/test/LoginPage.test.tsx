import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderPage } from './render-utils';
import LoginPage from '../pages/LoginPage';

describe('LoginPage', () => {
  it('renders the heading', () => {
    renderPage(<LoginPage />, { initialPath: '/login' });
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('DocEditor');
  });

  it('renders email and password inputs', () => {
    renderPage(<LoginPage />, { initialPath: '/login' });
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('renders a disabled submit button when fields are empty', () => {
    renderPage(<LoginPage />, { initialPath: '/login' });
    const btn = screen.getByRole('button', { name: /sign in/i });
    expect(btn).toBeDisabled();
  });
});
