export type FormInputsProps =
    {
        cancer: string;
        center: string;
        amount: string;
    }

export type TransactionProps =
    {
        cancer: string;
        center: string;
        amount: number;
        date: string;
    }

export type TransactionHistoryTableProps =
    {
        transactions: TransactionProps[];
        showNoHistoryMessage: boolean;
    }

    export type DonationFormProps =
    {
        isProcessing: boolean;
    }
