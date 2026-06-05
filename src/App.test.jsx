import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

// ---App Component Tests -----------------------------------------------------------
// Run with: npx vitest
// Setup required: npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
// Add to vite.config.js: test: { environment: 'jsdom', globals: true, setupFiles: './src/setupTests.js' }

describe('App', () => {

// ---Rendering ---------------------------------------------------------

    describe('initail render', () => {
        it('renders the get started heading', () => {
            render(<App />)
            expect(screen.getByRole('heading', { name: /get started/i })).toBeInTheDocument()
        })
        
        it('renders the counter button with initial count of 0', () => {
            render(<App />)
            expect(screen.getByRole('button', { name: /count is 0/i })).toBeInTheDocument()
        })

        it('renders the documentation section heading', () => {
            render(<App />)
            expect(screen.getByRole('heading', {name: /documentation/i })).toBeInTheDocument()
        })

        it('renders the React logo with alt text',() => {
            render(<App />)
            expect(screen.getByAltText('React logo')).toBeInTheDocument()
        })

        it('renders the Vite logo with alt text', () => {
            render(<App />)
            expect(screen.getByAltText('Vite logo')).toBeInTheDocument()
        })

        it('renders the HMR instruction text', () => {
            render(<App />)
            expect(screen.getByText(/edit/i)).toBeInTheDocument()
            expect(screen.getByText(/HMR/i)).toBeInTheDocument()
        })
    })

    // -- Counter Behaviour ---------------------------------------------
    
    describe('counter', () => {
        it('increments the count by 1 on each click', () => {
            render(<App />)
            const button = screen.getByRole('button', {name: /count is 0/i })

            fireEvent.click(button)
            expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument()
        })

        it('increments the count multiple times correctly', () => {
            render(<App />)
            const button = screen.getByRole('button', { name: /count is 0/i })

            fireEvent.click(button)
            fireEvent.click(button)
            fireEvent.click(button)

            expect(screen.getByRole('button', { name: /count is 3/i })).toBeInTheDocument()
        })

        it('counter state resets between separate renders', () => {
            const { unmount } = render(<App />)
            const button = screen.getByRole('button', { name: /count is 0/i })
            fireEvent.click(button)
            expect(screen.getByRole('button', { name: /count is 1/i })).toBeInTheDocument()

            unmount()
            render(<App />)
            expect(screen.getByRole('button', { name: /count is 0/i })).toBeInTheDocument()
        })
    })

    // -- External links -------------------------------------------

    describe('navigate links', () => {
        it('renders a link to the Vite documentation site', () => {
            render(<App />)
            const viteLink = screen.getByRole('link', { name: /explore vite/i })
            expect(viteLink).toHaveAttribute('href', 'https:vite.dev/')
        })

        it('renders a link to the React documentation site', () => {
            render(<App />)
            const reactLink = screen.getByRole('link', { name: /learn more/i })
            expect(reactLink).toHaveAttribute('href', 'https://react.dev/')
        })

        it('renders a link to the Vite GitHub repository', () => {
            render(<App />)
            const githubLink = screen.getByRole('link', { name: /github/i })
            expect(githubLink).toHaveAttribute('href', 'https://github.com/vitejs/vite')
        })

        it('renders a link to the Vite Discord server', () => {
      render(<App />)
      const discordLink = screen.getByRole('link', { name: /discord/i })
      expect(discordLink).toHaveAttribute('href', 'https://chat.vite.dev/')
    })
 
    it('renders a link to X.com', () => {
      render(<App />)
      const xLink = screen.getByRole('link', { name: /x\.com/i })
      expect(xLink).toHaveAttribute('href', 'https://x.com/vite_js')
    })
 
    it('renders a link to Bluesky', () => {
      render(<App />)
      const bskyLink = screen.getByRole('link', { name: /bluesky/i })
      expect(bskyLink).toHaveAttribute('href', 'https://bsky.app/profile/vite.dev')
    })
 
    it('all external links open in a new tab', () => {
      render(<App />)
      const externalLinks = screen.getAllByRole('link')
      externalLinks.forEach(link => {
        expect(link).toHaveAttribute('target', '_blank')
      })
    })
  })
 
  // ── Accessibility ──────────────────────────────────────────────────────────
 
  describe('accessibility', () => {
    it('the counter button is a real <button> element', () => {
      render(<App />)
      const button = screen.getByRole('button')
      expect(button.tagName).toBe('BUTTON')
    })
 
    it('renders two landmark sections', () => {
      render(<App />)
      const sections = document.querySelectorAll('section')
      expect(sections.length).toBeGreaterThanOrEqual(2)
    })
  })
})
 