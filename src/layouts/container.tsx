/**
 * @author Edwaki
 * @date 3.7.2022
 */
import Navbar from './navbar';
import Footer from './footer';
import Routers from '../routes';
import {useQuery} from 'react-query';
import axios from 'axios';

export default () => {
    //fetch cryptocurrencies using react-query
    const query = useQuery('assets', async () => {
        return (await axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=30&page=1&sparkline=false`))
            .data;
        },
        {
            refetchInterval: 2000,      //Interval of refetching data
            refetchOnWindowFocus: true  //Flag for refetching data on window focus
        }
    );
    return (
        <>
            <div className='fixed w-full blur-md z-0 h-screen bg-cover bg-center' style={{backgroundImage: `url('/images/back2.jpg')`}}>
            </div>
            <div className='relative'>
                <Navbar />
                <Routers />
                <Footer />
            </div>
        </>
    )
}