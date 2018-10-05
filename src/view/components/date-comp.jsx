'use babel';

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { setDate, resetAll } from './../../tools/actions';
import { getDate } from './../../tools/reducers/date';

class DateComp extends React.Component {
    constructor(props) {
        super(props);
        this.setDate = this.setDate.bind(this);
    }

    componentDidMount() {
        this.setDate();
    }

    setDate() {
        const date = {
            day: moment().date(),
            month: moment().format('MMM'),
            year: moment().year(),
            weekday: moment().format('dddd')
        };
        const local = localStorage.getItem('date');
        this.checkDate(local);
        this.props.setDate(date);
    }

    checkDate(local) {
        if (local !== null && moment(local).isBefore(moment().format('MM-DD-YYYY'))) {
            this.props.resetAll();
        }
        localStorage.setItem('date', moment().format('MM-DD-YYYY'));
    }

    render() {
        return (
            <div className = "date">
                <div className = "calendar">
                    <div className = "day">
                        {this.props.date.day}
                    </div>
                    <div className = "my">
                        <div className = "month" >
                            {this.props.date.month}
                        </div>
                        <div className = "year">
                            {this.props.date.year}
                        </div>
                    </div>
                </div>
                <div className = "today">
                    {this.props.date.weekday}
                </div>
            </div>
        );
    }
}

DateComp.propTypes = {
    date: PropTypes.object,
    setDate: PropTypes.func,
    resetAll: PropTypes.func,
}

const mapStateToProps = state => ({
    date: getDate(state)
});

const mapDispatchToProps = dispatch => ({
    setDate: (date) => dispatch(setDate(date)),
    resetAll: (item) => dispatch(resetAll(item))
});

export default connect(mapStateToProps, mapDispatchToProps)(DateComp);