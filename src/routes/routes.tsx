/**
 * @author Edwaki
 * @date 3.7.2022
 */
import React from 'react';
import {
    Routes,
    Route
} from 'react-router-dom';

import Home from '../pages/home';
import Trade from '../pages/trade';
import useStore from '../store';

export default () => {
    const token = useStore(state => state.token);
    return (
        <Routes>
            <Route path='/home' element={<Home/>} />
            <Route path='/trade' element={token.email ? <Trade/> : <Home/>} />
            <Route path='/' element={<Home/>} />
        </Routes>
    )
}