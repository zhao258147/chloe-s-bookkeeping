
var Calendar = React.createClass({
    propTypes : {
        selected: React.PropTypes.object.isRequired,
        numbers: React.PropTypes.array,
        goto: React.PropTypes.func,
        previous: React.PropTypes.func,
        next: React.PropTypes.func
    },
    getInitialState: function() {
        console.log(this.props);
        return {
            month: this.props.selected.clone()
        };
    },

    previous: function() {
        var month = this.state.month;
        if(this.props.selected.month() < month.month()){
            month.add(-1, "M");
            this.setState({ month: month });
            this.props.previous(month.month(), month.year());
        }
    },

    next: function() {
        var month = this.state.month;
        month.add(1, "M");
        this.setState({ month: month });
        this.props.next(month.month(), month.year());
    },

    select: function(day) {
        this.props.selected = day.date;
        this.forceUpdate();

    },

    render: function() {
        return <div>
            <div className="header">
                <i className="fa fa-angle-left" onClick={this.previous}></i>
							{this.renderMonthLabel()}
                <i className="fa fa-angle-right" onClick={this.next}></i>
            </div>
            <DayNames />
            {this.renderWeeks()}
        </div>;
    },

    renderWeeks: function() {
        var weeks = [],
            done = false,
            date = this.state.month.clone().startOf("month").add("w" -1).day("Sunday"),
            monthIndex = date.month(),
            count = 0;

        console.log(this.props);
        while (!done) {
            weeks.push(<Week numbers={this.props.numbers} next={this.next} previous={this.previous} goto={this.props.goto} key={date.toString()} date={date.clone()} month={this.state.month} select={this.select} selected={this.props.selected} />);
            date.add(1, "w");
            done = count++ > 2 && monthIndex !== date.month();
            monthIndex = date.month();
        }

        return weeks;
    },

    renderMonthLabel: function() {
        return <span>{this.state.month.format("MMMM, YYYY")}</span>;
    }
});

var DayNames = React.createClass({
    render: function() {
        return <div className="week names">
            <span className="day">Sun</span>
            <span className="day">Mon</span>
            <span className="day">Tue</span>
            <span className="day">Wed</span>
            <span className="day">Thu</span>
            <span className="day">Fri</span>
            <span className="day">Sat</span>
        </div>;
    }
});

var Week = React.createClass({
    goto: function(day){
        console.log(this);
        this.props.goto(day);
    },
    change: function(day){
        if(day.date < this.props.month){
            this.props.previous();
        } else if(day.date > this.props.month){
            this.props.next();
        }
    },
    render: function() {
        var days = [],
            date = this.props.date,
            month = this.props.month;

        for (var i = 0; i < 7; i++) {
            var day = {
                name: date.format("dd").substring(0, 1),
                number: date.date(),
                isCurrentMonth: date.month() === month.month(),
                isToday: date.isSame(new Date(), "day"),
                beforeToday: date < new Date(),
                date: date
            };
            if(this.props.numbers[day.date.month()][day.number]){
                day.numberOfRecords = this.props.numbers[day.date.month()][day.number];
            }
            var goto = this.goto.bind(this, day);
            var change = this.change.bind(this, day);

            days.push(<span key={day.date.toString()} className={"day" + (day.isToday ? " today" : "") + (day.isCurrentMonth ? "" : " different-month") + (day.date.isSame(this.props.selected) ? " selected" : "")} onClick={goto}>{day.number}<br/>{day.numberOfRecords} </span>);

            date = date.clone();
            date.add(1, "d");

        }

        return <div className="week" key={days[0].toString()}>
						{days}
        </div>;
    }
});

//React.render(<Calendar selected={moment().startOf("day")} />, document.getElementById("calendar"));
		