'use client'

import React, { useEffect, useMemo, useReducer } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { toast, ToastContainer } from 'react-toastify'

import { FormInputsProps, TransactionProps, DonationFormProps } from '@/types/types'

import Select from '../../Select'
import Button from '../../Button'
import TransactionHistoryTable from '../../Table/Table'

import { cancerList, centersList, donationAmountsList } from '@/mockData'


type State = {
    purseBalance: number;
    currentBalance: number;
    isProcessing: boolean;
    transactions: TransactionProps[];
}

type Action =
    | { type: 'SUBMIT_DONATION'; payload: TransactionProps }
    | { type: 'SET_PROCESSING'; payload: boolean }
    | { type: 'INSUFFICIENT_FUNDS'; payload: boolean }

const initialState: State = {
    purseBalance: 200,
    isProcessing: false,
    transactions: [],
    currentBalance: 0,
};

function reducer(state: State, action: Action): State
{
    switch (action.type)
    {
        case 'SUBMIT_DONATION':
            return {
                ...state,
                purseBalance: state.purseBalance - action.payload.amount,
                transactions: [action.payload, ...state.transactions],
            }
        case 'SET_PROCESSING':
            return {
                ...state,
                isProcessing: action.payload,
            }
        case 'INSUFFICIENT_FUNDS':
            return {
                ...state,
                currentBalance: state.purseBalance,
            }
        default:
            return state
    }
}

const DonationPage: React.FC<DonationFormProps> = ({ isProcessing }) =>
{
    const [state, dispatch] = useReducer(reducer, initialState)
    // Use react-hook-form for form handling
    const { register, handleSubmit, formState: { isSubmitting }, reset, watch } = useForm<FormInputsProps>()

    const [isButtonDisabled, setIsButtonDisabled] = React.useState(true)

    const cancerData = useMemo(() => [...cancerList], [cancerList]);
    const centersData = useMemo(() => [...centersList], [centersList]);
    const donationAmountsData = useMemo(() => [...donationAmountsList], [donationAmountsList]);

    const watchedFields = watch(['cancer', 'center', 'amount']); // Watch these fields

    const onSubmit: SubmitHandler<FormInputsProps> = async (data) =>
    {
        const amount = parseInt(data.amount, 10)

        const transaction: TransactionProps = {
            cancer: data.cancer,
            center: data.center,
            amount: amount,
            date: new Date().toISOString(),
        }

        if (amount > state.purseBalance)
        {
            toast.error(`Insufficient balance. You only have $${state.purseBalance} available.`);
            dispatch({ type: 'INSUFFICIENT_FUNDS', payload: true })
            return
        }

        dispatch({ type: 'SET_PROCESSING', payload: true })

        // Simulate processing
        await new Promise((resolve) => setTimeout(resolve, 2000))

        dispatch({ type: 'SUBMIT_DONATION', payload: transaction })
        dispatch({ type: 'SET_PROCESSING', payload: false })

        toast.success(`Thanks for donating $${amount} to ${data.center} towards ${data.cancer}. Want to donate again?`)
        reset()
    }

    useEffect(() =>
    {
        // Enable button if all fields have values
        const allFieldsFilled = watchedFields.every(field => field !== undefined && field !== '');
        setIsButtonDisabled(!allFieldsFilled || state.purseBalance === 0);
    }, [watchedFields, state.purseBalance]);

    return (
        <>
            <div className='min-h-screen bg-gray-100 p-4'>
                <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
                    <div className="max-w-4xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-6 text-center shadow-lg">
                            <h1 className="text-4xl font-bold text-white" data-testid="page-title">Cancer Donation</h1>
                            <p className="text-white mt-2">Your current balance</p>
                            <div className="bg-white rounded-full mx-auto mt-4 p-4 w-24 h-24 flex items-center justify-center shadow-lg">
                                <span className="text-3xl font-bold text-indigo-500" data-testid="balance-amount">${state.purseBalance}</span>
                            </div>
                        </div>
                        <div className="p-3 bg-gray-50">
                            <div className="flex flex-col md:flex-row gap-6">
                                <div className="flex-1">
                                    <form onSubmit={handleSubmit(onSubmit)} className="mx-auto bg-white rounded-2xl shadow-lg p-4 w-full max-h-100  text-indigo-500" data-testid="donation-form">
                                        <h2 className="text-2xl font-bold text-center mb-4 text-black">Make a Donation</h2>
                                        <Select
                                            aria-label="select-cancer"
                                            data-testid="cancer-dropdown"
                                            label="Select Cancer"
                                            options={cancerData}
                                            {...register('cancer', { required: true })}
                                        />
                                        <Select
                                            aria-label="select-center"
                                            data-testid="center-dropdown"
                                            label="Select Center"
                                            options={centersData}
                                            {...register('center', { required: true })}
                                        />
                                        <Select
                                            aria-label="select-donation-amount"
                                            data-testid="donation-amount-dropdown"
                                            label="Donation Amount"
                                            options={donationAmountsData}
                                            {...register('amount', { required: true })}
                                        />
                                        <Button
                                            type="submit"
                                            aria-label="submit-donation"
                                            data-testid="submit-donation-btn"
                                            isLoading={isProcessing || isSubmitting}
                                            disabled={isButtonDisabled}
                                            className={`mt-8 ${isButtonDisabled ? 'disabled' : ''}`}
                                        >
                                            Submit Donation
                                        </Button>
                                    </form>
                                </div>
                                <div className="flex-1">
                                    <TransactionHistoryTable
                                        transactions={state.transactions}
                                        showNoHistoryMessage={state.purseBalance === 200}
                                    />
                                </div>
                            </div>
                        </div>
                        <ToastContainer position="top-right" />
                    </div>
                </div>
                <h5 className='text-center text-indigo-700 font-light'>@2024 Powered by Coriano Harris</h5>
            </div>
        </>
    )
}

export default DonationPage;
