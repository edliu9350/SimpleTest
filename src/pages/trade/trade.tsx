/**
 * @author Edwaki
 * @date 3.7.2022
 */
import {Fragment, useState} from 'react';
import { Menu, Transition, Dialog } from "@headlessui/react"
import { ChevronDownIcon } from '@heroicons/react/solid';
import {useQuery, useQueryClient} from 'react-query';
import axios from 'axios';
import utils from '../../utils';

export default (props: any) => {
    const USD2CRT = 0, CRT2USD = 1; //trading direction constants($->Crypto, Crypto->$)
    const [tradeDir, setTradeDir] = useState(CRT2USD);  //Trade Direction State
    const [amount, setAmount] = useState('0');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const queryClient = useQueryClient();
    const query_data: any = queryClient.getQueryData('assets');
    const handleChooseAsset = (e: any) => {
        setSelectedIndex(e.target.accessKey);
    }
    const onSwap = () => {
        const orgValue = calc();
        setTradeDir(1 - tradeDir);
        setAmount(orgValue.toString());
    }

    const isValid = () => {
        if(query_data == undefined)
            return false;
        if(selectedIndex < 0 || selectedIndex >= query_data.length)
            return false;
        return true;
    }

    const calc = () => {
        if(!isValid())
            return 0;
        let res = (tradeDir == CRT2USD ? parseFloat(amount) * query_data[selectedIndex].current_price : parseFloat(amount) / query_data[selectedIndex].current_price);
        return res;
    }

    const displayResult = () => {
        if(!isValid()) return 0;
        return tradeDir == CRT2USD ? `$${utils.formatNumber(calc())}` : `${query_data[selectedIndex].symbol.toUpperCase()}${utils.formatNumber(calc())}`;
    }
    return (
        <div className="h-[80vh] flex items-center justify-center">
            <div className="px-4 text-center">
                <div className="inline-block w-full text-white max-w-md p-6 my-8 text-left align-middle transition-all transform bg-gray-800/50 border shadow-xl rounded-2xl">
                    <div className="mt-4">
                        <h1 className='text-4xl font-medium text-primary mt-4 text-center mb-5'>
                            TRADE
                        </h1>
                        <div className='mb-5'>
                            <div>
                                <label htmlFor='amount'>
                                    {tradeDir == CRT2USD ? "Crypto Amount" : "Fiat Amount"}
                                    <span className='text-sm text-gray-300'>
                                        &nbsp;({isValid() && (tradeDir == USD2CRT ? '$' : 
                                            query_data[selectedIndex].symbol.toUpperCase())})
                                    </span>
                                </label>
                                <div className='flex justify-center'>
                                    <input
                                        required
                                        type='text'
                                        className={`w-3/6 p-2 text-black text-primary border rounded-md outline-none text-sm transition duration-150 ease-in-out`}
                                        id='amount'
                                        placeholder='Input amount of money'
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                    />
                                    <Menu as="div" className="w-3/6 mx-2 relative inline-block text-lef">
                                        <div>
                                            <Menu.Button className="h-10 items-center bg-green-800 border inline-flex hover:bg-green-700 justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-20 hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                                                {isValid() && <img src={query_data[selectedIndex].image} className="h-6 mr-1" />}
                                                {isValid() ? query_data[selectedIndex].name : 'Choose Asset'}
                                                <ChevronDownIcon
                                                className="w-5 h-5 ml-2 -mr-1 text-violet-200 hover:text-violet-100"
                                                aria-hidden="true"
                                                />
                                            </Menu.Button>
                                            </div>
                                            <Transition
                                            as={Fragment}
                                            enter="transition ease-out duration-100"
                                            enterFrom="transform opacity-0 scale-95"
                                            enterTo="transform opacity-100 scale-100"
                                            leave="transition ease-in duration-75"
                                            leaveFrom="transform opacity-100 scale-100"
                                            leaveTo="transform opacity-0 scale-95"
                                            >
                                            <Menu.Items className="absolute right-0 w-40 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto h-[15rem]">
                                                <div className="px-1 py-1 ">
                                                    {query_data != undefined && query_data.map((asset: any, i: number) => {
                                                        return <Menu.Item>
                                                            {({ active }) => (
                                                            <button
                                                                className={`${
                                                                active ? 'bg-violet-500 text-white' : 'text-gray-900'
                                                                } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                                                                onClick={handleChooseAsset}
                                                                accessKey={i.toString()}
                                                            >
                                                                <img src={asset.image} className="h-5 mr-1" />
                                                                {asset.name}
                                                            </button>
                                                            )}
                                                        </Menu.Item>
                                                    })}
                                                </div>
                                            </Menu.Items>
                                        </Transition>
                                    </Menu>
                                </div>
                            </div>
                            {isValid() && (
                                (tradeDir == CRT2USD && (<div className='mt-1'>(1{query_data[selectedIndex].symbol.toUpperCase()}=
                                {query_data[selectedIndex].current_price}$)</div>)) ||
                                (tradeDir == USD2CRT && (<div className='mt-1'>(1$=
                                {utils.formatNumber(1/query_data[selectedIndex].current_price)}{query_data[selectedIndex].symbol.toUpperCase()})</div>))
                            )
                            }
                        </div>
                        <h2 className='text-4xl font-medium text-primary mt-2 mb-5 text-center'>
                            {displayResult()}
                        </h2>
                        <div className='flex justify-center items-center mt-3'>
                            <button
                                className="text-xl h-14 py-2 px-4 w-full text-white roundedd border border-green hover:bg-green-700/30 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                                onClick={onSwap}
                            >
                                Swap
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}