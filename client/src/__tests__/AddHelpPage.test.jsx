import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

import AddHelpPage from '../pages/AddHelpPage';

vi.mock('../components/AnimatedPage', () => ({
    default: ({ children }) => <>{children}</>
}));

vi.mock('../components/MapPicker', () => ({
    default: () => <div>Map Picker Mock</div>
}));

vi.mock('../components/Sidebar', () => ({
    default: () => <nav>Sidebar Mock</nav>
}));
vi.mock('../components/DashboardHeader', () => ({
    default: () => <header>Header Mock</header>
}));

const renderWithRouter = (ui) => {
    return render(<MemoryRouter>{ui}</MemoryRouter>);
};

describe('AddHelpPage (Динамічна Форма)', () => {

    it('коректно відображає поле "Сума", коли обрано "Фінансовий донат"', () => {
        renderWithRouter(<AddHelpPage />);

        const typeSelect = screen.getByLabelText('Тип допомоги');
        fireEvent.change(typeSelect, { target: { value: 'donation' } });

        expect(screen.getByLabelText('Сума (в грн)')).toBeInTheDocument();
        expect(screen.queryByLabelText(/Перелік/)).not.toBeInTheDocument();
    });

    it('коректно відображає поля "Перелік" і "Карта", коли обрано "Гум. допомога"', () => {
        renderWithRouter(<AddHelpPage />);
        
        const typeSelect = screen.getByLabelText('Тип допомоги');
        fireEvent.change(typeSelect, { target: { value: 'aid' } });

        expect(screen.getByLabelText(/Перелік/)).toBeInTheDocument();
        expect(screen.getByText(/Місце передачі/)).toBeInTheDocument();
        expect(screen.getByText(/точку на карті/)).toBeInTheDocument();
        
        expect(screen.queryByLabelText('Сума (в грн)')).not.toBeInTheDocument();
    });
});
