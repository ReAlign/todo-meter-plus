'use babel';

import React from 'react';
import DateComp from './components/date-comp';
import ItemList from './components/item-list';

export default class Main extends React.Component {
    render() {
        return (
            <div>
                <DateComp />
                <ItemList />
            </div>
        );
    }
}