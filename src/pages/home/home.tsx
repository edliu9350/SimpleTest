/**
 * @author Edwaki
 * @date 3.7.2022
 */
import {useState, useEffect, useMemo, Fragment} from 'react';
import {useTable, useSortBy} from 'react-table';
import {useQuery, useQueryClient} from 'react-query';
import axios from 'axios';
import utils from '../../utils';
import {Switch, Menu, Transition} from '@headlessui/react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/solid';
import {Link} from 'react-router-dom';

export default () => {
    //use react-table for table ui.
    const columns = useMemo(() => [
          {
            Header: 'No'
          },
          {
              Header: 'name',
              accessor: (data: any) => {
                return (
                  <div className='flex'>
                    <img src={data.image} className="w-8" />
                    <div className='ml-2 self-center'>{data.name}</div>
                    <div className='ml-1 self-center text-sm text-gray-700'>({data.symbol.toUpperCase()})</div>
                  </div>
                )
              }
          },
          {
              Header: 'Price',
              accessor: 'current_price',
              Cell: (props: any) => {
                  return <div className='text-right'>{utils.formatCurrency(props.value)}</div>
              }
          },
          {
            Header: 'Price Change',
            accessor: 'price_change_percentage_24h',
            Cell: (props: any) => {
                return <div className='text-right'>{utils.formatPercent(props.value)}</div>
            }
          },
          {
              Header: 'Market Capacity',
              accessor: 'market_cap',
              Cell: (props: any) => {
                  return <div className='text-right'>{utils.formatCurrency(props.value)}</div>
              }
          },
          {
              Header: 'Buy/Sell',
              Cell: () => {
                  return <Menu as="div" className="relative inline-block text-left">
                  <div>
                    <Menu.Button className="z-0 bg-green-800/50 inline-flex hover:bg-green-700/50 justify-center w-full px-4 py-2 text-sm font-medium text-white bg-black rounded-md bg-opacity-80 hover:bg-opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
                      Action
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
                    <Menu.Items className="absolute z-10 right-0 w-40 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <div className="px-1 py-1 ">
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-violet-500 text-white' : 'text-gray-900'
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            >
                                Buy
                            </button>
                          )}
                        </Menu.Item>
                        <Menu.Item>
                          {({ active }) => (
                            <button
                              className={`${
                                active ? 'bg-violet-500 text-white' : 'text-gray-900'
                              } group flex rounded-md items-center w-full px-2 py-2 text-sm`}
                            >
                                Sell
                            </button>
                          )}
                        </Menu.Item>
                      </div>
                    </Menu.Items>
                  </Transition>
                </Menu>
              }
          }
      ]
    , []);
    const numRowsPerPage = 10;    //number of visible rows per page in the table

    const queryClient = useQueryClient(); //client for react-query
    const query_data: any = queryClient.getQueryData('assets'); //list of crypto assets
    const [orderBy, setOrderBy] = useState('current_price');  //variable for sorting the table
    const [order, setOrder] = useState('desc');               //variable for sorting the table
    const [curPage, setCurPage] = useState(1);                //state for current page number

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({
        columns,
        data: query_data || []
    }, useSortBy);

    /*comparing subfunction for sorting crypto assets */
    const descendingComparator = (a: any, b: any, orderBy: string) => {
      if (b.original[orderBy] < a.original[orderBy]) {
        return -1;
      }
      if (b.original[orderBy] > a.original[orderBy]) {
        return 1;
      }
      return 0;
    }
  
    /*comparing function for sorting crypto assets */
    const getComparator = (order: string, orderBy: string) => {
      return order === 'desc'
      ? (a: any, b: any) => descendingComparator(a, b, orderBy)
      : (a: any, b: any) => -descendingComparator(a, b, orderBy);
    };
  
    /**
     * 
     * @param array cryptoassets
     * @param comparator comparing function
     */
    const stableSort = (array: any, comparator: any) => {
      const stabilizedThis = array.map((el: any, index: number) => [el, index]);
      stabilizedThis.sort((a: any, b: any) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
          return order;
        }
        return a[1] - b[1];
      });
      return stabilizedThis.map((el: any) => el[0]);
    }

    const sortableColumns = ['name', 'symbol', 'current_price', 'market_cap', 'price_change_percentage_24h'];
    const handleSortTable = (columnId: string) => {
        if(sortableColumns.indexOf(columnId) < 0)
            return;
        let new_order = order, new_orderby = orderBy;
        if(columnId == orderBy){
            if(order == 'asc')
                new_order = 'desc';
            else new_order = 'asc';
        } else{
            new_order = 'desc';
            new_orderby = columnId;
        }
        //queryClient.setQueryData('assets', stableSort(query_data, getComparator(new_order, new_orderby)));
        setOrder(new_order);
        setOrderBy(new_orderby);
    }
    const handlePrevPage = () => {
      let page = curPage;
      setCurPage(page > 1 ? page - 1 : page);
    }
    const handleNextPage = () => {
      if(query_data == undefined)
        return;
      let page = curPage;
      let totPage = Math.ceil(query_data.length / numRowsPerPage);
      setCurPage(page < totPage ? page + 1 : page);
    }
    return (
        <div className='flex justify-center mt-5 mb-5'>
          <div className='border min-w-[60%]'>
            <table {...getTableProps()} className="w-full divide-y divide-gray-200">
                <thead className="bg-gray-200/30">
                {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                        {
                            headerGroup.headers.map((column, i) => (
                                    <th {...column.getHeaderProps()} className={'cursor-pointer text-left px-6 py-3 text-xs font-medium text-white uppercase tracking-wider'}
                                        onClick={() => handleSortTable(column.id)}>
                                        <div className={`flex flex-row-reverse ${column.id == 'current_price' || column.id == 'market_cap' || column.id == 'price_change_percentage_24h' ? '': 'justify-end'}`}>
                                            {orderBy == column.id ? 
                                                order == 'desc' ? 
                                                <ChevronDownIcon
                                                className="w-5 h-5 -mr-1 text-violet-200 hover:text-violet-100"
                                                aria-hidden="true"
                                                /> : 
                                                <ChevronUpIcon
                                                className="w-5 h-5 -mr-1 text-violet-200 hover:text-violet-100"
                                                aria-hidden="true"
                                                /> :
                                                ''
                                            }
                                            {column.render('Header')}
                                        </div>
                                    </th>
                            ))
                        }
                        </tr>
                ))} 
                </thead>
                <tbody {...getTableBodyProps()} className="bg-white/50 divide-y divide-gray-200 overflow-y-auto h-200">
                    {stableSort(rows, getComparator(order, orderBy)).map((row: any, i: number) => {
                        if(i >= (curPage - 1) * numRowsPerPage && i < curPage * numRowsPerPage){
                            prepareRow(row);
                            return (
                                <tr {...row.getRowProps()}>
                                    {row.cells.map((cell: any, j: number) => {
                                        return <td {...cell.getCellProps()} className={"text-left px-6 py-4 whitespace-nowrap"}>{j == 0 ? (i+1) : cell.render('Cell')}</td>
                                    })}
                                </tr>
                            )
                        }
                    })}
                </tbody>
            </table>
            <div className='flex justify-center text-white'>
                <Link to='#' className='mr-1' onClick={handlePrevPage}>{'<<'}</Link>
                <div className='cursor-pointer'>Page {curPage} of {query_data == undefined ? 0 : query_data.length / numRowsPerPage}</div>
                <Link to='#' className='ml-1' onClick={handleNextPage}>{'>>'}</Link>
            </div>
          </div>
        </div>
    )
}