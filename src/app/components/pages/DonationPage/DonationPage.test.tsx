import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // Ensure correct import

import DonationPage from './DonationPage';



// Mock the data module to return the mock data
// jest.mock('../../../../mockData', () => ({
//     cancerList,
//     centersList,
//     donationAmountsList
// }));

jest.createMockFromModule('../../../../mockData');

// Mock data
// const cancerList = [{ value: 'Breast', label: 'Breast' }];
// const centersList = [{ value: 'Mayo Clinic Cancer Center', label: 'Mayo Clinic Cancer Center' }];
// const donationAmountsList = [{ value: '10', label: '10' }];

describe('DonationPage', () => {

    beforeEach(() => {
        render(<DonationPage isProcessing={false} />); // Set isProcessing to false initially
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('renders a heading', () => {
        const heading = screen.getByRole('heading', {
            name: /Cancer Donation/i,
        });
        expect(heading).toBeInTheDocument();
    });

    test('renders the donation form and initial balance of $200 correctly', () => {
        expect(screen.getByTestId('page-title')).toHaveTextContent('Cancer Donation');
        expect(screen.getByTestId('balance-amount')).toHaveTextContent('$200');

        expect(screen.getByTestId('donation-form')).toBeInTheDocument();
        expect(screen.getByTestId('cancer-dropdown')).toBeInTheDocument();
        expect(screen.getByTestId('center-dropdown')).toBeInTheDocument();
        expect(screen.getByTestId('donation-amount-dropdown')).toBeInTheDocument();
        expect(screen.getByTestId('submit-donation-btn')).toBeInTheDocument();
        expect(screen.getByTestId('transaction-table')).toBeInTheDocument();
        expect(screen.queryByText('No donation history')).not.toBeInTheDocument();
    });

    test('submits a donation and updates balance', async () => {
        const user = userEvent.setup();
    
        // Select options from dropdowns
        await user.selectOptions(screen.getByTestId('cancer-dropdown'), 'Breast');
        await user.selectOptions(screen.getByTestId('center-dropdown'), 'Mayo Clinic Cancer Center');
        await user.selectOptions(screen.getByTestId('donation-amount-dropdown'), '10');
    
        // Click submit button
        const button = screen.getByTestId('submit-donation-btn');
        await user.click(button);
    
        // Wait for the balance update
        await waitFor(() => {
            const balanceEl = screen.getByTestId('balance-amount');
            expect(balanceEl).toHaveTextContent('$190');
        }, { timeout: 4000 }); // Increase timeout if needed
    
        // Optionally, add a console log to help with debugging
        console.log(screen.getByTestId('balance-amount').textContent);
    });

    test('should disable submit button until all fields are filled', async () => {
        const user = userEvent.setup();

        const button = screen.getByTestId('submit-donation-btn');
        
        // Initially, the button should be disabled
        expect(button).toBeDisabled();

        // Fill in the form fields
        await user.selectOptions(screen.getByTestId('cancer-dropdown'), 'Breast');
        await user.selectOptions(screen.getByTestId('center-dropdown'), 'Mayo Clinic Cancer Center');
        await user.selectOptions(screen.getByTestId('donation-amount-dropdown'), '10');

        // The button should be enabled now
        expect(button).not.toBeDisabled();
    });
});
